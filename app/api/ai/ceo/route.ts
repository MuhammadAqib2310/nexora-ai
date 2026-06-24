import { NextRequest, NextResponse } from "next/server";
import { runCeoCommand } from "@/lib/ai/ceo";
import { z } from "zod";

const commandSchema = z.object({
  command: z.string().min(1).max(1000),
});

// Demo business context — in production pull from Supabase
const DEMO_CONTEXT = {
  workspaceName: "Acme Digital Agency",
  industry: "Digital Marketing",
  totalRevenueMtd: 58900,
  activeLeads: 124,
  conversionRate: 18.7,
  activeCampaigns: 5,
  topDeals: [
    { title: "ShopWave E-commerce Suite", value: 36000, probability: 85 },
    { title: "TechCorp Annual Contract", value: 24000, probability: 75 },
    { title: "HealthPlus Pilot Program", value: 12000, probability: 95 },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = commandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const analysis = await runCeoCommand(parsed.data.command, DEMO_CONTEXT);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({ analysis, latencyMs });
  } catch (error) {
    console.error("[AI CEO]", error);
    return NextResponse.json(
      { error: "AI analysis failed. Please add your ANTHROPIC_API_KEY to .env.local" },
      { status: 500 }
    );
  }
}
