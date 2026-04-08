"use client";

import React, { useState } from "react";
import { taskService, TaskInput } from "@/lib/taskService";

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onTaskAdded,
}) => {
  const [formData, setFormData] = useState<TaskInput>({
    title: "",
    description: "",
    category: "DSA",
    priority: "medium",
    date: "", // ✅ added
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "DSA",
    "Docker",
    "Problem Solving",
    "Projects",
    "Learning",
    "Code Review",
    "Other",
  ];

  const priorities = ["low", "medium", "high"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      await taskService.createTask(formData);

      setFormData({
        title: "",
        description: "",
        category: "DSA",
        priority: "medium",
        date: "", // ✅ reset
      });

      onTaskAdded();
    } catch (err) {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
        ➕ Add New Task
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs sm:text-sm text-slate-300 mb-1">
            Task Title *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs sm:text-sm text-slate-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description..."
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs sm:text-sm text-slate-300 mb-1">
            Due Date
          </label>
          <input
            name="date"
            type="date"
            value={formData.date || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-slate-300 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri.charAt(0).toUpperCase() + pri.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-sm sm:text-base rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;