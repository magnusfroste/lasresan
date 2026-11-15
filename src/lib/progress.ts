/**
 * Framsteg sparas bara i webbläsarens localStorage – inget konto, inga kakor,
 * inga nätverksanrop. Nyckeln är lasresan-v1.
 */

import { TEXTS, TOTAL_TEXTS } from "./texts";

export const STORAGE_KEY = "lasresan-v1";

export type TextResult = {
  /** Antal rätta svar, 0–3. */
  correct: number;
  /** Antal frågor i texten (alltid 3 i dag). */
  total: number;
  /** ISO-tid för senaste genomläsningen. */
  at: string;
  /** Hur många gånger texten har gjorts klart. */
  attempts: number;
};

export type Progress = {
  v: 1;
  results: Record<string, TextResult>;
};

export const emptyProgress = (): Progress => ({ v: 1, results: {} });

const isResult = (value: unknown): value is TextResult => {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<TextResult>;
  return typeof r.correct === "number" && typeof r.total === "number" && typeof r.at === "string";
};

export const loadProgress = (): Progress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const results: Record<string, TextResult> = {};
    if (parsed && parsed.results && typeof parsed.results === "object") {
      for (const [id, value] of Object.entries(parsed.results)) {
        // Släng poster som inte hör till en text vi har, eller som är trasiga.
        if (!TEXTS.some((t) => t.id === id) || !isResult(value)) continue;
        results[id] = {
          correct: Math.max(0, Math.min(3, Math.round(value.correct))),
          total: Math.max(1, Math.round(value.total)),
          at: value.at,
          attempts: Math.max(1, Math.round(value.attempts ?? 1)),
        };
      }
    }
    return { v: 1, results };
  } catch {
    return emptyProgress();
  }
};

export const saveProgress = (progress: Progress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Privat läge eller fullt lagringsutrymme: appen fungerar ändå, utan minne.
  }
};

export const recordResult = (progress: Progress, textId: string, correct: number, total: number): Progress => {
  const previous = progress.results[textId];
  return {
    v: 1,
    results: {
      ...progress.results,
      [textId]: {
        correct,
        total,
        at: new Date().toISOString(),
        attempts: (previous?.attempts ?? 0) + 1,
      },
    },
  };
};

export const resetProgress = (): Progress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignoreras medvetet
  }
  return emptyProgress();
};

export const isDone = (progress: Progress, textId: string): boolean => Boolean(progress.results[textId]);

export const doneCount = (progress: Progress): number =>
  TEXTS.filter((t) => progress.results[t.id]).length;

export const progressLabel = (progress: Progress): string => `${doneCount(progress)} av ${TOTAL_TEXTS} texter klara`;

export const totalCorrect = (progress: Progress): number =>
  Object.values(progress.results).reduce((sum, r) => sum + r.correct, 0);

export const totalQuestions = (progress: Progress): number =>
  Object.values(progress.results).reduce((sum, r) => sum + r.total, 0);