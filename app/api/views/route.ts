import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  postId: z.string().uuid(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  }

  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", parsed.data.postId)
    .single();

  await supabase
    .from("posts")
    .update({ view_count: Number(data?.view_count ?? 0) + 1 })
    .eq("id", parsed.data.postId);

  return NextResponse.json({ success: true });
}
