import { supabase } from "@/lib/supabase";

export async function fetchSpeakingTopics() {
  // Try fetching from speaking_topics table
  const { data, error } = await supabase
    .from("speaking_topics")
    .select("*")
    .eq("is_active", true)
    .order("part")
    .order("created_at");

  if (error) {
    console.warn("Could not fetch speaking topics from speaking_topics, checking exams table:", error.message);
    
    // Fallback: check exams table for category = 'speaking'
    const { data: examsData, error: examsError } = await supabase
      .from("exams")
      .select("id, title, description, category")
      .eq("category", "speaking");

    if (examsError) {
      console.error("Error fetching speaking exams fallback:", examsError);
      throw examsError;
    }
    return examsData || [];
  }

  return data || [];
}

export async function saveSpeakingSession(payload: {
  userId: string;
  mode: string;
  topicId: string;
  transcript: string;
  fcScore: number;
  lrScore: number;
  graScore: number;
  pScore: number;
  overallBand: number;
  wpm?: number;
  fillerCount?: number;
  feedbackJson: any;
}) {
  const { data, error } = await supabase.from("speaking_sessions").insert({
    user_id: payload.userId,
    mode: payload.mode,
    topic_id: payload.topicId,
    transcript: payload.transcript,
    fc_score: payload.fcScore,
    lr_score: payload.lrScore,
    gra_score: payload.graScore,
    p_score: payload.pScore,
    overall_band: payload.overallBand,
    wpm: payload.wpm ?? null,
    filler_count: payload.fillerCount ?? null,
    feedback_json: payload.feedbackJson,
  });

  if (error) {
    console.error("Error saving speaking session:", error);
    throw error;
  }
  return data;
}
