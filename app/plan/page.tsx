"use client";

import { useState } from "react";
import DatePicker from "@/components/DatePicker";
import TaskList from "@/components/TaskList";
import ErrorBoundary from "@/components/ErrorBoundary";
import { taskService, Task } from "@/lib/taskService";
import { useEffect } from "react";
import { Calendar } from "lucide-react";

export default function PlanPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasksForDate(selectedDate);
  }, [selectedDate]);

  const loadTasksForDate = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasksByDate(date);
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.markTaskComplete(taskId);
      await loadTasksForDate(selectedDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(taskId);
      await loadTasksForDate(selectedDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-slate-900 text-white p-4 sm:p-6 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Plan Your Day</h1>
            <p className="text-sm sm:text-base text-slate-400">View and manage tasks for any date</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <DatePicker onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            </div>

            {/* Tasks for selected date */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">Tasks for {formattedDate}</h2>
                      <p className="text-xs sm:text-sm text-slate-400">{tasks.length} tasks</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin mb-2">
                      <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
                    </div>
                    <p className="text-slate-400">Loading tasks...</p>
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onTaskComplete={handleCompleteTask}
                    onTaskDelete={handleDeleteTask}
                    isLoading={loading}
                    emptyMessage={`No tasks for ${formattedDate}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 mb-8">
//         <button
//           onClick={() => setFilterType("all")}
//           className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
//             ${filterType === "all" ? "bg-ink-100 text-ink-900 border-ink-100" : "text-ink-400 border-ink-700 hover:border-ink-500"}`}
//         >
//           All types
//         </button>
//         {Object.entries(TYPE_META).map(([key, meta]) => (
//           <button
//             key={key}
//             onClick={() => setFilterType(key as TaskType)}
//             className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
//               ${filterType === key ? `${meta.text} border-current bg-current/10` : "text-ink-400 border-ink-700 hover:border-ink-500"}`}
//           >
//             {meta.label}
//           </button>
//         ))}
//         <div className="w-px bg-ink-700 mx-1" />
//         {(["all", "pending", "in-progress", "done"] as const).map((s) => (
//           <button
//             key={s}
//             onClick={() => setFilterStatus(s)}
//             className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
//               ${filterStatus === s ? "bg-ink-100 text-ink-900 border-ink-100" : "text-ink-400 border-ink-700 hover:border-ink-500"}`}
//           >
//             {s === "all" ? "All status" : s}
//           </button>
//         ))}
//       </div>

//       {/* Months */}
//       {months.map((month, mi) => {
//         const weeks = roadmap.weeks.filter((w) => w.month === month);
//         if (!weeks.length) return null;

//         return (
//           <div key={month} className="mb-10">
//             <div className={`font-display text-sm font-semibold ${MONTH_COLORS[mi]} uppercase tracking-widest mb-4`}>
//               {MONTH_LABELS[mi]}
//             </div>

//             <div className="space-y-3">
//               {weeks.map((week) => {
//                 const ws = getWeekStats(week);
//                 const isOpen = expandedWeeks[week.id];
//                 const allFilteredTasks = week.days.flatMap((d) =>
//                   d.tasks.filter(
//                     (t) =>
//                       (filterType === "all" || t.type === filterType) &&
//                       (filterStatus === "all" || t.status === filterStatus)
//                   )
//                 );

//                 return (
//                   <div key={week.id} className="border border-ink-700/50 rounded-xl overflow-hidden">
//                     {/* Week header */}
//                     <button
//                       onClick={() => toggleWeek(week.id)}
//                       className="w-full flex items-center gap-4 px-5 py-4 bg-ink-800/60 hover:bg-ink-800/80 transition-colors text-left"
//                     >
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3">
//                           <span className="font-display text-sm font-semibold text-ink-100">
//                             Week {week.week}
//                           </span>
//                           <span className="text-xs text-ink-400">·</span>
//                           <span className="text-xs text-ink-300">{week.theme}</span>
//                         </div>
//                         <div className="flex items-center gap-3 mt-2">
//                           <ProgressBar value={ws.done} max={ws.total} className="w-32" />
//                           <span className="text-[11px] font-mono text-ink-500">{ws.done}/{ws.total} done</span>
//                         </div>
//                       </div>
//                       <span className={`text-ink-500 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
//                     </button>

//                     {/* Week content */}
//                     {isOpen && (
//                       <div className="divide-y divide-ink-700/30">
//                         {week.days.map((day) => {
//                           const dayTasks = day.tasks.filter(
//                             (t) =>
//                               (filterType === "all" || t.type === filterType) &&
//                               (filterStatus === "all" || t.status === filterStatus)
//                           );
//                           if (!dayTasks.length) return null;

//                           return (
//                             <div key={day.id} className="px-5 py-4">
//                               <div className="text-[11px] font-mono text-ink-500 uppercase tracking-widest mb-3">
//                                 {day.dayLabel} · {new Date(day.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
//                               </div>
//                               <div className="space-y-2">
//                                 {dayTasks.map((task) => (
//                                   <TaskCard key={task.id} task={task} onStatusChange={updateStatus} />
//                                 ))}
//                               </div>
//                             </div>
//                           );
//                         })}
//                         {allFilteredTasks.length === 0 && (
//                           <div className="px-5 py-6 text-sm text-ink-500 text-center">
//                             No tasks match current filters.
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
