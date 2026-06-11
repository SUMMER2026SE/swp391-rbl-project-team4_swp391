import { supabase } from "@/lib/supabase";

export async function fetchDiagnosticQuestions() {
  let listening: any[] = [];
  try {
    const { data: tasks } = await supabase
      .from("listening_tasks")
      .select("*");
      
    if (tasks && tasks.length > 0) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const challenges = randomTask.challenges || [];
      listening = challenges.slice(0, 3).map((q: any, idx: number) => ({
        id: `l${idx + 1}`,
        skill: "listening",
        content: {
          test_name: randomTask.lesson_name,
          transcript: q.transcript || `Listen to the audio segment to answer: "${q.text || q.statement || ''}"`
        },
        extra_data: {
          type: q.type === "multiple_choice" ? "multiple_choice" : "fill_in_blank",
          questionText: q.text || q.statement || "",
          options: q.options || [],
          correctAnswer: q.correct_answer || (q.answers ? q.answers[0] : "")
        }
      }));
    }
  } catch (err) {
    console.error("Listening diagnostic random query failed:", err);
  }

  let reading: any[] = [];
  try {
    const { data: passagesList } = await supabase
      .from("reading_passages")
      .select("*")
      .eq("is_visible", true);
      
    const validPassages = passagesList ? passagesList.filter(p => p.questions && p.questions.length > 0) : [];
    if (validPassages.length >= 2) {
      const selected = validPassages.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      // Passage 1: True/False/Not Given
      const p1 = selected[0];
      const p1TfngQs = (p1.questions || []).filter((q: any) => q.type === "true_false_not_given" || q.type === "tfng");
      const p1Questions = p1TfngQs.length >= 3 ? p1TfngQs.slice(0, 3) : (p1.questions || []).slice(0, 3);
      
      reading.push({
        id: "r1",
        skill: "reading",
        content: {
          title: p1.title,
          content_html: p1.content_html
        },
        extra_data: {
          type: "true_false_not_given",
          items: p1Questions.map((q: any) => ({
            statement: q.statement || q.text || q.prompt || "",
            correctAnswer: q.correct_answer || ""
          }))
        }
      });
      
      // Passage 2: Multiple Choice
      const p2 = selected[1];
      const p2McqQs = (p2.questions || []).filter((q: any) => q.type === "multiple_choice" || q.type === "mcq");
      const p2Question = p2McqQs.length > 0 ? p2McqQs[0] : (p2.questions || [])[0];
      
      reading.push({
        id: "r2",
        skill: "reading",
        content: {
          title: p2.title,
          content_html: p2.content_html
        },
        extra_data: {
          type: "multiple_choice",
          questionText: p2Question ? (p2Question.statement || p2Question.text || p2Question.prompt || "") : "",
          options: p2Question ? (p2Question.options || []) : []
        }
      });
    }
  } catch (err) {
    console.error("Reading diagnostic random query failed:", err);
  }

  let writing: any[] = [];
  try {
    const { data: tasks } = await supabase
      .from("writing_tasks")
      .select("*")
      .eq("is_visible", true);
      
    if (tasks && tasks.length > 0) {
      const task1s = tasks.filter(t => t.task_type === "task1");
      const task2s = tasks.filter(t => t.task_type === "task2");
      
      if (task1s.length > 0) {
        const t1 = task1s[Math.floor(Math.random() * task1s.length)];
        writing.push({
          id: "w1",
          skill: "writing",
          content: {
            task_type: "task1",
            description: t1.description,
            title: t1.title
          },
          extra_data: {
            chartDescription: t1.visual_description || ""
          }
        });
      }
      
      if (task2s.length > 0) {
        const t2 = task2s[Math.floor(Math.random() * task2s.length)];
        writing.push({
          id: "w2",
          skill: "writing",
          content: {
            task_type: "task2",
            description: t2.description,
            title: t2.title
          },
          extra_data: {}
        });
      }
    }
  } catch (err) {
    console.error("Writing diagnostic random query failed:", err);
  }

  let speaking: any[] = [];
  try {
    const { data: topics } = await supabase
      .from("speaking_topics")
      .select("*")
      .eq("is_active", true);
      
    if (topics && topics.length > 0) {
      const part1s = topics.filter(t => t.part === 1);
      const part2s = topics.filter(t => t.part === 2);
      
      if (part1s.length > 0) {
        const t1 = part1s[Math.floor(Math.random() * part1s.length)];
        speaking.push({
          id: "sp1",
          skill: "speaking",
          content: {
            questions: t1.questions
          },
          extra_data: {
            instruction: "Answer the following questions as you would in a real IELTS Speaking test. Write your answers."
          }
        });
      }
      
      if (part2s.length > 0) {
        const t2 = part2s[Math.floor(Math.random() * part2s.length)];
        speaking.push({
          id: "sp2",
          skill: "speaking",
          content: {
            cue_card: t2.questions?.cue_card || t2.topic,
            bullet_points: t2.questions?.bullet_points || []
          },
          extra_data: {
            instruction: "You have 1 minute to prepare, then speak for up to 2 minutes. Write your spoken response."
          }
        });
      }
    }
  } catch (err) {
    console.error("Speaking diagnostic random query failed:", err);
  }

  return {
    listening,
    reading,
    writing,
    speaking
  };
}

export async function saveDiagnosticResult(payload: {
  userId: string;
  overallBand: number;
  listeningBand: number;
  readingBand: number;
  writingBand: number;
  speakingBand: number;
  fullResult: any;
  answers: any;
}) {
  const { data: resultData, error: resultError } = await supabase
    .from("diagnostic_results")
    .insert({
      user_id: payload.userId,
      overall_band: payload.overallBand,
      listening_band: payload.listeningBand,
      reading_band: payload.readingBand,
      writing_band: payload.writingBand,
      speaking_band: payload.speakingBand,
      full_result: payload.fullResult,
      answers: payload.answers,
    })
    .select()
    .single();

  if (resultError) {
    console.error("Error saving diagnostic results:", resultError);
    throw resultError;
  }

  // Also save practice history row
  const { error: practiceError } = await supabase.from("practice_history").insert({
    user_id: payload.userId,
    category: "diagnostic",
    test_id: "diagnostic",
    test_name: "IELTS Diagnostic Test",
    score: payload.overallBand,
    total: 9,
    metadata: {
      listening_band: payload.listeningBand,
      reading_band: payload.readingBand,
      writing_band: payload.writingBand,
      speaking_band: payload.speakingBand,
      roadmap: payload.fullResult?.roadmap,
    },
  });

  if (practiceError) {
    console.error("Error saving diagnostic practice history:", practiceError);
  }

  return resultData;
}
