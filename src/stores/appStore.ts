import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BiliUnit } from '@/lib/bili/units';

export type Theme = 'dark' | 'light' | 'system';

interface QuestionStat {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
}

interface AppState {
  theme: Theme;
  unit: BiliUnit;
  completed: Record<string, boolean>;
  questionStats: Record<string, QuestionStat>;
  casesDone: Record<string, number>; // case id → score %
  setTheme: (t: Theme) => void;
  setUnit: (u: BiliUnit) => void;
  toggleComplete: (id: string, value?: boolean) => void;
  recordAnswer: (questionId: string, correct: boolean) => void;
  recordCase: (caseId: string, scorePct: number) => void;
  resetProgress: () => void;
}

/** localStorage can throw (private mode, blocked storage) — fall back to memory. */
const safeStorage = createJSONStorage(() => {
  try {
    const k = '__nj360_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (n: string) => mem.get(n) ?? null,
      setItem: (n: string, v: string) => void mem.set(n, v),
      removeItem: (n: string) => void mem.delete(n),
    };
  }
});

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      unit: 'mgdl',
      completed: {},
      questionStats: {},
      casesDone: {},
      setTheme: (theme) => set({ theme }),
      setUnit: (unit) => set({ unit }),
      toggleComplete: (id, value) =>
        set((s) => ({ completed: { ...s.completed, [id]: value ?? !s.completed[id] } })),
      recordAnswer: (id, correct) =>
        set((s) => {
          const prev = s.questionStats[id] ?? { attempts: 0, correct: 0, lastCorrect: false };
          return {
            questionStats: {
              ...s.questionStats,
              [id]: { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0), lastCorrect: correct },
            },
          };
        }),
      recordCase: (caseId, scorePct) => set((s) => ({ casesDone: { ...s.casesDone, [caseId]: scorePct } })),
      resetProgress: () => set({ completed: {}, questionStats: {}, casesDone: {} }),
    }),
    { name: 'nj360', version: 2, storage: safeStorage },
  ),
);

export function applyTheme(theme: Theme) {
  const dark =
    theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', !!dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b0f17' : '#f6f5f1');
}
