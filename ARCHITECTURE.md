# Architecture Overview

This document provides a high-level overview of the AI Task Manager frontend architecture.

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (User Interface)                  │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (React + TypeScript)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Application Layer (Pages)                 │  │
│  │  ┌──────────────┬──────────────┬──────────────────┐    │  │
│  │  │   Home       │  Dashboard   │ Plan            │    │  │
│  │  │  (Today)     │              │ (Calendar)      │    │  │
│  │  └──────────────┴──────────────┴──────────────────┘    │  │
│  │                                                        │  │
│  │   ┌──────────────────────────────────────────────┐   │  │
│  │   │        Component Layer                       │   │  │
│  │   ├──────────────────────────────────────────────┤   │  │
│  │   │ • TaskList          • DatePicker            │   │  │
│  │   │ • AddTaskForm       • AiSuggestionsWidget   │   │  │
│  │   │ • TodayTasksView    • ProductivityDashboard │   │  │
│  │   │ • ProgressChart     • ErrorBoundary         │   │  │
│  │   └──────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │   ┌──────────────────────────────────────────────┐   │  │
│  │   │     Service Layer (API Integration)          │   │  │
│  │   ├──────────────────────────────────────────────┤   │  │
│  │   │ • lib/api.ts (taskApi, aiApi)               │   │  │
│  │   │ • lib/types.ts (Type definitions)           │   │  │
│  │   │ • lib/utils.ts (Utilities)                  │   │  │
│  │   │ • lib/useRoadmap.ts (Custom hooks)          │   │  │
│  │   └──────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │   State Management:                                   │  │
│  │   • React Hooks (useState, useEffect, useCallback)   │  │
│  │   • Component Props & Callbacks                      │  │
│  │   • Browser LocalStorage (for persistence)          │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                    │
│                    HTTP/HTTPS                                │
│                          │                                    │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│               Backend API (Express/Node.js)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  ├─ /api/tasks (CRUD operations)                   │   │
│  │  ├─ /api/tasks/today                               │   │
│  │  ├─ /api/tasks/date/:date                          │   │
│  │  ├─ /api/ai/generate-suggestions                   │   │
│  │  ├─ /api/ai/analyze-productivity                   │   │
│  │  └─ /api/ai/optimize-schedule                      │   │
│  └──────────────────────────────────────────────────────┘   │
│           │           │           │                         │
│      Business     Database    External AI                    │
│      Logic        Layer        Services                      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Hierarchy

```
App Layout
├── Sidebar (Navigation)
└── Main Content
    ├── Home (/)
    │   ├── TodayTasksView
    │   ├── ProgressChart
    │   └── AiSuggestionsWidget
    │
    ├── Dashboard (/dashboard)
    │   ├── AddTaskForm
    │   ├── TodayTasksView
    │   ├── ProgressChart
    │   ├── AiSuggestionsWidget
    │   └── ProductivityDashboard
    │
    ├── Plan (/plan)
    │   ├── DatePicker
    │   └── TaskList
    │
    └── Resources (/resources)
        └── ResourceCard (multiple)
```

## 🔄 Data Flow

### Adding a New Task

```
User Input (AddTaskForm)
    ↓
Form Validation
    ↓
taskApi.createTask(data)
    ↓
API Request: POST /api/tasks
    ↓
Backend Processing
    ↓
Database Save
    ↓
Success Response
    ↓
Component State Update (setTasks)
    ↓
UI Re-render
    ↓
User Feedback (Success Message)
```

### Loading Today's Tasks

```
Component Mount (useEffect)
    ↓
taskApi.getTodayTasks()
    ↓
Loading State: true
    ↓
API Request: GET /api/tasks/today
    ↓
Backend Query
    ↓
JSON Response
    ↓
Parse & Transform Data
    ↓
Update State: setTasks(data)
    ↓
Loading State: false
    ↓
Render TaskList Component
```

### Productivity Analysis

```
User Navigates to Dashboard
    ↓
ProductivityDashboard Mounts
    ↓
aiApi.analyzeProductivity(7)
    ↓
API Request: POST /ai/analyze-productivity
    ↓
Backend ML Analysis
    ↓
Return Insights & Trends
    ↓
Display Charts & Recommendations
```

## 🎯 State Management Strategy

### Local Component State
```typescript
// Task list view
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [filter, setFilter] = useState('all');
```

### Derived State
```typescript
// Calculate stats from tasks
const completedCount = tasks.filter(t => t.status === 'done').length;
const completionRate = (completedCount / tasks.length) * 100;
```

### Side Effects
```typescript
// Fetch data on component mount or dependency change
useEffect(() => {
  loadTasks();
}, [selectedDate]); // Re-run when date changes
```

### Event Handlers
```typescript
const handleCompleteTask = async (taskId: string) => {
  // Optimistic update or update after API call
  await taskApi.completeTask(taskId);
  await loadTasks(); // Refresh data
};
```

## 🎨 Styling Architecture

### Tailwind CSS Utilities
- **Responsive**: `md:`, `lg:` prefixes for breakpoints
- **Dark Mode**: Slate color palette (`slate-900`, `slate-800`, etc.)
- **Interactive**: `hover:`, `focus:`, `disabled:` modifiers
- **Animations**: `animate-`, `transition` utilities

### Custom CSS
- Global styles in `app/globals.css`
- Custom animations (fadeUp, pulse-dot)
- Custom fonts and scrollbar styling

## 🔌 API Integration Points

### Request Flow
```
Component
  ↓
→ taskApi.createTask(data)
  ↓
→ apiRequest('/tasks', { method: 'POST', ... })
  ↓
→ fetch(url, options)
  ↓
→ Backend Processing
  ↓
→ JSON Response
  ↓
→ Type-safe Parsing
  ↓
→ Return to Component
  ↓
→ Error Handling
  ↓
Component Update
```

### Error Handling Flow
```
API Call
  ↓
→ Response.ok check
  ↓
→ If !ok: throw error
  ↓
→ Catch block
  ↓
→ Extract error message
  ↓
→ Update error state
  ↓
→ Display error UI
  ↓
→ Log to console
```

## 🔒 Type Safety

### End-to-End Types
```
API Response (Backend)
  ↓
→ taskApi function
  ↓
→ Generic Type<T>
  ↓
→ Component receives typed data
  ↓
→ Props interface definitions
  ↓
→ Sub-component type-safe props
```

### TypeScript Benefits
- Compile-time error checking
- IDE autocomplete and intellisense
- Self-documenting code
- Reduced runtime errors

## 📈 Performance Considerations

### Code Splitting
- Each page/route loaded separately
- Components lazy-loaded when needed
- Minimal initial bundle size

### Caching Strategy
- Browser cache for static assets
- API response caching (can be added)
- LocalStorage for user preferences

### Rendering Optimization
- React.memo for pure components
- useCallback for memoized functions
- Conditional rendering to reduce DOM nodes

## 🚀 Scalability

### Adding New Features
1. Define types in `lib/types.ts`
2. Add API methods in `lib/api.ts`
3. Create components in `components/`
4. Create pages in `app/`
5. Update navigation in `Sidebar.tsx`

### Adding New Pages
```
1. Create directory: app/new-feature/
2. Create page.tsx with "use client" directive
3. Import components and API methods
4. Add route to Sidebar
5. Add navigation link to layout
```

### API Versioning (Future)
```typescript
// Support multiple API versions
const BASE_URL = process.env.NEXT_PUBLIC_API_VERSION === 'v2'
  ? 'http://localhost:5000/api/v2'
  : 'http://localhost:5000/api/v1';
```

## 🔐 Security Considerations

### Current Implementation
- No authentication (assumes trusted internal network)
- No data validation on client (trust backend)
- No sensitive data storage

### Future Enhancements
- JWT token authentication
- Input validation and sanitization
- XSS prevention with React's built-in escaping
- CSRF token for state-changing requests
- Rate limiting on client-side

## 📊 Monitoring & Debugging

### Development Tools
- Browser DevTools (React, Network, Console)
- Next.js built-in debugging
- TypeScript type checking

### Logging Strategy
```typescript
console.log('[Component Name] Event:', data);
console.error('[Component Name] Error:', error);
console.warn('[Component Name] Warning:', message);
```

### Error Tracking (Future)
- Sentry integration
- Custom error logging service
- Analytics for user interactions

---

For more details, see specific documentation files:
- [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) - Setup and installation
- [API_INTEGRATION.md](./API_INTEGRATION.md) - API integration patterns
- [README.md](./README.md) - Project overview
