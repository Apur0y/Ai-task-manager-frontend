# Roadmap Data Seeding Guide

## Overview
This guide explains how to load the 3-month dev roadmap tasks into MongoDB using the provided seed script.

## Prerequisites
1. ✅ Backend server running: `npm run dev` (backend) should be accessible at `http://localhost:5000`
2. ✅ MongoDB database running and connected to your backend
3. ✅ `.env.local` configured with `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## Data Format

Each task will be inserted in this MongoDB format:

```javascript
{
  _id: ObjectId,
  title: "Two Sum",
  description: "Classic hash map problem. Understand O(n) vs O(n²) approach.",
  category: "Learning",                    // Mapped from task.type
  date: 2026-04-06T00:00:00.000Z,         // Day date from roadmap
  status: "pending",                       // All new tasks start as pending
  priority: "high",                        // From roadmap task
  completedAt: null,
  linkedFromDate: null,
  isCarriedOver: false,
  resources: [                             // Resources from roadmap
    {
      label: "NeetCode Video",
      url: "https://www.youtube.com/watch?v=KLlXCFG5TnA"
    },
    {
      label: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/"
    }
  ],
  createdAt: 2026-04-08T14:30:00.000Z,
  updatedAt: 2026-04-08T14:30:00.000Z,
  __v: 0
}
```

## Category Mapping

Tasks are categorized based on their roadmap type:

| Roadmap Type | MongoDB Category |
|---|---|
| `dsa` | Learning |
| `tech` | Projects |
| `concept` | Learning |
| `revision` | DSA |
| `profile` | Learning |

## How to Use

### Step 1: Start Your Backend Server
Make sure your backend API is running:
```bash
# In your backend directory
npm run dev
# Should be listening on http://localhost:5000
```

### Step 2: Run the Seed Script
From the frontend directory:

```bash
npm run seed
```

Or directly with Node:
```bash
node scripts/seedRoadmapTasks.js
```

### Step 3: Monitor Progress
The script will output:
```
🚀 Starting roadmap data seed...

📝 Transforming roadmap tasks to MongoDB format...
✓ Transformed 130 tasks

📋 Sample transformed task:
{
  "title": "Two Sum",
  "description": "Classic hash map problem...",
  "category": "Learning",
  "date": "2026-04-06T00:00:00.000Z",
  "status": "pending",
  "priority": "high",
  ...
}

💾 Inserting tasks into database via API...

✓ Inserted task 1/130: Two Sum
✓ Inserted task 2/130: Install Docker & run first container
...
✅ Seeding completed!
```

## Total Tasks
The roadmap contains **130 tasks** across:
- ✅ 12 weeks
- ✅ 4-5 days per week
- ✅ 2-3 tasks per day
- ✅ Mix of DSA + Tech/Build tasks

## Verification

### Via Frontend
1. Start the dev server: `npm run dev`
2. Navigate to `/resources` page
3. You should see all 130 tasks grouped by category
4. Filter by category to verify data

### Via Backend API
```bash
curl http://localhost:5000/api/tasks/today
curl http://localhost:5000/api/tasks/stats/category
```

### Via MongoDB
```bash
# Connect to MongoDB
use ai_task_manager
db.tasks.countDocuments()  # Should return 130

# See sample data
db.tasks.findOne()
```

## Troubleshooting

### Error: "Cannot POST /tasks"
- ✅ Check backend is running on port 5000
- ✅ Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Error: "connect ECONNREFUSED"
- ✅ Backend server is not running
- ✅ Start it with `npm run dev` in the backend directory

### Error: "MongoDB connection error"
- ✅ MongoDB is not running
- ✅ Check your backend's MongoDB connection string

### Partial insert (e.g., 50/130 tasks inserted)
- ✅ Check backend logs for specific task failures
- ✅ Re-run the seed script (it will skip or update duplicates)

## Re-seeding / Clearing

To start fresh:

```bash
# From backend - Clear all tasks
# Run this in your backend MongoDB client or API endpoint:
db.tasks.deleteMany({})

# Then re-run seed
npm run seed
```

## Data Details

### Week 1 (Apr 6-9): Docker + Arrays & Strings
- 8 tasks (4 DSA + 4 Tech)
- Categories: Learning, Projects
- Priority: High (most tasks)

### Weeks 2-4 (Apr 13 - Apr 30): CI/CD + Algorithms
- 24 tasks covering binary search, two pointers, linked lists
- AWS, Docker, CI/CD tech tasks

### Weeks 5-8 (May 4 - May 28): AI Engineering + System Design
- 32 tasks
- AI/ML, RAG, embeddings, Kubernetes, system design

### Weeks 9-12 (Jun 1 - Jun 25): PostgreSQL + Final Sprint
- 36 tasks
- Advanced SQL, Redis, microservices, mock interviews

## Next Steps

After seeding:
1. ✅ View tasks in the frontend at `/resources`
2. ✅ Use dashboard to track progress
3. ✅ Create a custom tracker for this roadmap
4. ✅ Set up notifications/reminders per week

## Support

For issues or questions:
- Check task error logs in the seed script output
- Verify backend API is accessible: `curl http://localhost:5000/api/health`
- Check MongoDB connection: `db.tasks.stats()` in MongoDB client
