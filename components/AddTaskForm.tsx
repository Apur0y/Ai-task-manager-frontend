
'use client';

import React, { useState } from 'react';
import { taskService, TaskInput } from '@/lib/taskService';

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    category: 'DSA',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'DSA',
    'Docker',
    'Problem Solving',
    'Projects',
    'Learning',
    'Code Review',
    'Other'
  ];

  const priorities = ['low', 'medium', 'high'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      await taskService.createTask(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'DSA',
        priority: 'medium'
      });

      onTaskAdded();
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {priorities.map(pri => (
              <option key={pri} value={pri}>
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default AddTaskForm;