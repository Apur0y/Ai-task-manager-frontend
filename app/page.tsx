"use client";

import TodayTasksView from "@/components/TodayTasksView";
import AiSuggestionsWidget from "@/components/AiSuggestionsWidget";
import ProgressChart from "@/components/ProgressChart";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Calendar } from "lucide-react";

export default function HomePage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-400">{today}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Today's Focus</h1>
            <p className="text-slate-400">
              Stay focused and get things done
            </p>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - Today's tasks (2 columns) */}
            <div className="lg:col-span-2">
              <TodayTasksView />
            </div>

            {/* Sidebar - Progress and suggestions */}
            <div className="space-y-6">
              <ProgressChart />
              <AiSuggestionsWidget />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

