"use client";

import { useEffect, useState } from "react";
import { Task, taskService } from "@/lib/taskService";
import { Activity, CheckCircle2, Clock, AlertCircle, Zap } from "lucide-react";
import TaskList from "./TaskList";

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  incomplete: number;
  completionRate: number;
}

export default function AllTasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); // ✅ filter state

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

  // ✅ Filter Logic
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-green-400 mb-2" />
          <p className="text-xs text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-green-400">
            {stats.completed}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <Clock className="w-4 h-4 text-yellow-400 mb-2" />
          <p className="text-xs text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats.pending}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <AlertCircle className="w-4 h-4 text-orange-400 mb-2" />
          <p className="text-xs text-slate-400">Incomplete</p>
          <p className="text-2xl font-bold text-orange-400">
            {stats.incomplete}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <Zap className="w-4 h-4 text-purple-400 mb-2" />
          <p className="text-xs text-slate-400">Progress</p>
          <p className="text-2xl font-bold text-purple-400">
            {stats.completionRate}%
          </p>
        </div>
      </div>

      {/* Filter UI */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Tasks</h2>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-xs px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Task List */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-slate-400">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onTaskComplete={handleCompleteTask}
            onTaskDelete={handleDeleteTask}
            isLoading={loading}
            emptyMessage={
              selectedDate
                ? "No tasks for selected date 📅"
                : "No tasks found 🎉"
            }
          />
        )}
      </div>
    </div>
  );
}