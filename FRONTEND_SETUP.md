# AI Task Manager - Frontend

A modern, responsive task management application built with Next.js, React, and TypeScript. Features AI-powered suggestions, productivity analytics, and calendar-based task planning.

## 🚀 Features

### Task Management
- **Today's Tasks View** - See all tasks for today with real-time statistics
- **Date-based Planning** - Calendar interface to view and manage tasks for any date
- **Task Operations** - Create, edit, complete, and delete tasks
- **Task Categories** - Organize tasks by work, personal, learning, health, or custom categories
- **Priority Levels** - Set task priority (high, medium, low)
- **Time Estimation** - Track estimated and actual time spent

### Analytics & Insights
- **Productivity Dashboard** - View productivity trends, best/worst days, and recommendations
- **Category Progress** - Visual progress charts by task category
- **Statistics** - Real-time stats for completion rates, pending tasks, and more
- **AI Insights** - Get AI-generated insights and suggestions

### UI Components
- **Task List** - Organized, filterable task display
- **Progress Charts** - Visual progress tracking by category
- **Date Picker** - Calendar for easy date selection
- **Add/Edit Forms** - Intuitive forms for task creation and editing
- **Error Boundaries** - Graceful error handling with user feedback
- **Loading States** - Responsive loading indicators

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running at `http://localhost:5000/api`

### Installation

1. **Clone and navigate to project:**
```bash
cd ai-task-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create or update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
SERVER=http://localhost:5000/
```

4. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
app/
├── page.tsx                 # Home/Today's tasks view
├── dashboard/
│   └── page.tsx            # Dashboard with analytics
├── plan/
│   └── page.tsx            # Calendar and date-based planning
├── resources/
│   └── page.tsx            # Resources and task library
├── layout.tsx              # Root layout
└── globals.css             # Global styles

components/
├── AddTaskForm.tsx         # Form for adding/editing tasks
├── TaskList.tsx            # Task display component
├── TodayTasksView.tsx      # Today's tasks with stats
├── ProgressChart.tsx       # Category progress visualization
├── AiSuggestionsWidget.tsx # AI-generated suggestions
├── ProductivityDashboard.tsx # Analytics dashboard
├── DatePicker.tsx          # Calendar date picker
├── ErrorBoundary.tsx       # Error handling component
├── Sidebar.tsx             # Navigation sidebar
├── TaskCard.tsx            # Individual task card
└── ProgressBar.tsx         # Progress bar component

lib/
├── api.ts                  # API service layer
├── types.ts                # TypeScript interfaces and types
├── utils.ts                # Utility functions
├── useRoadmap.ts          # Roadmap management hook
└── constants.ts            # App constants (if needed)

data/
└── roadmap.json            # Static roadmap data
```

## 🔌 API Integration

The application connects to a backend API with the following endpoints:

### Task Management
- `POST /tasks` - Create a task
- `GET /tasks` - Get all tasks
- `GET /tasks/today` - Get today's tasks
- `GET /tasks/date/:date` - Get tasks for a date
- `GET /tasks/incomplete/previous` - Get overdue tasks
- `GET /tasks/last90days` - Get 90-day history
- `PUT /tasks/:id` - Update a task
- `PATCH /tasks/:id/complete` - Mark task complete
- `PATCH /tasks/complete-all/:date` - Complete all for date
- `DELETE /tasks/:id` - Delete a task
- `GET /tasks/stats/category` - Category statistics
- `GET /tasks/stats/progress` - Progress by category

### AI Features
- `POST /ai/generate-suggestions` - Get AI suggestions
- `POST /ai/analyze-productivity` - Analyze productivity
- `POST /ai/optimize-schedule` - Get schedule optimization
- `GET /ai/insights` - Get AI insights

### Health Check
- `GET /health` - API health status

## 🎨 Styling

The application uses **Tailwind CSS** with a dark theme:
- Primary background: `bg-slate-900`
- Secondary: `bg-slate-800`
- Accents: Blue, green, yellow, red
- Custom scrollbar styling
- Responsive grid layouts

### Color Scheme
- **Success/Complete**: Green (`text-green-400`)
- **In Progress**: Yellow (`text-yellow-400`)
- **Pending**: Orange (`text-orange-400`)
- **High Priority**: Red (`text-red-400`)
- **Links**: Blue (`text-blue-400`)

## 📱 Responsive Design

- **Mobile**: Full-width, single column layout
- **Tablet**: Two-column layout with sidebar
- **Desktop**: Three-column layout with expanded features

## 🔒 TypeScript Types

Key interfaces defined in `lib/types.ts`:

```typescript
interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  category?: TaskCategory
  estimatedMin?: number
  dueDate?: string
  resources?: Resource[]
}

interface CategoryStats {
  category: TaskCategory
  total: number
  completed: number
  completionRate: number
}

interface ProductivityAnalysis {
  period: string
  averageTasksPerDay: number
  mostProductiveDay: string
  topCategories: { category: TaskCategory; count: number }[]
  recommendations: string[]
}
```

## 🛠️ Development

### Creating New Components

1. Create component in `components/` directory
2. Use "use client" directive for client components
3. Import necessary types from `lib/types.ts`
4. Use `taskApi` from `lib/api.ts` for API calls
5. Handle loading/error states with proper UI feedback

### Example Component

```typescript
"use client";

import { useEffect, useState } from "react";
import { taskApi } from "@/lib/api";
import ErrorBoundary from "./ErrorBoundary";

export default function MyComponent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskApi.getTodayTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      {/* Your component JSX */}
    </ErrorBoundary>
  );
}
```

## 🚨 Error Handling

The application includes comprehensive error handling:

1. **Error Boundary** - Catches React component errors
2. **API Error Handling** - Graceful API failure handling
3. **User Feedback** - Clear error messages for users
4. **Loading States** - Visual indicators for async operations

## 📈 Performance Optimization

- Client-side rendering with Next.js App Router
- Lazy loading for heavy components
- Optimized API calls with proper caching
- CSS-in-JS with Tailwind for minimal bundle size
- Image optimization (if images are added)

## 🔄 State Management

- React hooks for local state (`useState`, `useEffect`)
- Context API can be added for global state if needed
- API service layer centralization in `lib/api.ts`

## 🧪 Testing

To add tests:

1. Install Jest and React Testing Library:
```bash
npm install --save-dev jest @testing-library/react
```

2. Create test files alongside components:
```typescript
// components/__tests__/TaskList.test.tsx
import { render, screen } from '@testing-library/react'
import TaskList from '../TaskList'

describe('TaskList', () => {
  it('renders task list', () => {
    // Your tests here
  })
})
```

## 📚 Dependencies

- **Next.js** - React framework
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **lucide-react** - Icons

## 🤝 Integration Notes

### With Backend
- Ensure backend is running before starting frontend
- Backend should be accessible at `http://localhost:5000/api`
- Both CORS should be properly configured

### Environment Configuration
- Development: Update `.env.local` with local backend URL
- Production: Update environment variables in deployment platform

## 📖 Documentation

For detailed API documentation, see the backend README.

For Next.js documentation: https://nextjs.org/docs
For React documentation: https://react.dev
For Tailwind CSS: https://tailwindcss.com/docs

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Component Not Rendering
- Check browser console for errors
- Verify "use client" directive for client components
- Ensure correct imports and TypeScript types

## 📝 License

[Add your license here]

## 👥 Authors

[Add author information]

---

**Last Updated**: April 8, 2026

For issues or questions, please contact the development team.
