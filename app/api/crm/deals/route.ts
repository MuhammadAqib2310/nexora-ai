import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createDealSchema = z.object({
  title: z.string().min(1),
  contact_id: z.string().uuid().optional(),
  pipeline_id: z.string().uuid().optional(),
  stage_id: z.string().uuid().optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  close_date: z.string().optional(),
  notes: z.string().optional(),
  probability: z.number().min(0).max(100).default(50),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspace_id");
    if (!workspaceId) {
      return NextResponse.json({ error: "workspace_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deals")
      .select(`
        *,
        contact:contacts(id, first_name, last_name, email, company),
        stage:pipeline_stages(id, name, color, position)
      `)
      .eq("workspace_id", workspaceId)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/crm/deals]", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = createDealSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspace_id");
    if (!workspaceId) {
      return NextResponse.json({ error: "workspace_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deals")
      .insert({ ...parsed.data, workspace_id: workspaceId })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/crm/deals]", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
