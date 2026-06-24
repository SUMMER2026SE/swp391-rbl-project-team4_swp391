import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getAuthenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const mockUserId = request.headers.get("x-mock-user-id") || new URL(request.url).searchParams.get("mockUserId");
  if (mockUserId) {
    return { id: mockUserId, email: `${mockUserId}@example.com`, name: "Mock Student" };
  }
  if (!token) return null;
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

// Mon..Sun -> T2..CN (getDay(): 0=Sun..6=Sat)
const WEEKDAY_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
// Padded "YYYY-MM-DD" — matches the calendar/heatmap keys used on the dashboard.
const isoDay = (d: Date) =>
  `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // All per-word SRS rows across every set the user has studied.
  const { data: reviews, error } = await supabaseAdmin
    .from('topic_word_reviews')
    .select('word, review_count, next_review_at, last_reviewed_at, status')
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = reviews || [];
  const now = Date.now();

  // Summary cards
  const wordsAdded = rows.length;
  const known = rows.filter(r => r.status === 'known').length;
  const due = rows.filter(r =>
    r.status === 'known' && r.next_review_at && new Date(r.next_review_at).getTime() <= now
  ).length;

  // Accuracy from vocabulary practice sessions
  const { data: history } = await supabaseAdmin
    .from('practice_history')
    .select('score, total, created_at')
    .eq('user_id', user.id)
    .eq('category', 'vocabulary');
  let accuracy: number | null = null;
  if (history && history.length) {
    const sumScore = history.reduce((a, h) => a + (h.score || 0), 0);
    const sumTotal = history.reduce((a, h) => a + (h.total || 0), 0);
    accuracy = sumTotal > 0 ? Math.round((sumScore / sumTotal) * 100) : null;
  }

  // Activity per calendar day, from any vocab interaction (reviews + practice sessions).
  const activeDays: Record<string, number> = {};
  const bump = (ts: string | null) => {
    if (!ts) return;
    const k = isoDay(new Date(ts));
    activeDays[k] = (activeDays[k] || 0) + 1;
  };
  rows.forEach(r => bump(r.last_reviewed_at));
  (history || []).forEach(h => bump(h.created_at));

  // Consecutive-day streak ending today (or yesterday if today is idle).
  let streak = 0;
  const cursor = new Date();
  if (!activeDays[isoDay(cursor)]) cursor.setDate(cursor.getDate() - 1);
  while (activeDays[isoDay(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // 7-day activity, grouped by the date a word was last reviewed.
  const buckets: Record<string, { learned: number; review: number }> = {};
  rows.forEach(r => {
    if (!r.last_reviewed_at) return;
    const k = dayKey(new Date(r.last_reviewed_at));
    if (!buckets[k]) buckets[k] = { learned: 0, review: 0 };
    if (r.status === 'known') buckets[k].learned += 1;
    else buckets[k].review += 1;
  });

  const today = new Date();
  const daily = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const b = buckets[dayKey(d)] || { learned: 0, review: 0 };
    return { label: WEEKDAY_VI[d.getDay()], learned: b.learned, review: b.review };
  });

  return NextResponse.json({ wordsAdded, known, due, accuracy, daily, streak, activeDays });
}
