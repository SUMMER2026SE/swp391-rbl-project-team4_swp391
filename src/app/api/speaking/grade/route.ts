import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();
  
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
  }
  
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
  }

  try {
    const { answers, mode, topic } = await request.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers must be a valid array." }, { status: 400 });
    }

    const NO_SPEECH_MESSAGE = "(Không phát hiện lời nói. Bạn hãy kiểm tra lại micro và nói rõ hơn nhé.)";
    const validAnswers = answers.filter((ans: any) => {
      const text = (ans.transcript || "").trim();
      return text && text !== NO_SPEECH_MESSAGE && text.split(/\s+/).length >= 3;
    });

    if (validAnswers.length === 0) {
      return NextResponse.json({
        error: "Không tìm thấy câu trả lời bằng giọng nói hợp lệ nào để chấm điểm. Vui lòng kiểm tra lại thiết bị thu âm (micro)."
      }, { status: 400 });
    }

    const fullTranscriptText = validAnswers.map((ans: any) => `[${ans.part} - ${ans.questionText}]: ${ans.transcript}`).join("\n\n");

    const prompt = `
      You are an expert, highly critical IELTS Speaking Examiner. Evaluate the following student speaking response transcripts strictly according to the official IELTS Speaking Band Descriptors.
      
      Student Answers Transcripts:
      ${fullTranscriptText}

      Mode of Exam: ${mode || "mock"}
      Topic: ${topic || "general"}

      CRITICAL GRADING DIRECTIONS:
      1. DO NOT DEFAULT TO BAND 6.0 OR 6.5. You must perform an objective, strict, and precise evaluation based on the transcript's actual quality.
      2. Evaluate each criterion individually:
         - Fluency and Coherence (FC): Assess response length, rate of speech, hesitation, self-correction, coherence markers, and logical flow. Very short answers (1-2 simple sentences per question) must not receive more than 4.5 or 5.0.
         - Lexical Resource (LR): Assess range and precision of vocabulary, collocation usage, ability to paraphrase, and idiomatic expressions. Simple, repetitive words warrant a lower score (e.g., 4.5 - 5.5).
         - Grammatical Range and Accuracy (GRA): Assess complexity and variety of sentence structures (simple, compound, complex), tense consistency, and frequency/severity of grammatical errors. Frequent basic errors (e.g., subject-verb agreement, basic tenses) must be penalized.
         - Pronunciation (P): Since you are grading a text transcript, deduce pronunciation and stress issues from the coherence, phrasing, and transcript cues (or give a realistic evaluation based on the lexical/grammatical maturity of the student's responses).
      3. All scores (fc, lr, gra, p) must be numbers from 0 to 9.0 in increments of 0.5 (e.g., 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, etc.).
      4. Calculate the overallBand precisely as the mathematical average of the 4 sub-scores, rounded to the nearest half-band (e.g. average of 5.625 rounds to 5.5; average of 5.75 rounds to 6.0).
      5. Provide constructive feedback comments in VIETNAMESE. Focus on specific issues and highlight why they received this score.

      Respond ONLY with a JSON object in this exact schema structure (do not copy these placeholder scores, calculate the real ones):
      {
        "overallBand": 5.5,
        "fc": 5.0,
        "fcComment": "Detailed feedback on Fluency and Coherence in Vietnamese...",
        "lr": 5.5,
        "lrComment": "Detailed feedback on Lexical Resource in Vietnamese...",
        "gra": 5.5,
        "graComment": "Detailed feedback on Grammatical Range and Accuracy in Vietnamese...",
        "p": 6.0,
        "pComment": "Detailed feedback on Pronunciation in Vietnamese...",
        "feedbackVi": "General summary and actionable tips in Vietnamese to improve speaking score...",
        "corrections": [
          { "original": "original text with issue", "corrected": "corrected version", "explanation": "explanation of correction in Vietnamese" }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = cleanAndParseJSON(text);

    return NextResponse.json({ success: true, grade: parsed });
  } catch (error: any) {
    console.error("❌ Speaking AI Grading Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
