# API Integration Guide

This guide explains how to integrate with the backend API and handle various scenarios.

## 📡 API Service Layer

All API calls are centralized in `lib/api.ts`. This provides:
- Consistent error handling
- Type-safe responses
- Centralized base URL configuration
- Request/response interceptors (extensible)

### Using API Methods

```typescript
import { taskApi, aiApi } from '@/lib/api';

// Task Management
const tasks = await taskApi.getAllTasks();
const todayTasks = await taskApi.getTodayTasks();
const dateTask = await taskApi.getTasksByDate('2024-12-25');
const stats = await taskApi.getCategoryStats();

// Creating a task
const newTask = await taskApi.createTask({
  title: 'Complete project',
  description: 'Finish the React setup',
  priority: 'high',
  status: 'pending',
  category: 'work',
  estimatedMin: 120,
  dueDate: '2024-12-25'
});

// Updating tasks
await taskApi.updateTask(taskId, { status: 'in-progress' });
await taskApi.completeTask(taskId);
await taskApi.deleteTask(taskId);

// AI Features
const suggestions = await aiApi.generateSuggestions();
const analysis = await aiApi.analyzeProductivity(7); // Last 7 days
const optimization = await aiApi.optimizeSchedule('2024-12-25');
const insights = await aiApi.getInsights();
```

## 🔄 Error Handling Pattern

```typescript
"use client";

import { useEffect, useState } from 'react';
import { taskApi } from '@/lib/api';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await taskApi.getTodayTasks();
        setData(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## 🎯 Component Development Guide

### 1. Add/Edit Task Form Pattern

```typescript
"use client";

import { Task } from '@/lib/types';
import { taskApi } from '@/lib/api';
import { useState } from 'react';

interface AddTaskFormProps {
  onSubmit: (task: Task) => void;
  initialTask?: Task;
}

export default function AddTaskForm({ 
  onSubmit, 
  initialTask 
}: AddTaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    priority: initialTask?.priority || 'medium',
    category: initialTask?.category || 'work',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (initialTask?.id) {
        await taskApi.updateTask(initialTask.id, formData);
      } else {
        await taskApi.createTask(formData);
      }
      
      onSubmit(formData as Task);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 2. List Component Pattern

```typescript
"use client";

import { Task } from '@/lib/types';
import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';

interface TaskListProps {
  filter?: 'today' | 'date' | 'all';
  date?: string;
}

export default function TaskListComponent({ 
  filter = 'today', 
  date 
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [filter, date]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      let data;
      
      if (filter === 'today') {
        data = await taskApi.getTodayTasks();
      } else if (filter === 'date' && date) {
        data = await taskApi.getTasksByDate(date);
      } else {
        data = await taskApi.getAllTasks();
      }
      
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await taskApi.completeTask(id);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskApi.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {tasks.map(task => (
        <div key={task.id}>
          {/* Task render */}
          <button onClick={() => handleComplete(task.id)}>Complete</button>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Analytics Component Pattern

```typescript
"use client";

import { useEffect, useState } from 'react';
import { aiApi } from '@/lib/api';
import { ProductivityAnalysis } from '@/lib/types';

export default function AnalyticsComponent() {
  const [data, setData] = useState<ProductivityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const result = await aiApi.analyzeProductivity(7);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Analyzing...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <p>Avg Tasks/Day: {data.averageTasksPerDay}</p>
      <p>Completion: {(data.averageCompletionRate * 100).toFixed(0)}%</p>
      <p>Best Day: {data.mostProductiveDay}</p>
    </div>
  );
}
```

## 🎨 Styling Patterns

### Button Variants

```typescript
// Primary action
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"

// Secondary action
className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"

// Danger action
className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"

// Disabled state
className="px-4 py-2 bg-slate-600 text-white rounded opacity-50 cursor-not-allowed"
```

### Card Variants

```typescript
// Default card
className="bg-slate-800 rounded-lg p-4 border border-slate-700"

// Hover card
className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition"

// Alert card
className="bg-red-900/20 p-4 border border-red-700 rounded text-red-200"

// Success card
className="bg-green-900/20 p-4 border border-green-700 rounded text-green-200"
```

### Grid Layouts

```typescript
// 2-column on mobile, 3 on desktop
className="grid grid-cols-2 md:grid-cols-3 gap-4"

// Sidebar layout
className="grid grid-cols-1 lg:grid-cols-4 gap-6"
// And use lg:col-span-1 for sidebar and lg:col-span-3 for content

// Full-width responsive
className="w-full max-w-4xl mx-auto"
```

## 🔐 Authentication (Future)

When implementing authentication, add tokens to API requests:

```typescript
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') 
    : null;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // ... rest of implementation
}
```

## 📊 Data Transformation Patterns

```typescript
// Transform API response to UI format
const formatTaskForDisplay = (task: Task) => ({
  ...task,
  formattedDate: new Date(task.dueDate || '').toLocaleDateString(),
  priorityColor: {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  }[task.priority],
  statusLabel: {
    pending: 'Not Started',
    'in-progress': 'In Progress',
    done: 'Completed',
    skipped: 'Skipped'
  }[task.status]
});

// Group tasks by category
const groupByCategory = (tasks: Task[]) => 
  tasks.reduce((acc, task) => {
    const cat = task.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

// Calculate completion percentage
const getCompletionRate = (tasks: Task[]) => 
  tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
    : 0;
```

## 🚀 Performance Tips

1. **Memoization**: Use React.memo for expensive components
   ```typescript
   const TaskCard = React.memo(({ task }: { task: Task }) => (...));
   ```

2. **Code Splitting**: Use dynamic imports for heavy components
   ```typescript
   const HeavyComponent = dynamic(() => import('./Heavy'), { 
     loading: () => <div>Loading...</div> 
   });
   ```

3. **Caching**: Store API responses when appropriate
   ```typescript
   const cache = new Map();
   const getCachedData = async (key: string) => {
     if (cache.has(key)) return cache.get(key);
     const data = await apiCall();
     cache.set(key, data);
     return data;
   };
   ```

## 📝 Environment Variables

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production
NEXT_PUBLIC_API_URL=https://api.example.com/api

# Optional features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_LOG_LEVEL=info
```

---

For more information, see the main FRONTEND_SETUP.md documentation.
