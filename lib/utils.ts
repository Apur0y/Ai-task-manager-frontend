import type { Roadmap, Stats, Task, Week, Day, TaskType } from "./types";

export function getAllTasks(roadmap: Roadmap): Task[] {
  return roadmap.weeks.flatMap((w) => w.days.flatMap((d) => d.tasks));
}

export function computeStats(roadmap: Roadmap): Stats {
  const tasks = getAllTasks(roadmap);
  const byType = {} as Stats["byType"];

  const types: TaskType[] = ["dsa", "tech", "concept", "revision", "profile"];
  for (const t of types) {
    const subset = tasks.filter((task) => task.type === t);
    byType[t] = { total: subset.length, done: subset.filter((t) => t.status === "done").length };
  }

  return {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    skipped: tasks.filter((t) => t.status === "skipped").length,
    byType,
  };
}

export function getTodaysTasks(roadmap: Roadmap): { day: Day; week: Week } | null {
  const today = new Date().toISOString().split("T")[0];
  for (const week of roadmap.weeks) {
    for (const day of week.days) {
      if (day.date === today) return { day, week };
    }
  }
  // Return first pending day if today not found
  for (const week of roadmap.weeks) {
    for (const day of week.days) {
      const hasPending = day.tasks.some((t) => t.status === "pending" || t.status === "in-progress");
      if (hasPending) return { day, week };
    }
  }
  return null;
}

export function getWeekStats(week: Week) {
  const tasks = week.days.flatMap((d) => d.tasks);
  const done = tasks.filter((t) => t.status === "done").length;
  return { total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}

export const TYPE_META: Record<string, { label: string; dot: string; badge: string; text: string }> = {
  dsa:      { label: "DSA",         dot: "bg-emerald-400", badge: "bg-emerald-400/10 border-emerald-400/20", text: "text-emerald-400" },
  tech:     { label: "Tech / Build",dot: "bg-sky-400",     badge: "bg-sky-400/10 border-sky-400/20",         text: "text-sky-400"     },
  concept:  { label: "Concept",     dot: "bg-violet-400",  badge: "bg-violet-400/10 border-violet-400/20",   text: "text-violet-400"  },
  revision: { label: "Revision",    dot: "bg-ink-300",     badge: "bg-ink-300/10 border-ink-300/20",         text: "text-ink-300"     },
  profile:  { label: "Profile",     dot: "bg-amber-400",   badge: "bg-amber-400/10 border-amber-400/20",     text: "text-amber-400"   },
};

export const STATUS_META: Record<string, { label: string; color: string; icon: string }> = {
  pending:     { label: "Pending",     color: "text-ink-300",    icon: "○" },
  "in-progress": { label: "In progress", color: "text-amber-400",  icon: "◑" },
  done:        { label: "Done",        color: "text-emerald-400", icon: "●" },
  skipped:     { label: "Skipped",     color: "text-rose-400",    icon: "✕" },
};
