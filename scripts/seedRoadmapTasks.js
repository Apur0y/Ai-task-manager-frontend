    const roadmapData = require('../data/roadmap.json');

    /**
     * Transform roadmap tasks to MongoDB Task format
     * Run this script to seed the database with all roadmap tasks
     * Usage: node scripts/seedRoadmapTasks.js
     */

    async function transformTasks() {
    const tasks = [];
    const now = new Date();

    // Iterate through all weeks
    roadmapData.weeks.forEach(week => {
        week.days.forEach(day => {
        const dayDate = new Date(day.date);

        day.tasks.forEach(task => {
            // Map task type to category
            const categoryMap = {
            'dsa': 'Learning',
            'tech': 'Projects',
            'concept': 'Learning',
            'revision': 'DSA',
            'profile': 'Learning',
            };

            const transformedTask = {
            title: task.title,
            description: task.description || '',
            category: categoryMap[task.type] || 'Other',
            date: dayDate,
            status: 'pending',
            priority: task.priority || 'medium',
            completedAt: null,
            linkedFromDate: null,
            isCarriedOver: false,
            resources: Array.isArray(task.resources)
        ? task.resources.map(r => ({
            label: r.label || '',
            url: r.url || '',
        }))
        : [],
            createdAt: now,
            updatedAt: now,
            };

            tasks.push(transformedTask);
        });
        });
    });

    return tasks;
    }

    /**
     * Insert tasks via API
     */
    async function insertTasksViaAPI(tasks) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    for (let i = 0; i < tasks.length; i++) {
        try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(tasks[i]),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to insert task ${i + 1}: ${tasks[i].title}`, error);
        } else {
            console.log(`✓ Inserted task ${i + 1}/${tasks.length}: ${tasks[i].title}`);
        }
        } catch (err) {
        console.error(`Error inserting task ${i + 1}: ${tasks[i].title}`, err.message);
        }
    }
    }

    /**
     * Main function
     */
    async function main() {
    console.log('🚀 Starting roadmap data seed...\n');

    try {
        // Transform tasks
        console.log('📝 Transforming roadmap tasks to MongoDB format...');
        const tasks = await transformTasks();
        console.log(`✓ Transformed ${tasks.length} tasks\n`);

        // Display sample task
        console.log('📋 Sample transformed task:');
        console.log(JSON.stringify(tasks[0], null, 2));
        console.log('\n');

        // Insert via API
        console.log('💾 Inserting tasks into database via API...\n');
        await insertTasksViaAPI(tasks);

        console.log('\n✅ Seeding completed!');
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
    }

    main();
