"use client";

import { useState, useEffect } from "react";
import AddTaskForm from "@/components/AddTaskForm";
import TodayTasksView from "@/components/TodayTasksView";
import ProgressChart from "@/components/ProgressChart";
import AiSuggestionsWidget from "@/components/AiSuggestionsWidget";
import ProductivityDashboard from "@/components/ProductivityDashboard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { taskService, Task } from "@/lib/taskService";
import AllTasksView from "@/components/AllTaskView";

export default function DashboardPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Task Dashboard</h1>
            <p className="text-slate-400">Manage your tasks and track productivity</p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left column - Today's tasks (spans 2 columns on large screens) */}
            <div className="lg:col-span-2">
              <AllTasksView />
            </div>

            {/* Right column - Add task form and suggestions */}
            <div className="space-y-6">
              {showAddForm && (
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add New Task</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <AddTaskForm onTaskAdded={() => setShowAddForm(false)} />
                </div>
              )}

              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  + Add New Task
                </button>
              )}

              <AiSuggestionsWidget />
            </div>
          </div>

          {/* Bottom row - Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart />
            <ProductivityDashboard />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

        
         
//       {/* Overall bar */}
//       <div className="bg-ink-800/60 border border-ink-700/50 rounded-xl p-5 mb-8">
//         <div className="flex justify-between mb-2">
//           <span className="text-sm font-medium text-ink-200">Overall completion</span>
//           <span className="font-display text-sm font-semibold text-emerald-400">{overallPct}%</span>
//         </div>
//         <ProgressBar value={stats.done} max={stats.total} showLabel={false} />
//         <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
//           {Object.entries(stats.byType).map(([type, data]) => {
//             if (!data.total) return null;
//             const meta = TYPE_META[type];
//             const pct = Math.round((data.done / data.total) * 100);
//             return (
//               <div key={type} className="flex items-center gap-3">
//                 <div className="flex-1">
//                   <div className="flex justify-between mb-1">
//                     <span className={`text-[11px] font-mono ${meta.text}`}>{meta.label}</span>
//                     <span className="text-[11px] font-mono text-ink-500">{data.done}/{data.total}</span>
//                   </div>
//                   <ProgressBar value={data.done} max={data.total} color={TYPE_COLORS[type]} />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* View tabs */}
//       <div className="flex gap-1 bg-ink-800/60 border border-ink-700/50 rounded-xl p-1 mb-6">
//         {(["overview", "all-tasks", "by-week"] as const).map((v) => (
//           <button
//             key={v}
//             onClick={() => setActiveView(v)}
//             className={`flex-1 text-xs py-2 rounded-lg font-mono transition-all capitalize
//               ${activeView === v ? "bg-ink-100 text-ink-900 font-medium" : "text-ink-400 hover:text-ink-200"}`}
//           >
//             {v.replace("-", " ")}
//           </button>
//         ))}
//       </div>

//       {/* Overview */}
//       {activeView === "overview" && (
//         <div className="space-y-3">
//           {roadmap.weeks.map((week) => {
//             const ws = getWeekStats(week);
//             const doneTasks = week.days.flatMap((d) => d.tasks.filter((t) => t.status === "done"));
//             const pendingTasks = week.days.flatMap((d) => d.tasks.filter((t) => t.status === "pending"));
//             const inProgressTasks = week.days.flatMap((d) => d.tasks.filter((t) => t.status === "in-progress"));

//             return (
//               <div key={week.id} className="bg-ink-800/50 border border-ink-700/50 rounded-xl p-4">
//                 <div className="flex items-center gap-3 mb-3">
//                   <span className="font-display text-sm font-semibold text-ink-100">Week {week.week}</span>
//                   <span className="text-xs text-ink-400">{week.theme}</span>
//                   <span className={`ml-auto text-[11px] font-mono
//                     ${ws.pct === 100 ? "text-emerald-400" : ws.pct > 0 ? "text-amber-400" : "text-ink-500"}`}>
//                     {ws.pct}%
//                   </span>
//                 </div>
//                 <ProgressBar
//                   value={ws.done}
//                   max={ws.total}
//                   color={ws.pct === 100 ? "bg-emerald-400" : ws.pct > 0 ? "bg-amber-400" : "bg-ink-600"}
//                 />
//                 <div className="flex gap-4 mt-2">
//                   <span className="text-[11px] text-ink-500 font-mono">{doneTasks.length} done</span>
//                   {inProgressTasks.length > 0 && <span className="text-[11px] text-amber-400 font-mono">{inProgressTasks.length} in progress</span>}
//                   <span className="text-[11px] text-ink-500 font-mono">{pendingTasks.length} pending</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* All tasks */}
//       {activeView === "all-tasks" && (
//         <div>
//           {/* Search + filters */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             <input
//               type="text"
//               placeholder="Search tasks..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-ink-800 border border-ink-700 rounded-lg px-3 py-1.5 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-ink-500 font-mono w-full sm:w-64"
//             />
//           </div>
//           <div className="flex flex-wrap gap-2 mb-5">
//             <button onClick={() => setFilterType("all")} className={`text-[11px] px-3 py-1 rounded-full border font-mono ${filterType === "all" ? "bg-ink-100 text-ink-900 border-ink-100" : "text-ink-400 border-ink-700"}`}>All types</button>
//             {Object.entries(TYPE_META).map(([k, m]) => (
//               <button key={k} onClick={() => setFilterType(k as TaskType)} className={`text-[11px] px-3 py-1 rounded-full border font-mono ${filterType === k ? `${m.text} border-current bg-current/10` : "text-ink-400 border-ink-700"}`}>{m.label}</button>
//             ))}
//             <div className="w-px bg-ink-700" />
//             {(["all", "pending", "in-progress", "done", "skipped"] as const).map((s) => (
//               <button key={s} onClick={() => setFilterStatus(s)} className={`text-[11px] px-3 py-1 rounded-full border font-mono ${filterStatus === s ? "bg-ink-100 text-ink-900 border-ink-100" : "text-ink-400 border-ink-700"}`}>{s === "all" ? "All status" : s}</button>
//             ))}
//           </div>
//           <div className="text-[11px] text-ink-500 font-mono mb-3">{filteredTasks.length} tasks</div>
//           <div className="space-y-2">
//             {filteredTasks.map((task) => {
//               const week = roadmap.weeks.find((w) => w.days.some((d) => d.tasks.some((t) => t.id === task.id)));
//               return (
//                 <TaskCard
//                   key={task.id}
//                   task={task}
//                   onStatusChange={updateStatus}
//                   showWeekContext={week ? `Wk${week.week}` : undefined}
//                 />
//               );
//             })}
//             {filteredTasks.length === 0 && (
//               <div className="py-12 text-center text-ink-500 text-sm">No tasks match your filters.</div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* By week */}
//       {activeView === "by-week" && (
//         <div className="space-y-6">
//           {roadmap.weeks.map((week) => (
//             <div key={week.id}>
//               <div className="flex items-center gap-3 mb-3">
//                 <h3 className="font-display text-sm font-semibold text-ink-200">Week {week.week}</h3>
//                 <span className="text-xs text-ink-500">{week.theme}</span>
//               </div>
//               <div className="grid gap-2">
//                 {week.days.flatMap((day) =>
//                   day.tasks.map((task) => (
//                     <TaskCard key={task.id} task={task} onStatusChange={updateStatus} />
//                   ))
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
