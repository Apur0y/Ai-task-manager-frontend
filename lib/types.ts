export type TaskStatus = "pending" | "in-progress" | "done" | "skipped";
export type TaskType = "dsa" | "tech" | "concept" | "revision" | "profile";
export type Priority = "high" | "medium" | "low";

export interface Resource {
  label: string;
  url: string;
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  ref: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  estimatedMin: number;
  resources: Resource[];
  notes: string;
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

export interface Stats {
  total: number;
  done: number;
  inProgress: number;
  pending: number;
  skipped: number;
  byType: Record<TaskType, { total: number; done: number }>;
}
