import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const TaskFilters = ({ tasks = [], onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState('');

  // Safely get unique categories with null checks
  const categories = [...new Set(tasks?.map(task => task?.category || ''))]
    .filter(Boolean)
    .sort();

  // Filter options for due dates
  const dueDateOptions = [
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'Due This Week' },
    { value: 'month', label: 'Due This Month' }
  ];

  useEffect(() => {
    // Ensure tasks is an array before filtering
    const tasksArray = Array.isArray(tasks) ? tasks : [];

    const filteredTasks = tasksArray.filter(task => {
      if (!task) return false;  // Skip if task is null/undefined

      const matchesSearch = (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || task.category === selectedCategory;

      const matchesDueDate = () => {
        if (!selectedDueDate || !task.dueDate) return true;

        const taskDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeek = new Date(today);
        thisWeek.setDate(today.getDate() + 7);

        const thisMonth = new Date(today);
        thisMonth.setMonth(today.getMonth() + 1);

        switch (selectedDueDate) {
          case 'overdue':
            return taskDate < today;
          case 'today':
            return taskDate.toDateString() === today.toDateString();
          case 'week':
            return taskDate >= today && taskDate <= thisWeek;
          case 'month':
            return taskDate >= today && taskDate <= thisMonth;
          default:
            return true;
        }
      };

      return matchesSearch && matchesCategory && matchesDueDate();
    });

    onFilterChange(filteredTasks);
  }, [searchTerm, selectedCategory, selectedDueDate, tasks]);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4">
        <p className="p-2">Filter By :</p>
  
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
  
        {/* Due Date Filter */}
        <select
          value={selectedDueDate}
          onChange={(e) => setSelectedDueDate(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Due Dates</option>
          {dueDateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
  
      {/* Search Input - Aligned Right */}
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-4 py-2 w-[260px] border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );
};

export default TaskFilters;