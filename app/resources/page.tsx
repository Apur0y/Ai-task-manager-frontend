"use client";

import { useState, useEffect } from "react";
import { Task, taskService } from "@/lib/taskService";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ResourcesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadAllTasks();
  }, []);

  const loadAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getLast90DaysTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group tasks by category
  const groupedByCategory = tasks.reduce(
    (acc, task) => {
      const category = task.category || "uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  const categories = Object.keys(groupedByCategory).sort();

  const categoryColors = {
    work: "bg-blue-500/20 border-blue-500",
    personal: "bg-purple-500/20 border-purple-500",
    learning: "bg-green-500/20 border-green-500",
    health: "bg-red-500/20 border-red-500",
    other: "bg-slate-500/20 border-slate-500",
  };

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Resources & Tasks</h1>
            <p className="text-slate-400">Organize your learning materials and resources</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin mb-3">
                <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
              </div>
              <p className="text-slate-400">Loading resources...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Category sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 sticky top-6">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === null
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      All Tasks ({tasks.length})
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded transition ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        {category === "uncategorized"
                          ? "Uncategorized"
                          : category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                        ({groupedByCategory[category].length})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks list */}
              <div className="lg:col-span-3">
                {selectedCategory === null
                  ? categories.map((category) => (
                      <div key={category} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 capitalize flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              categoryColors[
                                category as keyof typeof categoryColors
                              ]?.split(" ")[0]
                            }`}
                          ></div>
                          {category === "uncategorized"
                            ? "Uncategorized"
                            : category}
                        </h2>
                        <div className="space-y-3">
                          {groupedByCategory[category].map((task) => (
                            <ResourceCard key={task._id} task={task} />
                          ))}
                        </div>
                      </div>
                    ))
                  : (
                      <div>
                        <h2 className="text-xl font-semibold mb-4 capitalize">
                          {selectedCategory === "uncategorized"
                            ? "Uncategorized"
                            : selectedCategory}
                        </h2>
                        <div className="space-y-3">
                          {groupedByCategory[selectedCategory]?.map((task) => (
                            <ResourceCard key={task._id} task={task} />
                          ))}
                        </div>
                      </div>
                    )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

function ResourceCard({ task }: { task: Task }) {
  const statusColors: Record<string, string> = {
    completed: "bg-green-500/20 border-green-500",
    pending: "bg-yellow-500/20 border-yellow-500",
    incomplete: "bg-orange-500/20 border-orange-500",
  };

  return (
    <div
      className={`rounded-lg p-4 border transition ${
        statusColors[task.status]
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-white mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-slate-300 mb-2">{task.description}</p>
          )}
        </div>
        <span
          className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
            task.priority === "high"
              ? "bg-red-500/20 text-red-400"
              : task.priority === "medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-3">
        <span className="text-xs px-2 py-1 bg-slate-700 rounded">
          {new Date(task.date).toLocaleDateString()}
        </span>
        <span className={`text-xs px-2 py-1 rounded capitalize ${
          task.status === "completed"
            ? "bg-green-500/20 text-green-400"
            : task.status === "pending"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-orange-500/20 text-orange-400"
        }`}>
          {task.status}
        </span>
      </div>
    </div>
  );
}
    