import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function requireAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  
  let user = null;
  if (token) {
    const { data } = await supabaseAdmin.auth.getUser(token);
    user = data?.user || null;
  }

  return { supabase: supabaseAdmin, user, denied: null };
}

export async function GET(request: NextRequest) {
  const source = new URL(request.url).searchParams.get("source");

  let query = supabaseAdmin
    .from("bilingual_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (source) query = query.eq("source_id", source);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ articles: data || [] });
}

export async function POST(request: NextRequest) {
  const { supabase, user, denied } = await requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const {
    source_id, source_url, source_label, title, title_vi,
    category, category_vi, excerpt, excerpt_vi,
    image_url, author, read_time, content,
  } = body;

  if (!source_id || !title) {
    return NextResponse.json({ error: "source_id and title are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("bilingual_articles")
    .insert({
      source_id,
      source_url: source_url || "",
      source_label: source_label || "",
      title,
      title_vi: title_vi || "",
      category: category || "",
      category_vi: category_vi || "",
      excerpt: excerpt || "",
      excerpt_vi: excerpt_vi || "",
      image_url: image_url || "",
      author: author || "",
      read_time: read_time || "",
      content: Array.isArray(content) ? content : [],
      ...(user ? { created_by: user.id } : {})
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data });
}

export async function DELETE(request: NextRequest) {
  const { supabase, denied } = await requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("bilingual_articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  const { supabase, denied } = await requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json();
  const {
    title, title_vi, category, category_vi, excerpt, excerpt_vi,
    image_url, author, read_time, source_url, source_label, content,
  } = body;

  const { data, error } = await supabase
    .from("bilingual_articles")
    .update({
      title, title_vi, category, category_vi, excerpt, excerpt_vi,
      image_url, author, read_time,
      source_url: source_url || "",
      source_label: source_label || "",
      ...(Array.isArray(content) ? { content } : {}),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data });
}
