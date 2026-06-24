import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export type BusinessContext = {
  workspaceName: string;
  industry?: string;
  totalRevenueMtd?: number;
  activeLeads?: number;
  conversionRate?: number;
  activeCampaigns?: number;
  topDeals?: Array<{ title: string; value: number; probability: number }>;
};

export type CeoAnalysis = {
  summary: string;
  gaps: Array<{
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
  }>;
  strategies: Array<{
    title: string;
    description: string;
    expected_roi: string;
    effort: "low" | "medium" | "high";
    actions: string[];
  }>;
  next_steps: string[];
};

const SYSTEM_PROMPT = `You are NEXORA AI's AI CEO — an autonomous business strategy AI. 
You analyze business data, identify performance gaps, and propose ranked strategies with expected ROI.
Be direct, data-driven, and actionable. Format all responses as valid JSON matching the schema provided.
Focus on practical, executable strategies that can show results within 30-90 days.`;

export async function runCeoCommand(
  command: string,
  context: BusinessContext
): Promise<CeoAnalysis> {
  const contextSummary = `
Business: ${context.workspaceName}
Industry: ${context.industry ?? "Not specified"}
Revenue (MTD): $${context.totalRevenueMtd?.toLocaleString() ?? "Unknown"}
Active Leads: ${context.activeLeads ?? "Unknown"}
Conversion Rate: ${context.conversionRate ?? "Unknown"}%
Active Campaigns: ${context.activeCampaigns ?? "Unknown"}
Top Deals: ${JSON.stringify(context.topDeals ?? [])}
  `.trim();

  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Business Context:\n${contextSummary}\n\nUser Goal: "${command}"\n\nAnalyze this business goal against the context and return a JSON object with this exact structure:
{
  "summary": "2-3 sentence executive summary",
  "gaps": [
    { "title": "Gap name", "description": "What's missing", "impact": "high|medium|low" }
  ],
  "strategies": [
    { 
      "title": "Strategy name", 
      "description": "What to do", 
      "expected_roi": "e.g. +25% revenue in 90 days",
      "effort": "low|medium|high",
      "actions": ["action 1", "action 2", "action 3"]
    }
  ],
  "next_steps": ["Immediate step 1", "Immediate step 2", "Immediate step 3"]
}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from AI");
  }

  // Extract JSON from response (handles markdown code blocks)
  const jsonMatch =
    content.text.match(/```json\n?([\s\S]*?)\n?```/) ??
    content.text.match(/(\{[\s\S]*\})/);

  if (!jsonMatch?.[1]) {
    throw new Error("Could not parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[1]) as CeoAnalysis;
}

export async function streamCeoCommand(
  command: string,
  context: BusinessContext,
  onChunk: (text: string) => void
): Promise<void> {
  const contextSummary = `
Business: ${context.workspaceName}
Industry: ${context.industry ?? "Not specified"}
Revenue (MTD): $${context.totalRevenueMtd?.toLocaleString() ?? "Unknown"}
Active Leads: ${context.activeLeads ?? "Unknown"}
  `.trim();

  const stream = await anthropic.messages.stream({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1500,
    system:
      "You are NEXORA AI's AI CEO. Analyze business goals and provide clear, actionable strategic guidance. Be concise and direct.",
    messages: [
      {
        role: "user",
        content: `Business: ${contextSummary}\n\nGoal: "${command}"\n\nProvide a strategic analysis with: 1) Key performance gaps, 2) Top 3 strategies with expected ROI, 3) Immediate next steps.`,
      },
    ],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      onChunk(chunk.delta.text);
    }
  }
}
