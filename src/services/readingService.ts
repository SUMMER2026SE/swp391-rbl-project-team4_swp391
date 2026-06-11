import { supabase } from "@/lib/supabase";

export async function fetchReadingPassages() {
  const { data, error } = await supabase
    .from("reading_passages")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reading passages:", error);
    throw error;
  }
  return data;
}

export async function fetchReadingPassageById(id: string) {
  const { data, error } = await supabase
    .from("reading_passages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching reading passage ${id}:`, error);
    throw error;
  }
  return data;
}

export async function saveReadingResult(payload: {
  userId: string;
  testId: string;
  testName: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  bandLevel: string | number;
  timeSpentSeconds: number;
}) {
  const { data, error } = await supabase.from("practice_history").insert({
    user_id: payload.userId,
    category: "reading",
    test_id: payload.testId,
    test_name: payload.testName,
    score: payload.score,
    total: payload.total,
    metadata: {
      answers: payload.answers,
      band_level: payload.bandLevel,
      time_spent_seconds: payload.timeSpentSeconds,
    },
  });

  if (error) {
    console.error("Error saving reading result:", error);
    throw error;
  }
  return data;
}
