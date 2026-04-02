"use client";
import { useRoadmap } from "@/lib/useRoadmap";
import { getTodaysTasks, computeStats, STATUS_META, TYPE_META } from "@/lib/utils";
import TaskCard from "@/components/TaskCard";
import ProgressBar from "@/components/ProgressBar";
import AIChat from "@/components/AiChatManager";

export default function TodayPage() {
  const { roadmap, updateStatus, hydrated } = useRoadmap();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="font-mono text-ink-500 text-sm">loading...</div>
      </div>
    );
  }

  const today = getTodaysTasks(roadmap);
  const stats = computeStats(roadmap);
  const overallPct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
       <AIChat />
      {/* Header */}
      <div className="mb-10">
        <div className="text-[11px] font-mono text-ink-500 tracking-widest uppercase mb-2">{dateStr}</div>
        <h1 className="font-display text-3xl font-semibold text-ink-50 mb-1">Today's focus</h1>
        {today && (
          <p className="text-sm text-ink-400">
            Week {today.week.week} · {today.week.theme}
          </p>
        )}
      </div>

      {/* Overall progress bar */}
      <div className="bg-ink-800/60 border border-ink-700/50 rounded-xl p-4 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-ink-400 font-mono">Overall progress</span>
          <span className="text-xs font-mono text-emerald-400">{stats.done}/{stats.total} tasks</span>
        </div>
        <ProgressBar value={stats.done} max={stats.total} showLabel />
        <div className="flex gap-4 mt-3">
          {Object.entries(STATUS_META).map(([key, meta]) => {
            const count = key === "pending" ? stats.pending : key === "in-progress" ? stats.inProgress : key === "done" ? stats.done : stats.skipped;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`text-xs ${meta.color}`}>{meta.icon}</span>
                <span className="text-[11px] text-ink-400 font-mono">{count} {meta.label.toLowerCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Morning anchor */}
      <div className="border border-amber-400/20 bg-amber-400/5 rounded-xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 pulse-dot" />
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">Morning anchor — do this first</span>
        </div>
        {today ? (
          (() => {
            const dsaTask = today.day.tasks.find((t) => t.type === "dsa");
            if (!dsaTask) return <p className="text-sm text-ink-400">No DSA task today. Review yesterday's problems.</p>;
            return (
              <div>
                <p className="text-sm font-medium text-ink-100">{dsaTask.title}</p>
                <p className="text-[11px] text-ink-400 font-mono mt-0.5">{dsaTask.ref} · {dsaTask.estimatedMin} min · solve before opening anything else</p>
              </div>
            );
          })()
        ) : (
          <p className="text-sm text-ink-400">No tasks found for today.</p>
        )}
      </div>

      {/* Today's tasks */}
      {today ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-ink-200">
              {today.day.dayLabel}'s tasks
            </h2>
            <span className="text-[11px] text-ink-500 font-mono">{today.day.tasks.length} tasks</span>
          </div>
          <div className="space-y-3">
            {today.day.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={updateStatus} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-ink-500">
          <div className="text-4xl mb-4">✓</div>
          <p className="font-display text-lg">No pending tasks found</p>
          <p className="text-sm mt-1">Check the Plan page to see all weeks.</p>
        </div>
      )}

      {/* Type legend */}
      <div className="mt-10 pt-6 border-t border-ink-700/40">
        <div className="text-[10px] font-mono text-ink-600 uppercase tracking-widest mb-3">Task types</div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              <span className="text-[11px] text-ink-400 font-mono">{meta.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
