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

export default function TodayTasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
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
      const data = await taskService.getTodayTasks();
      const taskList = Array.isArray(data.tasks) ? data.tasks : [];
      const filteredTaskList = taskList.filter(
  (task: Task) => task.status !== "deleted"
);
      setTasks(filteredTaskList);

      // Use stats from response if available, otherwise calculate
      if (data.totalTasks !== undefined && data.completedTasks !== undefined) {
        setStats({
          total: data.totalTasks || 0,
          completed: data.completedTasks || 0,
          pending: data.pendingTasks || 0,
          incomplete: data.incompleteTasks || 0,
          completionRate: data.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0,
        });
      } else {
        // Fallback: calculate from tasks
        const completed = taskList.filter((t: Task) => t.status === "completed").length;
        const pending = taskList.filter((t: Task) => t.status === "pending").length;
        const incomplete = taskList.filter((t: Task) => t.status === "incomplete").length;

        setStats({
          total: taskList.length,
          completed,
          pending,
          incomplete,
          completionRate: taskList.length > 0 ? Math.round((completed / taskList.length) * 100) : 0,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks"
      );
      console.error("Error loading today's tasks:", err);
    } finally {
      setLoading(false);
    }
  };

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
    if (!confirm("Are you sure you want to delete this task?")) return;
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
  

      {/* Task List */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
            </div>
            <p className="mt-3 text-slate-400">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskComplete={handleCompleteTask}
            onTaskDelete={handleDeleteTask}
            isLoading={loading}
            emptyMessage="No tasks for today. Great job! 🎉"
          />
        )}
      </div>
          {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {stats.pending}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400">Incomplete</span>
          </div>
          <p className="text-2xl font-bold text-orange-400">{stats.incomplete}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {stats.completionRate}%
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
