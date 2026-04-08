"use client";

import { Task } from "@/lib/taskService";
import { Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const priorityColors = {
  high: "text-red-400 bg-red-400/10 border-red-400/30",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  low: "text-green-400 bg-green-400/10 border-green-400/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="w-4 h-4 text-green-400" />,
  pending: <Clock className="w-4 h-4 text-yellow-400" />,
  incomplete: <AlertCircle className="w-4 h-4 text-orange-400" />,
};

export default function TaskList({
  tasks,
  onTaskComplete,
  onTaskDelete,
  isLoading = false,
  emptyMessage = "No tasks found",
}: TaskListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-auto">
      {tasks.map((task) => (
        <div
          key={task._id}
          onClick={() =>
            setExpandedId(expandedId === task._id ? null : task._id)
          }
          className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
        >
          {/* Top Section */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {statusIcons[task.status]}
                <h3 className="font-medium text-white truncate">
                  {task.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              {/* Short Description */}
              {task.description && (
                <p className="text-sm text-slate-400 mb-2 line-clamp-1">
                  {task.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400">
                {task.category && (
                  <span className="px-2 py-1 bg-slate-700 rounded">
                    {task.category}
                  </span>
                )}
                {task.date && (
                  <span className="px-2 py-1 bg-slate-700 rounded">
                    {new Date(task.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {task.status !== "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskComplete?.(task._id);
                  }}
                  disabled={isLoading}
                  className="p-2 hover:bg-slate-700 rounded text-green-400 hover:text-green-300 disabled:opacity-50 transition"
                  title="Mark complete"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskDelete?.(task._id);
                }}
                disabled={isLoading}
                className="p-2 hover:bg-slate-700 rounded text-red-400 hover:text-red-300 disabled:opacity-50 transition"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Section */}
          {expandedId === task._id && (
            <div className="mt-3 pt-3 border-t border-slate-700 space-y-3">
              {/* Full Description */}
              {task.description && (
                <p className="text-sm text-slate-300">
                  {task.description}
                </p>
              )}

              {/* Resources */}
              {task.resources && task.resources.length > 0 && (
                <div className="space-y-2">
                  {task.resources.map((res, index) => (
                    <div key={index} className="flex flex-col">
                      <p className="text-sm text-slate-300">
                        {res.label}
                      </p>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 text-sm hover:underline break-all"
                      >
                        {res.url}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}