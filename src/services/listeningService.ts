import { supabase } from "@/lib/supabase";

export async function fetchListeningTests() {
  const { data, error } = await supabase
    .from("listening_cam_tests")
    .select("id, test_id, test_name, volume, test_number, has_audio")
    .eq("is_visible", true)
    .order("volume")
    .order("test_number");

  if (error) {
    console.error("Error fetching listening tests:", error);
    throw error;
  }
  return data;
}

export async function fetchListeningTestById(id: string) {
  const { data, error } = await supabase
    .from("listening_cam_tests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching listening test ${id}:`, error);
    throw error;
  }
  return data;
}

export async function fetchListeningTasks() {
  const { data, error } = await supabase
    .from("listening_tasks")
    .select("id, lesson_id, lesson_name, audio_src, challenges, metadata")
    .order("lesson_id");

  if (error) {
    console.error("Error fetching listening tasks:", error);
    throw error;
  }
  return data;
}

export async function saveListeningResult(payload: {
  userId: string;
  testId: string;
  testName: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  timeSpentSeconds: number;
}) {
  const { data, error } = await supabase.from("practice_history").insert({
    user_id: payload.userId,
    category: "listening",
    test_id: payload.testId,
    test_name: payload.testName,
    score: payload.score,
    total: payload.total,
    metadata: {
      answers: payload.answers,
      time_spent_seconds: payload.timeSpentSeconds,
    },
  });

  if (error) {
    console.error("Error saving listening result:", error);
    throw error;
  }
  return data;
}
