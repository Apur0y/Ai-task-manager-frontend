"use client";

import TodayTasksView from "@/components/TodayTasksView";
import AiSuggestionsWidget from "@/components/AiSuggestionsWidget";
import ProgressChart from "@/components/ProgressChart";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Calendar } from "lucide-react";
import AddTaskForm from "@/components/AddTaskForm";
import { useState } from "react";

export default function HomePage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
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
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
              <span className="text-xs sm:text-sm text-slate-400">{today}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Today's Focus</h1>
            <p className="text-sm sm:text-base text-slate-400">Stay focused and get things done</p>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main content - Today's tasks (2 columns) */}
            <div className="lg:col-span-2">
              <TodayTasksView />
            </div>

            {/* Sidebar - Progress and suggestions */}
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

              <ProgressChart />
              <AiSuggestionsWidget />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
