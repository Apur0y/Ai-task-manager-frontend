export type TaskStatus = "pending" | "in-progress" | "done" | "skipped";
export type TaskType = "dsa" | "tech" | "concept" | "revision" | "profile";
export type Priority = "high" | "medium" | "low";
export type TaskCategory = "work" | "personal" | "learning" | "health" | "other";

export interface Resource {
  label: string;
  url: string;
}

export interface Task {
  id: string;
  type?: TaskType;
  title: string;
  ref?: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  estimatedMin?: number;
  actualMin?: number;
  category?: TaskCategory;
  resources?: Resource[];
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Day {
  id: string;
  weekId: string;
  date: string;
  dayLabel: string;
  tasks: Task[];
}

export interface Week {
  id: string;
  week: number;
  month: number;
  theme: string;
  days: Day[];
}

export interface RoadmapMeta {
  title: string;
  startDate: string;
  totalWeeks: number;
}

export interface Roadmap {
  meta: RoadmapMeta;
  weeks: Week[];
  taskTypes: Record<string, { label: string; color: string }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  skipped: number;
  completionRate: number;
}

export interface CategoryStats {
  category: TaskCategory;
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export interface CategoryStatsResponse {
  stats: CategoryStats[];
  summary: TaskStats;
}

export interface ProgressByCategory {
  [key: string]: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export interface AiSuggestion {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category?: TaskCategory;
  estimatedMin: number;
  reasoning: string;
}

export interface ProductivityAnalysis {
  period: string;
  averageTasksPerDay: number;
  mostProductiveDay: string;
  leastProductiveDay: string;
  averageCompletionRate: number;
  topCategories: { category: TaskCategory; count: number }[];
  trends: { date: string; completed: number }[];
  recommendations: string[];
}

export interface ScheduleOptimization {
  recommendations: Array<{
    task: string;
    suggestedTime: string;
    reasoning: string;
    priority: Priority;
  }>;
  schedule: Array<{
    time: string;
    task: string;
    duration: number;
  }>;
}

export interface AiInsights {
  insights: string[];
  suggestions: AiSuggestion[];
  alerts: Array<{
    type: "warning" | "info" | "success";
    message: string;
  }>;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface Stats {
  total: number;
  done: number;
  inProgress: number;
  pending: number;
  skipped: number;
  byType: Record<TaskType, { total: number; done: number }>;
}
