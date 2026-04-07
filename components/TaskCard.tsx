"use client";
import { useState } from "react";
import type { Task } from "@/lib/taskService";
import { TYPE_META, STATUS_META } from "@/lib/utils";

interface Props {
  task: Task;
  onStatusChange?: (id: string, status: Task["status"]) => void;
  showWeekContext?: string;
}

export default function TaskCard({ task, onStatusChange, showWeekContext }: Props) {
  const [open, setOpen] = useState(false);
  const typeMeta = TYPE_META[task.category as keyof typeof TYPE_META] || TYPE_META.other;
  const statusMeta = STATUS_META[task.status];

  const statusCycle: Task["status"][] = ["pending", "incomplete", "completed"];
  const nextStatus = statusCycle[(statusCycle.indexOf(task.status) + 1) % statusCycle.length];

  return (
    <div className={`rounded-xl border transition-all duration-200 animate-fadeup
      ${task.status === "completed"
        ? "bg-ink-900/40 border-ink-700/30 opacity-70"
        : task.status === "incomplete"
        ? "bg-ink-800/80 border-amber-400/20 glow-emerald"
        : "bg-ink-800/60 border-ink-700/50 hover:border-ink-600/70"
      }`}
    >
      <div
        className="flex items-start gap-4 p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {/* Status toggle */}
        <button
          className={`mt-0.5 text-lg leading-none flex-shrink-0 transition-all hover:scale-110 ${statusMeta.color}`}
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange?.(task._id, nextStatus);
          }}
          title={`Mark as ${nextStatus}`}
        >
          {statusMeta.icon}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${typeMeta.badge} ${typeMeta.text}`}>
              {typeMeta.label}
            </span>
            {task.priority === "high" && (
              <span className="text-[10px] text-rose-400 font-mono">↑ high</span>
            )}
            {showWeekContext && (
              <span className="text-[10px] text-ink-500 font-mono">{showWeekContext}</span>
            )}
          </div>
          <div className={`font-medium text-sm ${task.status === "done" ? "line-through text-ink-400" : "text-ink-100"}`}>
            {task.title}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-ink-500 font-mono">{task.estimatedMin} min</span>
            <span className={`text-[11px] font-mono ${statusMeta.color}`}>{statusMeta.label}</span>
          </div>
        </div>

        <span className={`text-ink-500 text-xs mt-1 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="border-t border-ink-700/40 px-4 py-3 space-y-3">
          <p className="text-sm text-ink-300 leading-relaxed">{task.description}</p>

          {task.resources.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-ink-500 uppercase tracking-widest mb-2">Resources</div>
              <div className="flex flex-col gap-1.5">
                {task.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 transition-colors group"
                  >
                    <span className="text-ink-600 group-hover:text-sky-400">→</span>
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {task.notes && (
            <div className="bg-ink-900/60 rounded-lg p-3 text-xs text-ink-400 font-mono">
              {task.notes}
            </div>
          )}

          <div className="flex gap-2 flex-wrap pt-1">
            {(["pending", "in-progress", "done", "skipped"] as Task["status"][]).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange?.(task.id, s)}
                className={`text-[11px] px-3 py-1 rounded-full border font-mono transition-all
                  ${task.status === s
                    ? `${STATUS_META[s].color} border-current bg-current/10`
                    : "text-ink-500 border-ink-700 hover:border-ink-500 hover:text-ink-300"
                  }`}
              >
                {STATUS_META[s].icon} {STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
