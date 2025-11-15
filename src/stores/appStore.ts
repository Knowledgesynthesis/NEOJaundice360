import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress } from '@/types';

interface AppState {
  darkMode: boolean;
  userProgress: UserProgress[];
  completedAssessments: string[];
  toggleDarkMode: () => void;
  updateProgress: (moduleId: string, completed: boolean, score?: number) => void;
  completeAssessment: (assessmentId: string) => void;
  getModuleProgress: (moduleId: string) => UserProgress | undefined;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: true, // Default to dark mode as per requirements
      userProgress: [],
      completedAssessments: [],

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
        // Update document class for dark mode
        if (get().darkMode) {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      },

      updateProgress: (moduleId, completed, score) => {
        set((state) => {
          const existingProgress = state.userProgress.find(p => p.moduleId === moduleId);
          if (existingProgress) {
            return {
              userProgress: state.userProgress.map(p =>
                p.moduleId === moduleId
                  ? { ...p, completed, score, lastAccessed: new Date() }
                  : p
              ),
            };
          } else {
            return {
              userProgress: [
                ...state.userProgress,
                { moduleId, completed, score, lastAccessed: new Date() },
              ],
            };
          }
        });
      },

      completeAssessment: (assessmentId) => {
        set((state) => ({
          completedAssessments: [...state.completedAssessments, assessmentId],
        }));
      },

      getModuleProgress: (moduleId) => {
        return get().userProgress.find(p => p.moduleId === moduleId);
      },
    }),
    {
      name: 'neojaundice360-storage',
    }
  )
);
