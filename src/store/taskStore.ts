import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, DailyCompletion, DayStats } from '@/types/task';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { DailyThought, fetchDailyThought } from '@/services/aiService';

interface TaskStore {
  tasks: Task[];
  completions: DailyCompletion[];
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  notifiedTasks: string[];
  dailyThought: DailyThought | null;
  fetchNewThought: () => Promise<void>;
  checkAndRefreshThought: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleCompletion: (taskId: string, date: string) => void;
  isCompleted: (taskId: string, date: string) => boolean;
  getDayStats: (date: string) => DayStats;
  getWeekStats: (date: string) => DayStats[];
  getMonthStats: (date: string) => DayStats[];
  getTaskCompletionHistory: (taskId: string, days?: number) => { date: string; completed: boolean }[];
  getTaskCompletionRate: (taskId: string) => number;
  getStreak: () => number;
  setNotificationsEnabled: (enabled: boolean) => void;
  setDailyReminderTime: (time: string) => void;
  addNotifiedTask: (key: string) => void;
  clearNotifiedTasks: () => void;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      completions: [],
      notificationsEnabled: false,
      dailyReminderTime: '07:00',
      notifiedTasks: [],
      dailyThought: null,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          completions: state.completions.filter((c) => c.taskId !== id),
        }));
      },

      toggleCompletion: (taskId, date) => {
        set((state) => {
          const existing = state.completions.find(
            (c) => c.taskId === taskId && c.date === date
          );
          if (existing) {
            if (existing.completed) {
              return {
                completions: state.completions.map((c) =>
                  c.taskId === taskId && c.date === date
                    ? { ...c, completed: false, completedAt: undefined }
                    : c
                ),
              };
            } else {
              return {
                completions: state.completions.map((c) =>
                  c.taskId === taskId && c.date === date
                    ? { ...c, completed: true, completedAt: new Date().toISOString() }
                    : c
                ),
              };
            }
          }
          return {
            completions: [
              ...state.completions,
              { taskId, date, completed: true, completedAt: new Date().toISOString() },
            ],
          };
        });
      },

      isCompleted: (taskId, date) => {
        return get().completions.some(
          (c) => c.taskId === taskId && c.date === date && c.completed
        );
      },

      getDayStats: (date) => {
        const { tasks, completions } = get();
        const activeTasks = tasks.filter((t) => {
          if (t.repeat === 'daily') return true;
          if (t.repeat === 'none') return format(new Date(t.createdAt), 'yyyy-MM-dd') === date;
          return true;
        });
        const completed = completions.filter(
          (c) => c.date === date && c.completed
        ).length;
        const total = activeTasks.length;
        return {
          date,
          total,
          completed: Math.min(completed, total),
          percentage: total > 0 ? Math.round((Math.min(completed, total) / total) * 100) : 0,
        };
      },

      getWeekStats: (date) => {
        const d = new Date(date);
        const start = startOfWeek(d, { weekStartsOn: 1 });
        const end = endOfWeek(d, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start, end });
        return days.map((day) => get().getDayStats(format(day, 'yyyy-MM-dd')));
      },

      getMonthStats: (date) => {
        const d = new Date(date);
        const start = startOfMonth(d);
        const end = endOfMonth(d);
        const days = eachDayOfInterval({ start, end });
        return days.map((day) => get().getDayStats(format(day, 'yyyy-MM-dd')));
      },

      getTaskCompletionHistory: (taskId, days = 30) => {
        const { completions } = get();
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          const completion = completions.find(
            (c) => c.taskId === taskId && c.date === date
          );
          result.push({ date, completed: completion?.completed ?? false });
        }
        return result;
      },

      getTaskCompletionRate: (taskId) => {
        const history = get().getTaskCompletionHistory(taskId, 30);
        const completed = history.filter((h) => h.completed).length;
        return history.length > 0 ? Math.round((completed / history.length) * 100) : 0;
      },

      getStreak: () => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = format(subDays(today, i), 'yyyy-MM-dd');
          const stats = get().getDayStats(date);
          if (stats.total === 0) continue;
          if (stats.percentage >= 80) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      },

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setDailyReminderTime: (time) => set({ dailyReminderTime: time }),
      addNotifiedTask: (key) => set((state) => ({ notifiedTasks: [...state.notifiedTasks, key] })),
      clearNotifiedTasks: () => set({ notifiedTasks: [] }),

      fetchNewThought: async () => {
        try {
          const thought = await fetchDailyThought();
          set({ dailyThought: thought });
        } catch (error) {
          console.error('Failed to fetch AI thought', error);
        }
      },

      checkAndRefreshThought: async () => {
        const { dailyThought } = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (!dailyThought || dailyThought.date !== today) {
          await get().fetchNewThought();
        }
      },
    }),
    {
      name: 'productivity-tracker-storage',
    }
  )
);
