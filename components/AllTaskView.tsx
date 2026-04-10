"use client";

import { useEffect, useState } from "react";
import { Task, taskService } from "@/lib/taskService";
import { Activity, CheckCircle2, Clock, AlertCircle, Zap, Calendar, ChevronDown } from "lucide-react";
import TaskList from "./TaskList";

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  incomplete: number;
  completionRate: number;
}

// ── NEW: week grouping helpers (no changes to existing logic) ─────────────────

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d);
  mon.setDate(diff);
  mon.setHours(0, 0, 0, 0);
  return mon.toISOString().split("T")[0];
}

function formatWeekRange(weekKey: string): string {
  const mon = new Date(weekKey);
  const sun = new Date(weekKey);
  sun.setDate(sun.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(mon)} — ${fmt(sun)}, ${sun.getFullYear()}`;
}

function getWeekLabel(weekKey: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mon = new Date(weekKey);
  const sun = new Date(weekKey);
  sun.setDate(sun.getDate() + 6);
  if (today >= mon && today <= sun) return "This week";
  const lastMon = new Date(today);
  lastMon.setDate(lastMon.getDate() - ((today.getDay() || 7) - 1) - 7);
  lastMon.setHours(0, 0, 0, 0);
  if (mon.getTime() === lastMon.getTime()) return "Last week";
  const nextMon = new Date(today);
  nextMon.setDate(nextMon.getDate() - ((today.getDay() || 7) - 1) + 7);
  nextMon.setHours(0, 0, 0, 0);
  if (mon.getTime() === nextMon.getTime()) return "Next week";
  return "";
}

function groupTasksByWeek(tasks: Task[]): { key: string; label: string; range: string; tasks: Task[] }[] {
  const map: Record<string, Task[]> = {};
  tasks.forEach((task) => {
    if (!task.date) return;
    const key = getWeekKey(task.date);
    if (!map[key]) map[key] = [];
    map[key].push(task);
  });
  const currentKey = getWeekKey(new Date().toISOString());
  return Object.keys(map)
    .sort((a, b) => {
      if (a === currentKey) return -1;
      if (b === currentKey) return 1;
      return b.localeCompare(a); // past weeks descending
    })
    .map((key) => ({
      key,
      label: getWeekLabel(key),
      range: formatWeekRange(key),
      tasks: map[key],
    }));
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AllTasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); // ✅ filter state

  // NEW: track which weeks are open; default open = current week
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(() => {
    const todayKey = getWeekKey(new Date().toISOString());
    return new Set([todayKey]);
  });

  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    incomplete: 0,
    completionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await taskService.getAllTasks();
      const taskList = Array.isArray(data.tasks) ? data.tasks : [];

      setTasks(taskList);

      // Stats calculation
      const completed = taskList.filter(
        (t: Task) => t.status === "completed"
      ).length;
      const pending = taskList.filter(
        (t: Task) => t.status === "pending"
      ).length;
      const incomplete = taskList.filter(
        (t: Task) => t.status === "incomplete"
      ).length;

      setStats({
        total: taskList.length,
        completed,
        pending,
        incomplete,
        completionRate:
          taskList.length > 0
            ? Math.round((completed / taskList.length) * 100)
            : 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter Logic — UNCHANGED
  const filteredTasks = selectedDate
    ? tasks.filter((task) => {
        if (!task.date) return false;
        const taskDate = new Date(task.date)
          .toISOString()
          .split("T")[0];
        return taskDate === selectedDate;
      })
    : tasks;

  const handleCompleteTask = async (taskId: string) => {
    try {
      await taskService.markTaskComplete(taskId);
      await loadTodayTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete task"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?"))
      return;

    try {
      await taskService.deleteTask(taskId);
      await loadTodayTasks();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete task"
      );
    }
  };

  // NEW: toggle a week open/closed
  const toggleWeek = (key: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // NEW: group the already-filtered tasks by week for display
  const weekGroups = groupTasksByWeek(filteredTasks);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats — UNCHANGED */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-green-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">Completed</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-400">
            {stats.completed}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">Pending</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-yellow-400">
            {stats.pending}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 text-orange-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">Incomplete</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-400">
            {stats.incomplete}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">Progress</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-400">
            {stats.completionRate}%
          </p>
        </div>
      </div>

      {/* Filter UI — UNCHANGED */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-white">Tasks</h2>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-xs px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error — UNCHANGED */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* NEW: Weekly accordion — wraps your existing TaskList unchanged */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-slate-400">Loading tasks...</p>
            </div>
          </div>
        ) : weekGroups.length === 0 ? (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 text-center py-8 text-slate-400">
            {selectedDate ? "No tasks for selected date 📅" : "No tasks found 🎉"}
          </div>
        ) : (
          weekGroups.map((group) => {
            const isOpen = openWeeks.has(group.key);
            const completedCount = group.tasks.filter(
              (t) => t.status === "completed"
            ).length;
            const pct =
              group.tasks.length > 0
                ? Math.round((completedCount / group.tasks.length) * 100)
                : 0;
            const isCurrentWeek = group.label === "This week";

            return (
              <div
                key={group.key}
                className={`rounded-lg border transition-colors ${
                  isOpen
                    ? "border-slate-600 bg-slate-800/80"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                {/* Week header */}
                <button
                  onClick={() => toggleWeek(group.key)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isCurrentWeek
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-slate-700/60 text-slate-400"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-100">
                          {group.range}
                        </span>
                        {group.label && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                              isCurrentWeek
                                ? "bg-blue-400/15 text-blue-400"
                                : "bg-slate-700 text-slate-400"
                            }`}
                          >
                            {group.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""} · {completedCount} completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{pct}%</span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded — your existing TaskList, completely unchanged */}
                {isOpen && (
                  <div className="border-t border-slate-700 px-4 py-4">
                    <TaskList
                      tasks={group.tasks}
                      onTaskComplete={handleCompleteTask}
                      onTaskDelete={handleDeleteTask}
                      isLoading={loading}
                      emptyMessage="No tasks this week"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}