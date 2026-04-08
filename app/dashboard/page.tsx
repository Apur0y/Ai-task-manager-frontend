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
            <div className="lg:col-span-2 ">
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

        

