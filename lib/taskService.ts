const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  status: 'pending' | 'completed' | 'incomplete';
  priority: 'low' | 'medium' | 'high';
  completedAt?: string;
  linkedFromDate?: string;
  isCarriedOver: boolean;
  resources?: Array<{ label: string; url: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  category: string;
  date?: string;
  priority?: 'low' | 'medium' | 'high';
  resources?: Array<{ label: string; url: string }>;
}

export interface CategoryStats {
  category: string;
  total: number;
  completed: number;
  pending: number;
  incomplete: number;
  completionPercentage: string;
}

export interface TaskResponse<T = Task | Task[]> {
  success: boolean;
  message?: string;
  task?: T;
  tasks?: Task[];
  data?: any;
  error?: string;
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
  incompleteTasks?: number;
}

class TaskService {
  private apiUrl = `${API_BASE_URL}/tasks`;

  // Create a new task
  async createTask(taskData: TaskInput): Promise<TaskResponse<Task>> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  }

  // Get today's tasks
  async getTodayTasks(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/today`);
    if (!response.ok) throw new Error('Failed to fetch today tasks');
    return response.json();
  }
  async getAllTasks(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}`);
    if (!response.ok) throw new Error('Failed to fetch today tasks');
    return response.json();
  }

  // Get tasks for a specific date
  async getTasksByDate(date: string): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/date/${date}`);
    if (!response.ok) throw new Error('Failed to fetch tasks for date');
    return response.json();
  }

  // Get tasks for a date range
  async getTasksByDateRange(startDate: string, endDate: string): Promise<TaskResponse<Task[]>> {
    const response = await fetch(
      `${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  }

  // Get incomplete tasks from previous days
  async getIncompleteTasksFromPreviousDays(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/incomplete/previous`);
    if (!response.ok) throw new Error('Failed to fetch incomplete tasks');
    return response.json();
  }

  // Update a task
  async updateTask(id: string, updates: Partial<TaskInput>): Promise<TaskResponse<Task>> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  }

  // Mark task as complete
  async markTaskComplete(id: string): Promise<TaskResponse<Task>> {
    const response = await fetch(`${this.apiUrl}/${id}/complete`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to complete task');
    return response.json();
  }

  // Delete a task
  async deleteTask(id: string): Promise<TaskResponse<Task>> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
  }

  // Complete all tasks for a date
  async completeAllTasksForDate(date: string): Promise<TaskResponse> {
    const response = await fetch(`${this.apiUrl}/complete-all/${date}`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to complete all tasks');
    return response.json();
  }

  // Get last 90 days tasks
  async getLast90DaysTasks(): Promise<TaskResponse<Task[]>> {
    const response = await fetch(`${this.apiUrl}/last90days`);
    if (!response.ok) throw new Error('Failed to fetch 90 days tasks');
    return response.json();
  }

  // Get category statistics
  async getCategoryStats(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/stats/category`);
    if (!response.ok) throw new Error('Failed to fetch category stats');
    return response.json();
  }

  // Get progress by category
  async getProgressByCategory(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/stats/progress`);
    if (!response.ok) throw new Error('Failed to fetch progress');
    return response.json();
  }
}

export const taskService = new TaskService();
