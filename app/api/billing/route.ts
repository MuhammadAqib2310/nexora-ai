import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, PLANS, type PlanKey } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const upgradeSchema = {
  parse(body: unknown) {
    const b = body as Record<string, unknown>;
    if (!b.plan || !b.workspace_id) throw new Error("Missing required fields");
    return {
      plan: b.plan as string,
      billing_cycle: (b.billing_cycle as string) ?? "monthly",
      workspace_id: b.workspace_id as string,
    };
  },
};

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const { plan, billing_cycle, workspace_id } = upgradeSchema.parse(body);

    const stripe = getStripeClient();
    const planConfig = PLANS[plan as PlanKey];
    if (!planConfig) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId =
      billing_cycle === "annual"
        ? planConfig.priceIdAnnual
        : planConfig.priceIdMonthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      metadata: { workspace_id, plan, billing_cycle },
      subscription_data: {
        metadata: { workspace_id },
        trial_period_days: 14,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[POST /api/billing]", error);
    return NextResponse.json(
      { error: "Billing not available. Configure Stripe to enable payments." },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stripeCustomerId = searchParams.get("customer_id");
    if (!stripeCustomerId) {
      return NextResponse.json({ error: "customer_id required" }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[GET /api/billing]", error);
    return NextResponse.json(
      { error: "Billing portal not available." },
      { status: 503 }
    );
  }
}
