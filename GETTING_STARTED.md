# Getting Started Guide

Welcome to the AI Task Manager Frontend! This guide will get you up and running in minutes.

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
# Verify Node.js is installed
node --version  # Should be 18+
npm --version   # Should be 8+

# Verify backend is running
curl http://localhost:5000/api/health
```

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000` and you're ready to go!

---

## 📖 First Steps

### View Today's Tasks
1. You're automatically on the Home page
2. See today's tasks in the main area
3. View stats cards at the top
4. See AI suggestions on the right

### Navigate Between Pages
Click the sidebar icons:
- **◉** (Home) - Today's tasks
- **≡** (Plan) - Calendar planning
- **◈** (Resources) - Task library
- **⬡** (Dashboard) - Full analytics

### Create a Task
From any page, you can:
1. Dashboard → Click "+ Add New Task"
2. Or scroll to the form

Fill in:
- **Title** (required)
- **Description** (optional)
- **Priority** (high/medium/low)
- **Category** (work/personal/learning/health/other)
- **Due Date** (optional)
- **Estimated Time** (in minutes)

Click "Add Task" and it's saved!

### Complete a Task
1. Find task in the list
2. Click the checkmark icon
3. Task moves to completed

### Delete a Task
1. Find task in the list
2. Click the trash icon
3. Confirm deletion

---

## 🎯 What Each Page Does

### Home (/)
**Your Daily Dashboard**
- Widgets for today's tasks
- Completion statistics
- Category progress
- AI suggestions
- Quick add button

### Dashboard (/dashboard)
**Complete Management Center**
- Create new tasks
- View all today's tasks
- Category progress charts
- AI suggestions
- Full productivity dashboard
- Analytics and insights

### Plan (/plan)
**Calendar Planning**
- Interactive calendar
- View tasks by date
- Complete all tasks for date
- Date-based task management
- Plan ahead

### Resources (/resources)
**Task Library**
- All tasks organized by category
- Filter by category
- View links and resources
- Track task status
- Bulk view

---

## 🔌 API Connection

### Verify Connection
```typescript
// In your browser console:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

If working: You see `{ status: "ok" }`

### Configuration
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Troubleshooting API Issues

**"Cannot reach API"**
- [ ] Backend running? `npm start` in backend folder
- [ ] Port 5000 correct? Check backend config
- [ ] CORS enabled? Check backend CORS settings
- [ ] URL correct? Check .env.local

**"API returns 404"**
- [ ] Endpoint exists? Check backend routes
- [ ] Method correct? (GET/POST/PUT/DELETE)
- [ ] Path correct? Check exact spelling

**"API returns 500"**
- [ ] Backend has error? Check server logs
- [ ] Database connected? Check backend DB config
- [ ] Valid request data? Check API_INTEGRATION.md

---

## 🎨 Understanding the UI

### Colors & Meaning
- **Green**: Success, completed tasks
- **Blue**: Primary actions, in-progress
- **Yellow**: Warnings, needs attention
- **Red**: Danger, high priority
- **Gray**: Secondary, less important

### Icons Used
- ✓ Checkmark - Mark complete
- 🗑️ Trash - Delete
- 💡 Lightbulb - AI suggestions
- 📊 Bar chart - Statistics
- 📅 Calendar - Date picker

### Buttons
- **Blue** - Primary action (submit, save)
- **Gray** - Secondary action (cancel, back)
- **Red** - Danger (delete, confirm)

---

## 💻 Development Tips

### Hot Reload
Changes auto-update in browser. No reload needed!

### Console Logging
```typescript
// View in browser console (F12)
console.log('My task:', task);
console.error('Error:', error);
```

### DevTools
Press F12 to open:
- **Elements** - View HTML structure
- **Console** - See logs and errors
- **Network** - View API calls
- **Application** - View storage

### TypeScript Errors
If you see red squiggles in code:
- Hover over to see error
- Check types in `lib/types.ts`
- Verify function parameters

### Component Not Showing
- Check "use client" at top
- Verify imports are correct
- Check console for errors
- Verify component renders JSX

---

## 📚 Common Tasks

### View All My Tasks
```typescript
import { taskApi } from '@/lib/api';

const tasks = await taskApi.getAllTasks();
console.log('All tasks:', tasks);
```

### Get Tasks for Specific Date
```typescript
const date = '2024-12-25';
const tasks = await taskApi.getTasksByDate(date);
```

### Get AI Suggestions
```typescript
const suggestions = await aiApi.generateSuggestions();
console.log('Suggestions:', suggestions);
```

### Analyze Productivity
```typescript
const analysis = await aiApi.analyzeProductivity(7); // Last 7 days
console.log('Analysis:', analysis);
```

---

## 🚨 Common Issues & Fixes

### Issue: "Tasks not loading"
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running
3. Check .env.local has correct URL
4. Hard refresh: Ctrl+Shift+R

### Issue: "API 404 error"
**Solution:**
1. Check backend routes are correct
2. Verify exact endpoint path
3. Check request method (GET/POST/PUT)
4. See API_INTEGRATION.md for endpoints

### Issue: "Component keeps loading"
**Solution:**
1. Check API response in Network tab
2. Look for 500 errors in backend
3. Verify data format matches types
4. Clear browser cache

### Issue: "Styles look weird"
**Solution:**
1. Hard refresh: Ctrl+Shift+R
2. Clear: `rm -rf .next`
3. Restart: `npm run dev`
4. Check Tailwind CSS classes

### Issue: "Cannot create task"
**Solution:**
1. Fill in required fields
2. Check console for error
3. Verify task data structure
4. Check backend error response

---

## 🔍 Debugging Guide

### Check What's Happening
```typescript
// Add logs to see state
console.log('Loading:', loading);
console.log('Tasks:', tasks);
console.log('Error:', error);
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Click request
5. View Request/Response

### Inspect Component Props
1. Open Console
2. Use React DevTools
3. Select component
4. View $props

### Check TypeScript
```bash
# Verify no type errors
npx tsc --noEmit
```

---

## 📱 Mobile Experience

### Responsive Design
- Automatically adapts to screen size
- Touch-friendly buttons
- Readable on small screens
- Scrollable on mobile

### Testing on Mobile
1. Chrome DevTools (F12)
2. Click device icon (top-left)
3. Select device size
4. Test interactions

### Mobile Tweaks
- Larger buttons on small screens
- Simplified cards
- Single column layout
- Optimized touch targets

---

## ⚙️ Configuration

### Environment Variables
`.env.local` controls:
```env
# Backend API location
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend server (optional)
SERVER=http://localhost:5000/
```

### Tailwind Customization
Edit `tailwind.config.ts` to customize:
- Colors
- Fonts
- Spacing
- Animations
- Custom utilities

### TypeScript Config
Edit `tsconfig.json` to control:
- Strict mode
- Module resolution
- Target environment
- Path aliases

---

## 🚀 Next Steps

1. **Create some tasks** - Get familiar with the UI
2. **View your stats** - See analytics in dashboard
3. **Explore AI features** - Try suggestions
4. **Read docs** - See ARCHITECTURE.md for deep dive
5. **Start coding** - Customize for your needs

---

## 📞 Getting Help

### Check Documentation
- **Setup Issues**: [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)
- **API Questions**: [API_INTEGRATION.md](./API_INTEGRATION.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Quick Lookup**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Common Questions

**Q: How do I run the backend?**
A: See the backend README. Usually `npm start` or `npm run dev`

**Q: Where's my data stored?**
A: In the backend database. Frontend loads from API.

**Q: Can I use this offline?**
A: Not right now (needs API), but PWA support can be added.

**Q: How do I deploy?**
A: See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) Build section.

**Q: Can I customize colors?**
A: Yes! Edit Tailwind config or component classes.

**Q: How do I add new features?**
A: See [ARCHITECTURE.md](./ARCHITECTURE.md) Scalability section.

---

## ✅ Verification Checklist

Before reporting issues, verify:
- [ ] Node.js 18+ installed
- [ ] Dependencies installed: `npm install`
- [ ] Backend running on port 5000
- [ ] .env.local has correct API URL
- [ ] No errors in browser console
- [ ] Hard refresh done: Ctrl+Shift+R
- [ ] Development server running: `npm run dev`
- [ ] Accessing http://localhost:3000

---

## 🎉 You're Ready!

You now have:
- ✅ Running Task Manager
- ✅ All features available
- ✅ Full documentation
- ✅ Example code
- ✅ Quick reference

**Happy task managing! 🚀**

---

**Need Help?**
1. Check relevant documentation file
2. View QUICK_REFERENCE.md
3. Check browser console for errors
4. Verify backend is running

**Last Updated**: April 8, 2026
