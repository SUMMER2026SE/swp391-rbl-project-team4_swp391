import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;
    const hint = formData.get("hint") as string;

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Prepare form data for Groq Whisper or OpenAI Whisper API
    // We will use OpenRouter if GROQ is not available, but OpenRouter does not support audio yet.
    // So we try OpenAI API directly if available, or Groq API directly.
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openaiKey) {
       console.log("No audio API keys available, returning empty transcript to rely on client-side Web Speech API.");
       // Fallback to client-side only
       return NextResponse.json({ transcript: "" });
    }

    const apiUrl = groqKey 
        ? "https://api.groq.com/openai/v1/audio/transcriptions"
        : "https://api.openai.com/v1/audio/transcriptions";

    const apiKey = groqKey || openaiKey;
    const model = groqKey ? "whisper-large-v3-turbo" : "whisper-1";

    const outgoingFormData = new FormData();
    outgoingFormData.append("file", audio, "audio.webm");
    outgoingFormData.append("model", model);
    outgoingFormData.append("language", "en");
    if (hint) {
        outgoingFormData.append("prompt", hint);
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: outgoingFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Transcription API error:", errText);
      return NextResponse.json(
        { error: `Transcription error ${res.status}: ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ transcript: data.text || "" });

  } catch (error: any) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
