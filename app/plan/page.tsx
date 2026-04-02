"use client";
import { useState } from "react";
import { useRoadmap } from "@/lib/useRoadmap";
import { getWeekStats, TYPE_META } from "@/lib/utils";
import TaskCard from "@/components/TaskCard";
import ProgressBar from "@/components/ProgressBar";
import type { TaskType, TaskStatus } from "@/lib/types";

const MONTH_COLORS = ["text-sky-400", "text-violet-400", "text-emerald-400"];
const MONTH_LABELS = ["Month 1 — Foundation", "Month 2 — AI Engineering", "Month 3 — Polish & Interview"];

export default function PlanPage() {
  const { roadmap, updateStatus, hydrated } = useRoadmap();
  const [filterType, setFilterType] = useState<TaskType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ w1: true });

  if (!hydrated) return <div className="flex items-center justify-center h-screen"><div className="font-mono text-ink-500 text-sm">loading...</div></div>;

  const toggleWeek = (id: string) => setExpandedWeeks((p) => ({ ...p, [id]: !p[id] }));

  const months = [1, 2, 3];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-mono text-ink-500 tracking-widest uppercase mb-2">12 weeks</div>
        <h1 className="font-display text-3xl font-semibold text-ink-50">Full plan</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterType("all")}
          className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
            ${filterType === "all" ? "bg-ink-100 text-ink-900 border-ink-100" : "text-ink-400 border-ink-700 hover:border-ink-500"}`}
        >
          All types
        </button>
        {Object.entries(TYPE_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setFilterType(key as TaskType)}
            className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
              ${filterType === key ? `${meta.text} border-current bg-current/10` : "text-ink-400 border-ink-700 hover:border-ink-500"}`}
          >
            {meta.label}
          </button>
        ))}
        <div className="w-px bg-ink-700 mx-1" />
        {(["all", "pending", "in-progress", "done"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
              ${filterStatus === s ? "bg-ink-100 text-ink-900 border-ink-100" : "text-ink-400 border-ink-700 hover:border-ink-500"}`}
          >
            {s === "all" ? "All status" : s}
          </button>
        ))}
      </div>

      {/* Months */}
      {months.map((month, mi) => {
        const weeks = roadmap.weeks.filter((w) => w.month === month);
        if (!weeks.length) return null;

        return (
          <div key={month} className="mb-10">
            <div className={`font-display text-sm font-semibold ${MONTH_COLORS[mi]} uppercase tracking-widest mb-4`}>
              {MONTH_LABELS[mi]}
            </div>

            <div className="space-y-3">
              {weeks.map((week) => {
                const ws = getWeekStats(week);
                const isOpen = expandedWeeks[week.id];
                const allFilteredTasks = week.days.flatMap((d) =>
                  d.tasks.filter(
                    (t) =>
                      (filterType === "all" || t.type === filterType) &&
                      (filterStatus === "all" || t.status === filterStatus)
                  )
                );

                return (
                  <div key={week.id} className="border border-ink-700/50 rounded-xl overflow-hidden">
                    {/* Week header */}
                    <button
                      onClick={() => toggleWeek(week.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 bg-ink-800/60 hover:bg-ink-800/80 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-display text-sm font-semibold text-ink-100">
                            Week {week.week}
                          </span>
                          <span className="text-xs text-ink-400">·</span>
                          <span className="text-xs text-ink-300">{week.theme}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <ProgressBar value={ws.done} max={ws.total} className="w-32" />
                          <span className="text-[11px] font-mono text-ink-500">{ws.done}/{ws.total} done</span>
                        </div>
                      </div>
                      <span className={`text-ink-500 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>

                    {/* Week content */}
                    {isOpen && (
                      <div className="divide-y divide-ink-700/30">
                        {week.days.map((day) => {
                          const dayTasks = day.tasks.filter(
                            (t) =>
                              (filterType === "all" || t.type === filterType) &&
                              (filterStatus === "all" || t.status === filterStatus)
                          );
                          if (!dayTasks.length) return null;

                          return (
                            <div key={day.id} className="px-5 py-4">
                              <div className="text-[11px] font-mono text-ink-500 uppercase tracking-widest mb-3">
                                {day.dayLabel} · {new Date(day.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                              </div>
                              <div className="space-y-2">
                                {dayTasks.map((task) => (
                                  <TaskCard key={task.id} task={task} onStatusChange={updateStatus} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        {allFilteredTasks.length === 0 && (
                          <div className="px-5 py-6 text-sm text-ink-500 text-center">
                            No tasks match current filters.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
