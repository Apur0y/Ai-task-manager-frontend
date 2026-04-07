const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

// HEALTH CHECK
export const healthCheck = async (): Promise<{ status: string }> => {
  return apiRequest("/health");
};

// TASK MANAGEMENT APIs
export const taskApi = {
  // Create a new task
  createTask: async (task: Omit<any, "id" | "createdAt" | "updatedAt">) => {
    return apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  // Get all tasks
  getAllTasks: async () => {
    return apiRequest<any[]>("/tasks");
  },

  // Get all tasks with date range filters
  getTasksByDateRange: async (from: string, to: string) => {
    const params = new URLSearchParams({ from, to });
    return apiRequest<any[]>(`/tasks?${params.toString()}`);
  },

  // Get today's tasks
  getTodayTasks: async () => {
    return apiRequest<any[]>("/tasks/today");
  },

  // Get tasks for a specific date
  getTasksByDate: async (date: string) => {
    return apiRequest<any[]>(`/tasks/date/${date}`);
  },

  // Get incomplete tasks from previous days
  getIncompletePreviousTasks: async () => {
    return apiRequest<any[]>("/tasks/incomplete/previous");
  },

  // Get last 90 days of tasks
  getLast90DaysTasks: async () => {
    return apiRequest<any[]>("/tasks/last90days");
  },

  // Update a task
  updateTask: async (id: string, updates: Partial<any>) => {
    return apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Mark task as complete
  completeTask: async (id: string) => {
    return apiRequest(`/tasks/${id}/complete`, {
      method: "PATCH",
    });
  },

  // Complete all tasks for a date
  completeAllTasksForDate: async (date: string) => {
    return apiRequest(`/tasks/complete-all/${date}`, {
      method: "PATCH",
    });
  },

  // Delete a task
  deleteTask: async (id: string) => {
    return apiRequest(`/tasks/${id}`, {
      method: "DELETE",
    });
  },

  // Get category statistics
  getCategoryStats: async () => {
    return apiRequest("/tasks/stats/category");
  },

  // Get progress by category
  getProgressByCategory: async () => {
    return apiRequest("/tasks/stats/progress");
  },
};

// AI FEATURES APIs
export const aiApi = {
  // Generate AI task suggestions
  generateSuggestions: async (context?: string) => {
    return apiRequest("/ai/generate-suggestions", {
      method: "POST",
      body: JSON.stringify({ context }),
    });
  },

  // Analyze productivity patterns
  analyzeProductivity: async (days: number = 7) => {
    return apiRequest("/ai/analyze-productivity", {
      method: "POST",
      body: JSON.stringify({ days }),
    });
  },

  // Get AI schedule optimization
  optimizeSchedule: async (date: string) => {
    return apiRequest("/ai/optimize-schedule", {
      method: "POST",
      body: JSON.stringify({ date }),
    });
  },

  // Get AI-generated insights
  getInsights: async () => {
    return apiRequest("/ai/insights");
  },
};
