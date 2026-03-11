export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Category = 'work' | 'study' | 'health' | 'personal' | 'fitness' | 'creative' | 'social' | 'other';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description: string;
  reason: string; // Deep reason WHY this task matters
  category: Category;
  priority: Priority;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  repeat: RepeatType;
  notes: string;
  createdAt: string;
}

export interface DailyCompletion {
  date: string; // YYYY-MM-DD
  taskId: string;
  completed: boolean;
  completedAt?: string;
}

export interface DayStats {
  date: string;
  total: number;
  completed: number;
  percentage: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  work: 'hsl(16, 90%, 58%)',
  study: 'hsl(260, 60%, 58%)',
  health: 'hsl(150, 60%, 45%)',
  personal: 'hsl(200, 80%, 55%)',
  fitness: 'hsl(174, 62%, 47%)',
  creative: 'hsl(340, 80%, 55%)',
  social: 'hsl(40, 95%, 55%)',
  other: 'hsl(240, 10%, 45%)',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  work: '💼 Work',
  study: '📚 Study',
  health: '🏥 Health',
  personal: '🏠 Personal',
  fitness: '💪 Fitness',
  creative: '🎨 Creative',
  social: '👥 Social',
  other: '📌 Other',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'hsl(200, 80%, 55%)',
  medium: 'hsl(40, 95%, 55%)',
  high: 'hsl(16, 90%, 58%)',
  critical: 'hsl(0, 84%, 60%)',
};

export const MOTIVATIONAL_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It's not about having time, it's about making time.", author: "Unknown" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];
