/**
 * Diagnostic script to check backend Task schema support
 * Usage: node scripts/checkBackendSchema.js
 */

async function checkBackendSchema() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  console.log('🔍 Checking backend Task schema...\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Simple task without resources
  const simpleTask = {
    title: 'Test Task 1',
    description: 'Testing simple task',
    category: 'Learning',
    date: new Date(),
    priority: 'medium',
    isCarriedOver: false,
  };

  // Test 2: Task with resources
  const taskWithResources = {
    title: 'Test Task 2 - With Resources',
    description: 'Testing task with resources',
    category: 'Learning',
    date: new Date(),
    priority: 'high',
    isCarriedOver: false,
    resources: [
      {
        label: 'YouTube Tutorial',
        url: 'https://www.youtube.com/watch?v=example',
      },
      {
        label: 'Documentation',
        url: 'https://example.com/docs',
      },
    ],
  };

  try {
    // Test simple task
    console.log('📝 Test 1: Inserting simple task (without resources)...');
    const response1 = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simpleTask),
    });

    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✓ Success! Simple task created.');
      console.log(`  ID: ${data1.task?._id || data1.data?._id}\n`);
    } else {
      const err1 = await response1.json();
      console.log('❌ Failed:', err1.message || err1);
      console.log();
    }

    // Test task with resources
    console.log('📝 Test 2: Inserting task with resources...');
    const response2 = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskWithResources),
    });

    if (response2.ok) {
      const data2 = await response2.json();
      const insertedTask = data2.task || data2.data;
      console.log('✓ Success! Task with resources created.');
      console.log(`  ID: ${insertedTask._id}`);

      if (insertedTask.resources && insertedTask.resources.length > 0) {
        console.log(`  ✓ Resources were SAVED (${insertedTask.resources.length} items):`);
        insertedTask.resources.forEach((r, i) => {
          console.log(`    ${i + 1}. ${r.label}: ${r.url}`);
        });
      } else {
        console.log(`  ⚠️  Resources were NOT saved by backend`);
        console.log(`     Backend response has these fields: ${Object.keys(insertedTask).join(', ')}`);
      }
      console.log();
    } else {
      const err2 = await response2.json();
      console.log('❌ Failed:', err2.message || err2);
      console.log();
    }

    console.log('📊 Summary:');
    console.log('If the second test shows "⚠️  Resources were NOT saved", then:');
    console.log('  1. Your backend Task schema does NOT have a resources field');
    console.log('  2. You need to add it to your MongoDB schema');
    console.log('  3. Update your backend model to include:');
    console.log('     resources: [{ label: String, url: String }]');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('   Make sure your backend is running at:', API_URL);
  }
}

checkBackendSchema();
