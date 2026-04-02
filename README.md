# DevTracker — 3-Month Roadmap Tracker

A personal learning tracker built with Next.js 14 + Tailwind CSS. Dark, minimal, focused.

## Pages

- **Today** (`/`) — Your daily anchor task + today's tasks with status toggles
- **Plan** (`/plan`) — All 12 weeks, filterable by type and status
- **Resources** (`/resources`) — All learning links grouped by topic
- **Dashboard** (`/dashboard`) — Stats, progress bars, search + filter all tasks

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## How to add tasks

All data lives in `data/roadmap.json`. Add tasks following this structure:

```json
{
  "id": "t999",
  "type": "dsa",
  "title": "Merge Two Sorted Lists",
  "ref": "Leetcode #21 / NeetCode #44",
  "description": "Use two pointers. Draw the merge on paper first.",
  "status": "pending",
  "priority": "high",
  "estimatedMin": 45,
  "resources": [
    { "label": "NeetCode video", "url": "https://www.youtube.com/watch?v=XIdigk956u0" },
    { "label": "Leetcode #21", "url": "https://leetcode.com/problems/merge-two-sorted-lists/" }
  ],
  "notes": ""
}
```

**Task types:** `dsa` | `tech` | `concept` | `revision` | `profile`

**Status:** `pending` | `in-progress` | `done` | `skipped`

> Status changes are saved to `localStorage` so they persist across page refreshes without a backend.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- localStorage for persistence (no backend needed)
- Google Fonts: Syne + DM Sans + JetBrains Mono
