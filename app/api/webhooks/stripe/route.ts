import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { workspace_id, plan, billing_cycle } = session.metadata ?? {};
        if (!workspace_id || !plan) break;

        await supabase
          .from("workspaces")
          .update({
            plan,
            plan_status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", workspace_id);

        if (session.subscription) {
          const stripe = getStripeClient();
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const item = sub.items.data[0];
          await supabase.from("subscriptions").insert({
            workspace_id,
            plan,
            billing_cycle: billing_cycle ?? "monthly",
            amount: item ? (item.price.unit_amount ?? 0) / 100 : 0,
            currency: sub.currency,
            status: sub.status,
            stripe_subscription_id: sub.id,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const workspaceId = sub.metadata?.workspace_id;
        if (!workspaceId) break;

        await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            cancel_at_period_end: sub.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", sub.id);

        await supabase
          .from("workspaces")
          .update({
            plan_status: sub.status === "active" ? "active" : "past_due",
          })
          .eq("id", workspaceId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const workspaceId = sub.metadata?.workspace_id;
        if (!workspaceId) break;

        await supabase
          .from("workspaces")
          .update({ plan: "starter", plan_status: "canceled" })
          .eq("id", workspaceId);

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_succeeded": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const workspaceId: string | null =
          invoice?.subscription_details?.metadata?.workspace_id ?? null;
        if (!workspaceId) break;

        await supabase.from("payments").insert({
          workspace_id: workspaceId,
          amount: ((invoice.amount_paid as number) ?? 0) / 100,
          currency: invoice.currency ?? "usd",
          status: "succeeded",
          stripe_payment_intent_id: (invoice.payment_intent as string) ?? null,
          stripe_charge_id: (invoice.charge as string) ?? null,
          metadata: { invoice_id: invoice.id },
        });
        break;
      }

      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const workspaceId: string | null =
          invoice?.subscription_details?.metadata?.workspace_id ?? null;
        if (!workspaceId) break;

        await supabase
          .from("workspaces")
          .update({ plan_status: "past_due" })
          .eq("id", workspaceId);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Handler error for ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
