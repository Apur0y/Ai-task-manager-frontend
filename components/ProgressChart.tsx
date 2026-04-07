"use client";

import { useEffect, useState } from "react";
import { taskService, CategoryStats } from "@/lib/taskService";
import { BarChart3 } from "lucide-react";

export default function ProgressChart() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategoryStats();
  }, []);

  const loadCategoryStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getCategoryStats();
      setStats(Array.isArray(data) ? data : data.stats || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load statistics"
      );
      console.error("Error loading category stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    work: "bg-blue-500",
    personal: "bg-purple-500",
    learning: "bg-green-500",
    health: "bg-red-500",
    other: "bg-slate-500",
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Progress by Category</h3>
        </div>
        <button
          onClick={loadCategoryStats}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-400">
          <div className="inline-block animate-spin mb-2">
            <div className="w-6 h-6 border-3 border-slate-600 border-t-blue-400 rounded-full"></div>
          </div>
          <p>Loading statistics...</p>
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No data available
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      categoryColors[stat.category as keyof typeof categoryColors]
                    }`}
                  ></div>
                  <span className="text-sm font-medium capitalize">
                    {stat.category}
                  </span>
                </div>
                <span className="text-sm text-slate-300">
                  {stat.completed} / {stat.total}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    categoryColors[stat.category as keyof typeof categoryColors]
                  }`}
                  style={{
                    width: `${stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0}% complete
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
