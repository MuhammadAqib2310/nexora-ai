import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { z } from "zod";

const upgradeSchema = z.object({
  plan: z.enum(["starter", "professional", "business"]),
  billing_cycle: z.enum(["monthly", "annual"]).default("monthly"),
  workspace_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = upgradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { plan, billing_cycle, workspace_id } = parsed.data;
    const planConfig = PLANS[plan as PlanKey];

    const priceId =
      billing_cycle === "annual"
        ? planConfig.priceIdAnnual
        : planConfig.priceIdMonthly;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
      metadata: {
        workspace_id,
        plan,
        billing_cycle,
      },
      subscription_data: {
        metadata: {
          workspace_id,
          user_id: userId,
        },
        trial_period_days: 14,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[POST /api/billing]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// GET — create billing portal session
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stripeCustomerId = searchParams.get("customer_id");

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "customer_id required" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[GET /api/billing]", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
