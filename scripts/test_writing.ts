import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
  }
  
  // Find first '{' and last '}'
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return JSON.parse(cleaned);
}

async function testGrade() {
  console.log("Using API Key:", process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND");
  const prompt = `Bạn là một giám khảo chấm thi IELTS chuyên nghiệp. Hãy đánh giá chi tiết bài thi viết IELTS sau đây.
Bài thi bao gồm 2 phần: Task 1 và Task 2.
ĐỀ BÀI TASK 1:
- Loại: Academic Report
- Đề bài: Prompt 1
- Dữ liệu chi tiết: Desc 1
BÀI LÀM TASK 1 CỦA HỌC VIÊN:
"""
Test essay task 1. This is a report about internet and smartphone usage.
"""
ĐỀ BÀI TASK 2:
- Loại: Essay
- Đề bài: Prompt 2
BÀI LÀM TASK 2 CỦA HỌC VIÊN:
"""
Test essay task 2. In my opinion, internet has both positive and negative effects. Therefore, it is important to balance its use.
"""

Hãy đánh giá bài viết và chấm điểm cho từng Task theo 4 tiêu chí chính thức của IELTS:
1. Task Achievement / Task Response (TA/TR)
2. Coherence and Cohesion (CC)
3. Lexical Resource (LR)
4. Grammatical Range and Accuracy (GRA)

Bạn PHẢI trả về ĐÚNG 1 JSON object (không chứa định dạng markdown \`\`\`json hay text bên ngoài) theo schema mẫu sau đây bằng tiếng Việt:
{
  "estimatedBand": 6.5,
  "overallFeedbackVi": "Nhận xét tổng quan toàn bài thi viết của học viên, khích lệ và chỉ ra định hướng chung...",
  "taskFeedback": [
    {
      "taskId": "task1",
      "wordCount": 15,
      "estimatedBand": 6.0,
      "criteria": {
        "ta_tr": {
          "score": 6.0,
          "explanationVi": "Nhận xét chi tiết về mức độ đáp ứng yêu cầu đề bài của Task 1..."
        },
        "cc": {
          "score": 6.5,
          "explanationVi": "Nhận xét về tính mạch lạc và liên kết của Task 1..."
        },
        "lr": {
          "score": 6.0,
          "explanationVi": "Nhận xét về vốn từ vựng sử dụng trong Task 1..."
        },
        "gra": {
          "score": 5.5,
          "explanationVi": "Nhận xét về độ đa dạng và chính xác ngữ pháp trong Task 1..."
        }
      },
      "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
      "improvements": ["Điểm cần sửa 1", "Điểm cần sửa 2"],
      "grammarCorrections": [
        {
          "original": "câu sai ngữ pháp hoặc dùng từ sai của học viên",
          "correction": "câu đã được sửa lại cho đúng",
          "reasonVi": "giải thích vì sao sai và quy tắc sửa lỗi bằng tiếng Việt",
          "context": "ngữ cảnh xung quanh lỗi"
        }
      ],
      "modelAnswer": "Bản viết lại toàn bộ hoặc những đoạn quan trọng nâng cấp lên band 8.5+ dựa trên ý tưởng của học viên..."
    },
    {
      "taskId": "task2",
      "wordCount": 20,
      "estimatedBand": 6.5,
      "criteria": {
        "ta_tr": {
          "score": 6.5,
          "explanationVi": "Nhận xét chi tiết về cách trả lời luận đề Task 2..."
        },
        "cc": {
          "score": 6.5,
          "explanationVi": "Nhận xét về cấu trúc đoạn văn, liên kết ý trong Task 2..."
        },
        "lr": {
          "score": 6.0,
          "explanationVi": "Nhận xét về sử dụng từ vựng, từ đồng nghĩa trong Task 2..."
        },
        "gra": {
          "score": 7.0,
          "explanationVi": "Nhận xét về cấu trúc câu phức và độ chính xác ngữ pháp trong Task 2..."
        }
      },
      "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
      "improvements": ["Điểm cần sửa 1", "Điểm cần sửa 2"],
      "grammarCorrections": [
        {
          "original": "câu sai của học viên ở Task 2",
          "correction": "câu đúng",
          "reasonVi": "giải thích lỗi ngữ pháp/từ vựng bằng tiếng Việt",
          "context": "ngữ cảnh"
        }
      ],
      "modelAnswer": "Bài luận mẫu nâng cấp band 8.5+ dựa trên cấu trúc bài làm của học viên..."
    }
  ]
}

QUAN TRỌNG: Chỉ trả về JSON thuần túy.
Không được bọc trong \`\`\`json hay bất kỳ text nào bên ngoài JSON.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    console.log("Calling Gemini...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Raw Response:", text);
    const parsed = cleanAndParseJSON(text);
    console.log("Parsed estimatedBand:", parsed.estimatedBand);
    console.log("Success!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testGrade();
