import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: 49,
    annualPrice: 39,
    users: 1,
    aiRequests: 1000,
    features: ["CRM", "Website Builder", "Basic Analytics"],
    priceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
    priceIdAnnual: process.env.STRIPE_PRICE_STARTER_ANNUAL!,
  },
  professional: {
    name: "Professional",
    monthlyPrice: 149,
    annualPrice: 119,
    users: 5,
    aiRequests: 5000,
    features: [
      "CRM",
      "Website Builder",
      "Analytics",
      "Marketing Engine",
      "WhatsApp Agent",
    ],
    priceIdMonthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY!,
    priceIdAnnual: process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL!,
  },
  business: {
    name: "Business",
    monthlyPrice: 349,
    annualPrice: 279,
    users: 20,
    aiRequests: 20000,
    features: [
      "Everything in Professional",
      "Voice Agent",
      "AI CEO Mode",
      "Team Manager",
      "Document Center",
    ],
    priceIdMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
    priceIdAnnual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
