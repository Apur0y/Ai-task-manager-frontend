# Quick Reference Guide

Fast lookup for common tasks and patterns in the AI Task Manager frontend.

## 🚀 Common Tasks

### Starting the App
```bash
npm run dev
# Open http://localhost:3000
```

### Creating a New Component

1. Create file in `components/`
2. Add "use client" at top
3. Import types and API:
```typescript
"use client";

import { Task } from '@/lib/types';
import { taskApi } from '@/lib/api';
import { useState, useEffect } from 'react';
```

### Using API Methods
```typescript
// Tasks
taskApi.getTodayTasks()
taskApi.getAllTasks()
taskApi.getTasksByDate(date)
taskApi.createTask(data)
taskApi.updateTask(id, data)
taskApi.completeTask(id)
taskApi.deleteTask(id)

// AI
aiApi.generateSuggestions()
aiApi.analyzeProductivity(days)
aiApi.optimizeSchedule(date)
aiApi.getInsights()
```

### Handling Async/Loading States
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const load = async () => {
    try {
      const result = await taskApi.getTodayTasks();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

### Creating a Form Field
```typescript
<div>
  <label htmlFor="title" className="block text-sm font-medium mb-2">
    Title
  </label>
  <input
    id="title"
    name="title"
    type="text"
    value={formData.title}
    onChange={(e) => setFormData({...formData, title: e.target.value})}
    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
  />
</div>
```

### Adding Error Handling
```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary>
      {/* Component content */}
    </ErrorBoundary>
  );
}
```

## 🎨 Common Styles

### Button
```typescript
// Primary
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"

// Secondary
className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"

// Danger
className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"

// Disabled
className="px-4 py-2 bg-slate-600 text-white rounded opacity-50 cursor-not-allowed"
```

### Card
```typescript
// Default
className="bg-slate-800 rounded-lg p-4 border border-slate-700"

// With hover
className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition"

// Alert
className="bg-red-900/20 p-4 border border-red-700 rounded text-red-200"

// Success
className="bg-green-900/20 p-4 border border-green-700 rounded text-green-200"
```

### Grid Layout
```typescript
// 2-column responsive
className="grid grid-cols-2 md:grid-cols-3 gap-4"

// Sidebar layout
className="grid grid-cols-1 lg:grid-cols-4 gap-6"

// With sticky sidebar
className="grid grid-cols-1 lg:grid-cols-4 gap-6"
// + className="lg:col-span-1 sticky top-6"
```

### Loading State
```typescript
if (loading) {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin">
        <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
      </div>
      <p className="mt-3 text-slate-400">Loading...</p>
    </div>
  );
}
```

## 🔌 API Response Patterns

### Successful Response
```typescript
{
  success: true,
  data: Task[] | Task | Statistics
}
```

### Error Response
```typescript
{
  success: false,
  error: "Error message",
  message: "Human readable message"
}
```

## 📋 Task Interface

```typescript
interface Task {
  id: string                    // Unique identifier
  title: string                 // Task title (required)
  description?: string          // Detailed description
  status: TaskStatus           // pending|in-progress|done|skipped
  priority: Priority           // high|medium|low
  category?: TaskCategory      // work|personal|learning|health|other
  estimatedMin?: number        // Estimated minutes
  actualMin?: number           // Actual minutes spent
  dueDate?: string            // ISO date string
  resources?: Resource[]       // Links and references
  notes?: string              // Additional notes
  completedAt?: string        // Completion timestamp
  createdAt?: string          // Creation timestamp
  updatedAt?: string          // Last update timestamp
}
```

## 🎯 Common Type Definitions

```typescript
type TaskStatus = "pending" | "in-progress" | "done" | "skipped"
type Priority = "high" | "medium" | "low"
type TaskCategory = "work" | "personal" | "learning" | "health" | "other"

interface Resource {
  label: string
  url: string
}

interface CategoryStats {
  category: TaskCategory
  total: number
  completed: number
  completionRate: number
}
```

## 🔄 Data Transformation

### Group tasks by category
```typescript
const groups = tasks.reduce((acc, task) => {
  const cat = task.category || 'other';
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(task);
  return acc;
}, {} as Record<string, Task[]>);
```

### Calculate completion rate
```typescript
const rate = tasks.length > 0
  ? (tasks.filter(t => t.status === 'done').length / tasks.length) * 100
  : 0;
```

### Format date
```typescript
const formatted = new Date(dateString).toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
});
```

## 📱 Responsive Classes

```typescript
// Mobile first
className="text-sm md:text-base lg:text-lg"

// Layout changes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Spacing
className="p-4 md:p-6 lg:p-8"

// Display
className="hidden md:block" // Hidden on mobile
className="md:hidden"       // Visible only on mobile
```

## 🐛 Debugging

### Check API Response
```typescript
console.log('API Response:', data);
console.log('API Error:', error);
```

### Inspect Component State
```typescript
console.log('Tasks:', tasks);
console.log('Loading:', loading);
console.log('Error:', error);
```

### React DevTools
1. Install React DevTools extension
2. Inspect component hierarchy
3. View props and state changes
4. Track re-renders

### Network Debugging
1. Open DevTools → Network tab
2. Check API requests
3. View request/response bodies
4. Monitor status codes

## ✅ Checklist for New Features

- [ ] Create component in `components/`
- [ ] Add types in `lib/types.ts` if needed
- [ ] Add API methods in `lib/api.ts` if needed
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Add user feedback messages
- [ ] Test on mobile/tablet/desktop
- [ ] Add error boundary if complex
- [ ] Document in code comments
- [ ] Update types for TypeScript safety

## 🚀 Performance Tips

### Memoization
```typescript
import React from 'react';

const ExpensiveComponent = React.memo(({ data }: { data: Task }) => {
  return <div>{data.title}</div>;
});
```

### Lazy Loading
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <div>Loading...</div>
});
```

### useCallback
```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);
```

## 📚 Documentation Links

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs/)

## 🤔 Common Issues & Solutions

**Component not rendering:**
- Check "use client" directive
- Verify imports are correct
- Check TypeScript types
- Review browser console

**API calls failing:**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL
- Review network tab
- Check CORS settings

**Styles not applying:**
- Hard refresh (Ctrl+Shift+R)
- Clear .next: `rm -rf .next`
- Verify Tailwind classes exist
- Check specificity issues

**Type errors:**
- Run `npx tsc --noEmit`
- Check import paths
- Verify interface definitions
- Review @types packages

---

**Last Updated**: April 8, 2026

For more help, see [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) or [API_INTEGRATION.md](./API_INTEGRATION.md)
