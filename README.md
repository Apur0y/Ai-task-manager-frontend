# AI Task Manager - Frontend

A modern, fully-featured task management application with AI-powered suggestions and productivity analytics. Built with Next.js 14, React 18, and TypeScript.

## ✨ Features

### 📋 Task Management
- **Today's Tasks** - Dashboard showing today's tasks with real-time statistics
- **Calendar Planning** - Date-based task planning with calendar interface
- **Task CRUD** - Create, read, update, delete, and complete tasks
- **Categories** - Organize tasks by work, personal, learning, health, and more
- **Priority Levels** - Set task priority (high, medium, low)
- **Time Tracking** - Estimate and track time spent on tasks

### 🤖 AI Features
- **Smart Suggestions** - AI-generated task recommendations
- **Productivity Analysis** - Analyze productivity patterns
- **Schedule Optimization** - Get AI-recommended task scheduling
- **Insights** - AI-generated insights about your progress

### 📊 Analytics
- **Real-time Stats** - Task counts, completion rates, progress
- **Category Progress** - Visual charts by category
- **Productivity Dashboard** - Comprehensive analytics with recommendations
- **Historical Data** - Track 90 days of productivity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API at `http://localhost:5000/api`

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# 3. Run dev server
npm run dev

# 4. Open browser
http://localhost:3000
```

## 📖 Documentation

- **[FRONTEND_SETUP.md](./FRONTEND_SETUP.md)** - Complete setup guide
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - API patterns and examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

## 🗺️ Pages

- **Home** (`/`) - Today's tasks with progress and suggestions
- **Dashboard** (`/dashboard`) - Full analytics, task management, statistics
- **Plan** (`/plan`) - Calendar interface for date-based planning
- **Resources** (`/resources`) - Task library organized by category

## 🏗️ Project Structure

```
app/                              # Pages
├── page.tsx                      # Home
├── dashboard/page.tsx            # Dashboard
├── plan/page.tsx                 # Calendar planner
└── resources/page.tsx            # Resources

components/                       # React components
├── AddTaskForm.tsx              # Add/edit tasks
├── TaskList.tsx                 # Display tasks
├── TodayTasksView.tsx           # Today's view
├── ProgressChart.tsx            # Category progress
├── AiSuggestionsWidget.tsx      # AI suggestions
├── ProductivityDashboard.tsx    # Analytics
├── DatePicker.tsx               # Calendar
├── ErrorBoundary.tsx            # Error handling
└── ...                          # Other components

lib/                             # Services & utilities
├── api.ts                       # API layer (new)
├── types.ts                     # Types (expanded)
├── utils.ts                     # Utilities
└── useRoadmap.ts               # Custom hooks
```

## 🔌 API Integration

Backend endpoints available at `http://localhost:5000/api`:

**Tasks:**
- POST /tasks - Create
- GET /tasks - Get all
- GET /tasks/today - Today's
- GET /tasks/date/:date - By date
- PUT /tasks/:id - Update
- PATCH /tasks/:id/complete - Mark done
- DELETE /tasks/:id - Delete

**AI:**
- POST /ai/generate-suggestions - Get suggestions
- POST /ai/analyze-productivity - Analyze patterns
- POST /ai/optimize-schedule - Optimize scheduling
- GET /ai/insights - Get insights

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed patterns.

## 💻 API Usage Example

```typescript
import { taskApi, aiApi } from '@/lib/api';

// Get tasks
const tasks = await taskApi.getTodayTasks();

// Create task
await taskApi.createTask({
  title: 'Learn React',
  priority: 'high',
  category: 'learning',
  estimatedMin: 120
});

// Complete task
await taskApi.completeTask(taskId);

// Get AI suggestions
const suggestions = await aiApi.generateSuggestions();

// Analyze productivity
const analysis = await aiApi.analyzeProductivity(7);
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Theme**: Dark mode (slate palette)
- **Responsive**: Mobile-first design
- **Icons**: Lucide React

### Colors
- Primary accent: Blue (`bg-blue-600`)
- Success: Green (`text-green-400`)
- Warning: Yellow (`text-yellow-400`)
- Danger: Red (`text-red-400`)

## 📦 Tech Stack

- Next.js 14.2.3
- React 18
- TypeScript
- Tailwind CSS 3.3
- Lucide React (icons)
- Fetch API (HTTP)

## 🛠️ Development

### Build
```bash
npm run build
npm start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Troubleshooting

**API Connection Issues:**
- Ensure backend runs on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS is enabled

**Build Errors:**
- Clear: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node.js version (requires 18+)

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)

## 🔄 Data Flow

```
User Action (UI) → Component State
    ↓
taskApi.* call
    ↓
HTTP Request (Fetch)
    ↓
Backend API
    ↓
Response JSON
    ↓
Update Component State
    ↓
Re-render UI
```

## 📝 Notes

- All state management uses React hooks (useState, useEffect)
- API calls are centralized in `lib/api.ts`
- Type definitions in `lib/types.ts`
- Error boundary wraps major features
- Responsive grid layouts for all screens

## 🤝 Integration

The frontend works with the backend API. Ensure:
