import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

// 1. Load .env.local variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("=").trim();
        process.env[key] = val;
      }
    });
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kaoybbpezkkmufzbhxru.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb3liYnBlemtrbXVmemJoeHJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI2Nzc5NSwiZXhwIjoyMDk0ODQzNzk1fQ.7VT1X4qttHogRpiJoKNxjFJ5cMUAqmQyg4m_7wxk3F8";
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("Error: GEMINI_API_KEY is missing in environment variables!");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

interface ChunkInput {
  content: string;
  source_type: "grammar" | "vocabulary" | "flashcard";
  metadata: Record<string, any>;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Robust embed with retry and backoff
async function embedWithRetry(chunk: ChunkInput, retries = 5, delayMs = 3000): Promise<number[] | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await embeddingModel.embedContent({
        content: { role: "user", parts: [{ text: chunk.content }] },
        outputDimensionality: 768,
      } as any);
      return result.embedding.values;
    } catch (err: any) {
      const errStr = String(err);
      const isRateLimit = errStr.includes("429") || errStr.includes("quota") || errStr.includes("Quota");
      const isServerErr = errStr.includes("503") || errStr.includes("unavailable");
      
      if ((isRateLimit || isServerErr) && attempt < retries) {
        console.warn(`[API Info] Rate limit or server busy for chunk "${chunk.content.substring(0, 30)}...". Retrying in ${delayMs}ms (Attempt ${attempt}/${retries})...`);
        await sleep(delayMs);
        delayMs *= 2; // exponential backoff
        continue;
      }
      console.error(`Failed to embed chunk "${chunk.content.substring(0, 30)}..." after ${attempt} attempts:`, err);
      return null;
    }
  }
  return null;
}

async function main() {
  console.log("Starting embedding pipeline with Gemini (gemini-embedding-2, 768 dimensions, Rate Limit Friendly)...");
  const chunks: ChunkInput[] = [];

  // --- A. Process grammar_lessons ---
  console.log("Fetching grammar lessons...");
  const { data: grammarLessons, error: grammarErr } = await supabaseAdmin
    .from("grammar_lessons")
    .select("lesson_id, title, band, sections");

  if (grammarErr) {
    console.error("Error fetching grammar_lessons:", grammarErr);
  } else if (grammarLessons) {
    console.log(`Processing ${grammarLessons.length} grammar lessons...`);
    for (const lesson of grammarLessons) {
      if (lesson.sections && Array.isArray(lesson.sections)) {
        for (const section of lesson.sections) {
          const title = section.title || "";
          const explanation = section.explanation || "";
          const examples = section.examples && Array.isArray(section.examples)
            ? section.examples.map((e: string) => `- ${e}`).join("\n")
            : "";
          const mistakes = section.common_mistakes && Array.isArray(section.common_mistakes)
            ? section.common_mistakes.map((m: string) => `- ${m}`).join("\n")
            : "";
          
          const content = `Lesson: ${lesson.title} (Band ${lesson.band})\nSection: ${title}\nExplanation: ${explanation}\n${examples ? "Examples:\n" + examples + "\n" : ""}${mistakes ? "Common Mistakes:\n" + mistakes : ""}`.trim();
          
          if (content) {
            chunks.push({
              content,
              source_type: "grammar",
              metadata: {
                topic: lesson.lesson_id,
                band: lesson.band,
                section_title: title,
                source: "grammar",
              },
            });
          }
        }
      }
    }
  }

  // --- B. Process vocabulary ---
  console.log("Fetching vocabulary...");
  const { data: vocabulary, error: vocabErr } = await supabaseAdmin
    .from("vocabulary")
    .select("word, meaning, example, category, level");

  if (vocabErr) {
    console.error("Error fetching vocabulary:", vocabErr);
  } else if (vocabulary) {
    console.log(`Processing ${vocabulary.length} vocabulary items...`);
    for (const item of vocabulary) {
      const content = `Từ vựng: ${item.word}\nNghĩa: ${item.meaning}\nVí dụ: ${item.example || ""}`.trim();
      if (content) {
        chunks.push({
          content,
          source_type: "vocabulary",
          metadata: {
            category: item.category,
            level: item.level,
            source: "vocabulary",
          },
        });
      }
    }
  }

  // --- C. Process vocab_flashcards ---
  console.log("Fetching vocab flashcards...");
  const { data: flashcards, error: flashErr } = await supabaseAdmin
    .from("vocab_flashcards")
    .select("word, category, frequency");

  if (flashErr) {
    console.error("Error fetching vocab_flashcards:", flashErr);
  } else if (flashcards) {
    console.log(`Processing ${flashcards.length} flashcards...`);
    for (const card of flashcards) {
      const content = `Flashcard: ${card.word} (${card.category})`.trim();
      if (content) {
        chunks.push({
          content,
          source_type: "flashcard",
          metadata: {
            category: card.category,
            frequency: card.frequency,
            source: "flashcard",
          },
        });
      }
    }
  }

  console.log(`Total chunks to process: ${chunks.length}`);

  // Clean old chunks
  console.log("Deleting existing chunks in ielts_knowledge_chunks...");
  const { error: deleteErr } = await supabaseAdmin
    .from("ielts_knowledge_chunks")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all

  if (deleteErr) {
    console.error("Error cleaning up table ielts_knowledge_chunks:", deleteErr);
  }

  // --- D. Embed and Insert ---
  // Smaller batch size and longer delays to remain under free tier rate limits safely
  const batchSize = 5;
  let successCount = 0;
  const countBySource: Record<string, number> = { grammar: 0, vocabulary: 0, flashcard: 0 };

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    console.log(`Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)} (Index ${i} to ${i + batch.length})...`);

    try {
      // Get embeddings for this batch in parallel with retry
      const embeddingPromises = batch.map((chunk) => embedWithRetry(chunk));
      const embeddings = await Promise.all(embeddingPromises);

      const insertData = batch
        .map((chunk, index) => {
          const embedding = embeddings[index];
          if (!embedding) return null;
          return {
            content: chunk.content,
            source_type: chunk.source_type,
            metadata: chunk.metadata,
            embedding: embedding,
          };
        })
        .filter((item) => item !== null) as any[];

      if (insertData.length > 0) {
        const { error: insertErr } = await supabaseAdmin
          .from("ielts_knowledge_chunks")
          .insert(insertData);

        if (insertErr) {
          console.error(`Error inserting batch starting at index ${i}:`, insertErr);
        } else {
          successCount += insertData.length;
          batch.forEach((chunk, index) => {
            if (embeddings[index]) {
              countBySource[chunk.source_type] = (countBySource[chunk.source_type] || 0) + 1;
            }
          });
        }
      }
    } catch (err) {
      console.error(`Exception during batch starting at index ${i}:`, err);
    }

    // Delay 1000ms between batches to stay under rate limits
    await sleep(1000);
  }

  console.log("\n=== Embedding Pipeline Completed ===");
  console.log(`Successfully embedded and inserted: ${successCount}/${chunks.length} chunks`);
  console.log("Breakdown by source type:", countBySource);
}

main().catch(console.error);
