import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { requireRole, ADMIN_OR_INSTRUCTOR } from "@/lib/roles";

// GET /api/admin/exams/[id] — Get exam detail with sections
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: exam, error } = await supabaseAdmin
      .from("exams")
      .select("*, exam_sections(*)")
      .eq("id", id)
      .order("section_no", { referencedTable: "exam_sections", ascending: true })
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return Response.json({ error: "Không tìm thấy đề thi" }, { status: 404 });
      }
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ exam });
  } catch (err) {
    console.error("GET /api/admin/exams/[id] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/exams/[id] — Update exam + sections
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, audio_url, cambridge_no, test_no, status, sections } = body;

    if (!title) {
      return Response.json({ error: "Tiêu đề đề thi là bắt buộc" }, { status: 400 });
    }

    // Update exam metadata
    const { data: exam, error: examError } = await supabaseAdmin
      .from("exams")
      .update({
        title,
        description: description || null,
        audio_url: audio_url || null,
        cambridge_no: cambridge_no ? parseInt(cambridge_no) : null,
        test_no: test_no ? parseInt(test_no) : null,
        status: status || "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (examError) {
      return Response.json({ error: examError.message }, { status: 500 });
    }

    // Update sections: delete existing and re-insert
    if (sections && Array.isArray(sections)) {
      await supabaseAdmin.from("exam_sections").delete().eq("exam_id", id);

      if (sections.length > 0) {
        const sectionsToInsert = sections.map((s: any) => ({
          exam_id: id,
          section_no: s.section_no,
          title: s.title || `Section ${s.section_no}`,
          content: s.content || null,
          answers: s.answers || null,
        }));

        const { error: sectionsError } = await supabaseAdmin
          .from("exam_sections")
          .insert(sectionsToInsert);

        if (sectionsError) {
          return Response.json({ error: sectionsError.message }, { status: 500 });
        }
      }
    }

    return Response.json({ exam });
  } catch (err) {
    console.error("PUT /api/admin/exams/[id] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/exams/[id] — Delete exam (sections cascade, then remove audio)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First fetch to get audio_url for storage cleanup
    const { data: exam } = await supabaseAdmin
      .from("exams")
      .select("audio_url")
      .eq("id", id)
      .single();

    // Delete exam (cascade deletes sections)
    const { error } = await supabaseAdmin.from("exams").delete().eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Cleanup audio from Supabase Storage if exists
    if (exam?.audio_url) {
      try {
        const url = new URL(exam.audio_url);
        // Extract path after /storage/v1/object/public/exam-audio/
        const pathMatch = url.pathname.match(/\/exam-audio\/(.+)$/);
        if (pathMatch) {
          await supabaseAdmin.storage.from("exam-audio").remove([pathMatch[1]]);
        }
      } catch {
        // Non-blocking: log but don't fail if storage cleanup fails
        console.warn("Could not remove audio file from storage for exam:", id);
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/exams/[id] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
