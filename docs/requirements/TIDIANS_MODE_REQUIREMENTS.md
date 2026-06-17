# "Tidians" Flashcard Mode — Requirements Spec

> **Mode label:** `Tidians`
> **Subtitle:** `Đặt câu & luyện nói` ("Make sentences & practice speaking")
> **Icon:** microphone (`Mic`), accent color `#7C5BA6` (purple)
> **Purpose:** A premium vocabulary-practice mode where the learner takes target words and (a) **writes** sentences using them (AI-graded on IELTS band scale) and (b) **speaks** aloud a target sentence (pronunciation-scored). Unlike the other flashcard modes, it does **not** mark words as remembered/forgotten — it is pure practice.

This document is a self-contained spec to re-implement the mode in another project. It is framework-agnostic in intent but written against a Next.js + React + Supabase + Groq/OpenRouter stack.

---

## 1. Overview & Scope

The mode is launched from a vocabulary flashcard screen. The user picks a set of words; the mode opens **full-screen** and presents one word at a time with two tabs:

| Tab | Label (VI) | What the user does | Scored by |
| --- | --- | --- | --- |
| **Write** (`sentence_build`) | `Viết` | Types a full English sentence that contains the target word | LLM → IELTS band 0–9 |
| **Speak** (`speak_build`) | `Nói` | Reads a target sentence aloud into the mic | Client-side word-match → 0–100% |

The user can switch tabs freely per word. Progress is saved to `localStorage` (resumable). On completion, a summary is shown and a session record is POSTed to history.

### Access tiers

- **Logged-in users:** unlimited use of both tabs regardless of role.
- **Unauthenticated users:** the API endpoints return `401 Unauthorized`.

---

## 2. Entry & Activation

1. On the flashcard list (e.g. "Đã nhớ" / "Chưa nhớ" word lists), the user opens a study-mode picker.
2. Mode descriptor:

   ```ts
   { mode: 'sentence_build', label: 'Tidians', desc: 'Đặt câu & luyện nói', Icon: Mic, color: '#7C5BA6' }
   ```

3. On click, the parent collects the selected word objects and mounts the exercise component full-screen (a portal/overlay, **not** a routed page; mode is held in local state, not the URL).
4. Component contract:

   ```ts
   interface SentenceBuildExerciseProps {
     words: VocabWord[];          // selected words
     onBack: () => void;          // return to flashcard list
     storageKeyId: string;        // e.g. `s${setId}` or `f${folderId}` — namespaces localStorage
     initialMode?: 'sentence_build' | 'speak_build'; // default 'sentence_build'
   }

   type VocabWord = {
     id?: number;
     word: string;
     meaning?: string;   // Vietnamese definition
     example?: string;   // optional example sentence (used as speak target / hint)
     pos?: string;       // part of speech
     ipa?: string;
     en?: string; vi?: string; posVi?: string; frequency?: number; category?: string;
   };
   ```

---

## 3. UI Layout

Full-screen, dark-green background (`#6A8042`) with subtle grid overlay.

- **Top bar:** back button (`ChevronLeft` → `onBack`), breadcrumb (`đặt câu` italic + brand subtext), word-progress badge `Từ X/Y`.
- **Left sidebar** (desktop only, hidden on mobile): list of all words; current word highlighted; per-word status badge (band score for write, `%` for speak; checkmark when done).
- **Main column:**
  1. **Word card** — POS badge (green), word (large `4xl font-black`), pronounce button (TTS), IPA, Vietnamese definition, and a `Lightbulb` toggle to reveal the example sentence as a hint.
  2. **Tab toggle** — `Viết` / `Nói`.
  3. **Content area** — textarea (Write) or target-sentence + speaker/mic buttons (Speak).
  4. **Actions** — submit / re-do / next / complete buttons.
- **Completion modal** — `Flame` icon, "Làm tốt lắm!", stats grid (# sentences, avg band), "Quay lại màn hình chính".

### Keyboard shortcuts

- **Write:** `Enter` submits the sentence (when textarea focused) or advances to next word (when feedback is showing).
- **Speak:** `Enter` starts/stops recording.

---

## 4. Write Tab (`sentence_build`) — Flow

```
1. Show word card.
2. User types a sentence in the textarea.
   Placeholder: 'Hãy viết một câu hoàn chỉnh có chứa từ "<WORD>"...'
3. Client validation: the target word (or a simple stemmed/inflected form) must appear.
   If missing → error: 'Vui lòng sử dụng từ "<WORD>" trong câu của bạn.' (do not call API)
4. Submit → POST /api/evaluate { category: 'vocab_sentence', payload }.
5. Render feedback (band, feedback_vi as markdown, correction, errors list).
   If is_correct → confetti + success sound.
6. Buttons: "Viết lại câu khác" (clear & retry) | "Từ tiếp theo (Enter) →" / "Hoàn thành bài tập (Enter) ✓".
```

The textarea becomes read-only once an evaluation exists for that word (until the user clicks "write another").

---

## 5. Speak Tab (`speak_build`) — Flow

```
1. When the speak tab is opened for a word, resolve the TARGET SENTENCE in priority order:
   a. word.exampleEn (if present)
   b. POST /api/evaluate { category: 'vocab_generate_sentence', payload } (LLM fallback)
   Cache it in speakSentences[wordIndex].
2. Show target sentence + speaker button (TTS) + mic button.
3. Record:
   a. getUserMedia({ audio: true }) → MediaRecorder collects chunks.
   b. Start Web Speech Recognition (continuous, lang en-US) → interim transcript into a ref.
   c. Stop → assemble audio Blob, create object URL for playback.
4. Transcribe & score:
   a. Score Web Speech transcript with evaluatePronunciation(transcript, target).
   b. If score < 80 OR transcript empty → fallback POST /api/speech-to-text (audio + hint), re-score.
   c. Commit the better result.
5. Render % score + word-by-word chips (green correct / red wrong). score >= 80 → confetti.
6. Buttons: "Thu âm lại" (re-record) | "Từ tiếp theo (Enter) →".
```

---

## 6. Pronunciation Scoring (client-side, no AI)

`evaluatePronunciation(spoken: string, target: string) → { score, wordResults, spokenText }`

Algorithm:

1. Normalize both strings: lowercase; unify apostrophe variants → `'`; strip non-word chars except spaces/apostrophes; remove apostrophes (`he's` → `hes`).
2. Tokenize into words; drop empties.
3. Compute **Longest Common Subsequence** (LCS) of the two word arrays (O(m·n) DP) — order-sensitive, so shuffled words don't inflate the score.
4. `score = round(matchedCount / targetWordCount * 100)` (0–100).
5. `wordResults`: each **target** word flagged `{ word, correct }` by whether it participated in the LCS match.

- **Success threshold: `score >= 80`.**

---

## 7. API Contracts

### 7.1 `POST /api/evaluate` — `category: "vocab_sentence"` (grade a written sentence)

Auth: logged-in user required (`401 { error: "Unauthorized" }` otherwise).
Model: `google/gemini-2.5-flash` (OpenRouter), using `response_format: { type: "json_object" }`.

**Request**

```json
{ "category": "vocab_sentence",
  "payload": { "word": "illustrate", "definition": "giải thích bằng ví dụ", "pos": "v",
               "sentence": "The author illustrates the concept with a diagram." } }
```

**Response**

```json
{ "evaluation": {
    "is_correct": true,
    "uses_word": true,
    "band": 7.0,
    "feedback_vi": "Nhận xét chi tiết bằng tiếng Việt...",
    "correction": "An improved, higher-band rewrite",
    "errors": [{ "type": "grammar|collocation|word_form|register", "issue": "...", "fix": "..." }]
} }
```

**Grading prompt (verbatim, this is what enforces calibration):**

```
You are a STRICT IELTS examiner grading a single student sentence for vocabulary practice. Be rigorous and honest — do NOT inflate scores. Most learner sentences are band 5–6; band 7+ must be earned.

Target word: "<WORD>" (<POS>)
Word definition: <DEFINITION>
Student's sentence: "<SENTENCE>"

Grade the sentence on a 0–9 IELTS band scale using these calibrated descriptors:
- Band 9: Flawless, fully natural, sophisticated. Precise word choice with strong collocations and complex, well-controlled structure.
- Band 7–8: Grammatically correct AND shows range — a complex/compound structure, a less common but accurate collocation, or precise nuance. Natural and idiomatic.
- Band 6: Correct and clear but SIMPLE — basic structure (e.g. "X is so beautiful"), common/generic vocabulary, no complexity or notable range.
- Band 5: Communicates meaning but with a noticeable error, awkward phrasing, or very basic/childish construction.
- Band 4 or below: Frequent errors, the word is misused, or meaning is unclear.

STRICT RULES:
- A short, simple, grammatically-correct sentence (e.g. "The jungle is so beautiful") is BAND 5–6, NOT 7. Reserve 7+ for genuine grammatical range or natural collocation.
- Set "is_correct": true ONLY if the sentence is grammatically correct AND uses the target word with its given meaning. Otherwise false.
- Set "uses_word": false if the target word (or a valid inflection) is missing or used with a wrong meaning — then band must be ≤ 4.
- "correction" must be a genuinely IMPROVED, higher-band rewrite (richer structure/collocation), NOT a copy of the student's sentence.
- List concrete issues in "errors" (grammar, collocation, word_form, register). Empty array only if the sentence is truly band 8+.
- "feedback_vi" in Vietnamese: state the band, WHY (cite the actual structure/word choice), and one specific tip to reach a higher band.

Return ONLY valid JSON: { "is_correct": true, "uses_word": true, "band": 6.0, "feedback_vi": "...", "correction": "...", "errors": [{ "type": "...", "issue": "...", "fix": "..." }] }
```

### 7.2 `POST /api/evaluate` — `category: "vocab_generate_sentence"` (make a target sentence to read)

Model: `google/gemini-2.5-flash` (OpenRouter), using `response_format: { type: "json_object" }`.

**Request**

```json
{ "category": "vocab_generate_sentence",
  "payload": { "word": "illustrate", "definition": "giải thích bằng ví dụ", "pos": "v" } }
```

**Response**

```json
{ "evaluation": { "sentence": "The diagram illustrates the water cycle process." } }
```

**Prompt (verbatim):**

```
You are an expert English teacher creating an IELTS-appropriate example sentence for a student.
Target word: "<WORD>" (<POS>)
Meaning: <DEFINITION>

Create exactly ONE short, natural, and idiomatic sentence that clearly demonstrates the meaning of the target word.
The sentence should be band 6.0-7.0 level—natural but not overly complex. Keep it under 15 words if possible.

Return ONLY valid JSON: { "sentence": "The example sentence containing the target word." }
```

### 7.3 `POST /api/speech-to-text` — speech-to-text fallback

`multipart/form-data`: `audio` (Blob, webm), `hint` (target sentence string).
Backed by Groq Whisper (`whisper-large-v3-turbo`) or OpenAI Whisper (`whisper-1`) depending on the configured `.env` keys.
**Response:** `{ "transcript": "..." }`.

### 7.4 `POST /api/student/history` — session record (on completion)

Two calls if both tabs were used.

```json
// Write session
{ "exam_id": "s0", "score": 65, "total": 10, "category": "sentence_build",
  "testName": "Luyện Đặt Câu", "avgBand": "6.5" }
// Speak session
{ "exam_id": "s0", "score": 82, "total": 10, "category": "speak_build",
  "testName": "Luyện Nói", "avgScore": 82 }
```

- `score` for write = `round(avgBand * 10)`; for speak = `round(avgScore)`.
- `exam_id` derived from the set/folder (`s<setId>` or `f<folderId>`).

---

## 8. State & Persistence

Key local state in the exercise component:

```ts
activeMode: 'sentence_build' | 'speak_build'
currentIdx: number
userInput: string
evaluationsWrite: Record<wordIndex, WriteEval>   // { is_correct, uses_word, band, feedback_vi, correction, errors }
evaluationsSpeak: Record<wordIndex, SpeakEval>   // { score, wordResults, spokenText }
speakSentences: Record<wordIndex, string>        // resolved target sentences
speakTrialData: { used, isTidian } | null
isRecording, isProcessing, isEvaluating, showHint, alreadyCompleted, isCompleted: boolean
recordedAudioUrl: string | null
errorMsg, errorHint: string
// refs: savedHistoryRef, trialPostedRef (fire-once guards), media refs, latestTranscriptRef
```

**localStorage key:** `tid_sentence_prog_${storageKeyId}`

```json
{ "currentIdx": 0, "userInput": "",
  "evaluationsWrite": { "0": { ... } },
  "evaluationsSpeak": { "1": { ... } },
  "completed": true }
```

- Saved on every meaningful state change (skipped on the pristine initial state).
- `completed: true` marks a finished session → reopening shows results in read-only (`alreadyCompleted`), with a "Làm lại" reset that clears the key.
- Backward-compat: old `evaluations` field is read into `evaluationsWrite`.

---

## 9. Completion

1. On finishing the last word, `handleComplete()` writes the `completed` snapshot to localStorage.
2. Show summary modal: total sentences written + average band (and/or avg speak score).
3. POST history (guarded by `savedHistoryRef` to avoid duplicates) — one call per tab used.
4. "Quay lại màn hình chính" → `onBack()`.

---

## 10. Browser APIs & Dependencies

- `navigator.mediaDevices.getUserMedia` (mic), `MediaRecorder` (capture).
- Web Speech Recognition (`SpeechRecognition` / `webkitSpeechRecognition`) — real-time transcript; Chrome/Edge solid, Firefox/Safari partial → Groq Whisper fallback covers gaps.
- `SpeechSynthesisUtterance` (TTS pronounce), `AudioContext` (success chime).
- Libraries used: `framer-motion`, `react-markdown` (render `feedback_vi`), `canvas-confetti`, `lucide-react` icons.

---

## 11. Backend Requirements (to port)

- **Auth/session** provider for logged-in user checks.
- **LLM access**: `google/gemini-2.5-flash` via OpenRouter for grading & sentence generation; Groq `whisper-large-v3-turbo` or OpenAI `whisper-1` for transcription.
- A practice-history store for session records.

---

## 12. Edge Cases & Rules

- Word-usage check is client-side and lenient (stem match) — do **not** block on it server-side; the LLM also enforces `uses_word`/band ≤ 4 when the word is absent.
- Speak fallback transcription triggers on low Web-Speech confidence **or** an empty transcript.
- History POST is guarded to fire exactly once per session.
- Tidians mode never changes a word's "remembered/forgotten" state — disclaimer shown on the flashcard page:
  `*Riêng Tidians chỉ để luyện đặt câu & nói, không làm thay đổi trạng thái nhớ/chưa nhớ của từ.`
- Mic permission denial / transcription timeout → graceful fallback (disable recording / "type your answer").

```
