"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  normalizeListeningTest,
  NormalizedSection,
  NormalizedListeningQuestion
} from "@/utils/questionHelpers";

export interface ListeningResult {
  totalQuestions: number;
  correctCount: number;
  score: number;               // 0–40 (raw score)
  bandScore: number;           // 0–9
  sectionResults: {
    sectionNumber: number;
    correct: number;
    total: number;
  }[];
  answers: Record<string, string>;
  correctAnswers: Record<string, string>;
}

interface ListeningTestContextValue {
  testList: any[];
  selectedTest: any | null;
  sections: NormalizedSection[];
  currentSectionIndex: number;
  currentSection: NormalizedSection | null;
  answers: Record<string, string>;
  isPlaying: boolean;
  mockProgress: number;
  mockDuration: number;
  mockCurrentTime: number;
  isLoading: boolean;
  isSubmitting: boolean;
  showResult: boolean;
  result: ListeningResult | null;
  error: string | null;

  loadTestList: () => Promise<void>;
  selectTest: (testId: string) => Promise<void>;
  goToSection: (index: number) => void;
  goToNextSection: () => void;
  goToPrevSection: () => void;
  setAnswer: (questionId: string, value: string) => void;
  togglePlay: () => void;
  seekTo: (percent: number) => number;
  submitTest: () => Promise<void>;
  resetTest: () => void;
}

const ListeningTestContext = createContext<ListeningTestContextValue | null>(null);

export const rawScoreToBand = (raw: number): number => {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 20) return 5.5;
  if (raw >= 16) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  return 3.5;
};

export const gradeListeningTest = (
  sections: NormalizedSection[],
  answers: Record<string, string>
): ListeningResult => {
  let correctCount = 0;
  const correctAnswers: Record<string, string> = {};
  const sectionResults: { sectionNumber: number; correct: number; total: number }[] = [];

  sections.forEach((section) => {
    let sectionCorrect = 0;
    section.questions.forEach((q) => {
      const userAnswer = (answers[q.id] ?? "").toLowerCase().trim();
      let isCorrect = false;

      if (q.type === "mcq") {
        isCorrect = userAnswer === q.correctAnswer.toLowerCase();
        correctAnswers[q.id] = q.correctAnswer;
      } else {
        isCorrect = q.acceptedAnswers.some((a) => userAnswer === a);
        correctAnswers[q.id] = q.acceptedAnswers[0] || "";
      }

      if (isCorrect) {
        correctCount++;
        sectionCorrect++;
      }
    });
    
    sectionResults.push({
      sectionNumber: section.sectionNumber,
      correct: sectionCorrect,
      total: section.questions.length,
    });
  });

  const bandScore = rawScoreToBand(correctCount);

  return {
    totalQuestions: sections.reduce((sum, s) => sum + s.questions.length, 0),
    correctCount,
    score: correctCount,
    bandScore,
    sectionResults,
    answers,
    correctAnswers,
  };
};

export function ListeningTestProvider({ children }: { children: React.ReactNode }) {
  const [testList, setTestList] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [sections, setSections] = useState<NormalizedSection[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Mock audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mockProgress, setMockProgress] = useState<number>(0);
  const [mockDuration, setMockDuration] = useState<number>(0);
  const [mockCurrentTime, setMockCurrentTime] = useState<number>(0);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [result, setResult] = useState<ListeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startedAtRef = useRef<Date>(new Date());

  const currentSection = sections[currentSectionIndex] || null;

  // Load list of tests
  const loadTestList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from("listening_cam_tests")
        .select("id, test_id, test_name, volume, test_number, has_audio, is_visible, sections")
        .eq("is_visible", true)
        .order("volume", { ascending: true })
        .order("test_number", { ascending: true });

      if (fetchErr) throw fetchErr;

      const validTests = (data || []).filter((t: any) =>
        t.sections &&
        Array.isArray(t.sections) &&
        t.sections.length > 0 &&
        t.sections.some((s: any) => s.questions?.length > 0)
      );

      setTestList(validTests);
    } catch (err: any) {
      console.error("Error loading test list:", err);
      setError(err.message || "Failed to load test list");
    } finally {
      setIsLoading(false);
    }
  };

  // Select test
  const selectTest = async (testId: string) => {
    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setResult(null);
    setAnswers({});
    setIsPlaying(false);
    setMockProgress(0);
    setMockCurrentTime(0);
    startedAtRef.current = new Date();
    
    try {
      const { data, error: fetchErr } = await supabase
        .from("listening_cam_tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (fetchErr) throw fetchErr;

      setSelectedTest(data);
      const normalized = normalizeListeningTest(data);
      setSections(normalized);
      setCurrentSectionIndex(0);

      // Duration is 15 seconds per question
      const totalQs = normalized.reduce((sum, s) => sum + s.questions.length, 0);
      setMockDuration(totalQs * 15);
    } catch (err: any) {
      console.error("Error selecting listening test:", err);
      setError(err.message || "Failed to load test data");
    } finally {
      setIsLoading(false);
    }
  };

  // Seek
  const seekTo = (percent: number): number => {
    const time = Math.round((percent / 100) * mockDuration);
    setMockCurrentTime(time);
    setMockProgress(percent);
    return time;
  };

  // Audio Play controls
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Auto Timer Effect for Mock Audio
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setMockCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= mockDuration) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return mockDuration;
          }
          setMockProgress((next / mockDuration) * 100);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, mockDuration]);

  // Section Navigation
  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSectionIndex(index);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  // Set answers
  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit
  const submitTest = async () => {
    if (!selectedTest) return;
    setIsSubmitting(true);
    setIsPlaying(false);
    
    try {
      const graded = gradeListeningTest(sections, answers);
      setResult(graded);

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001"; // Mock default if not logged in

      // 1. Save to user_submissions
      const { data: submission, error: subErr } = await supabase
        .from("user_submissions")
        .insert({
          user_id: userId,
          exam_id: selectedTest.id,
          score: graded.bandScore,
          answers: {
            userAnswers: graded.answers,
            correctAnswers: graded.correctAnswers,
            rawScore: graded.score,
            totalQuestions: graded.totalQuestions,
            sectionResults: graded.sectionResults,
          },
          started_at: startedAtRef.current.toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (subErr) throw subErr;

      // 2. Also save to practice_history for dashboard display
      await supabase.from("practice_history").insert({
        user_id: userId,
        category: "listening",
        test_id: selectedTest.test_id,
        test_name: selectedTest.test_name,
        score: graded.bandScore,
        total: graded.totalQuestions,
        metadata: {
          raw_score: graded.score,
          section_results: graded.sectionResults,
          submission_id: submission?.id || null,
        },
      });

      setShowResult(true);
    } catch (err: any) {
      console.error("Error submitting listening test:", err);
      alert(err.message || "Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetTest = () => {
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setMockCurrentTime(0);
    setMockProgress(0);
    setIsPlaying(false);
    setCurrentSectionIndex(0);
    startedAtRef.current = new Date();
  };

  return (
    <ListeningTestContext.Provider
      value={{
        testList,
        selectedTest,
        sections,
        currentSectionIndex,
        currentSection,
        answers,
        isPlaying,
        mockProgress,
        mockDuration,
        mockCurrentTime,
        isLoading,
        isSubmitting,
        showResult,
        result,
        error,
        loadTestList,
        selectTest,
        goToSection,
        goToNextSection,
        goToPrevSection,
        setAnswer,
        togglePlay,
        seekTo,
        submitTest,
        resetTest
      }}
    >
      {children}
    </ListeningTestContext.Provider>
  );
}

export function useListeningTest() {
  const context = useContext(ListeningTestContext);
  if (!context) {
    throw new Error("useListeningTest must be used within a ListeningTestProvider");
  }
  return context;
}
