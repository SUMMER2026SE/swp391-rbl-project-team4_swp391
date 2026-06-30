import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lessonId = searchParams.get("lesson_id");

    if (lessonId) {
      // Fetch single lesson
      const { data: lesson, error } = await supabaseAdmin
        .from("grammar_lessons")
        .select("*")
        .eq("lesson_id", lessonId)
        .single();

      if (error) throw error;
      return NextResponse.json({ lesson });
    } else {
      // Fetch all lessons list
      const { data: lessons, error } = await supabaseAdmin
        .from("grammar_lessons")
        .select("id,lesson_id,title,band,order_index")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return NextResponse.json({ lessons });
    }
  } catch (error: any) {
    console.error("Error in GET /api/grammar:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
