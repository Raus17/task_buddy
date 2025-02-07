"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTasks, addTask, updateTask, deleteTask } from '../redux/tasksSlice';
import AddTaskModal from './AddTaskModal';
import UpdateTaskModal from './UpdateTaskModal';
import TaskFilters from './TaskFilters';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../FirebaseConfig';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  category?: string;
  date?: string;
}

const List: React.FC = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    'To-Do': true,
    'In-Progress': true,
    'Completed': false
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleAddTask = (task: Omit<Task, "id">) => {
    if (!user) return;
    dispatch(addTask({ userId: user.uid, task })).then(() => {
      dispatch(fetchTasks(user.uid));
      setIsAddModalOpen(false);
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (!user) return;
    dispatch(updateTask({ 
      userId: user.uid, 
      taskId: updatedTask.id, 
      updates: updatedTask 
    })).unwrap()
      .then(() => {
        setIsUpdateModalOpen(false);
        dispatch(fetchTasks(user.uid));
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
      });
  };

  const openUpdateModal = (task: Task) => {
    setEditTask(task);
    setIsUpdateModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To-Do':
        return 'bg-pink-200';
      case 'In-Progress':
        return 'bg-sky-200';
      case 'Completed':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const renderSection = (status: string) => {
    const tasksInSection = filteredTasks.filter(task => task.status === status);
    const isExpanded = expandedSections[status];
    const statusColor = getStatusColor(status);

    return (
      <div key={status} className="mb-4">
        <div 
          className={`${statusColor} p-3 rounded-t-lg flex justify-between items-center cursor-pointer`}
          onClick={() => setExpandedSections(prev => ({ ...prev, [status]: !prev[status] }))}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{status}</span>
            <span className="text-sm text-gray-600">({tasksInSection.length})</span>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        <div className={`border border-t-0 rounded-b-lg overflow-hidden transition-all duration-700 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {tasksInSection.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No Tasks in {status}
            </div>
          ) : (
            <div className="divide-y">
              {tasksInSection.map(task => (
                <div key={task.id} className="grid grid-cols-4 p-3 hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="truncate">{task.title}</span>
                  </div>
                  <div>{task.date ? new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No due date'}</div>
                  <div>{task.status}</div>
                  <div className="flex justify-between items-center">
                    <span>{task.category || 'Uncategorized'}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openUpdateModal(task)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => dispatch(deleteTask({ userId: user.uid, taskId: task.id })).then(() => dispatch(fetchTasks(user.uid)))}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <TaskFilters tasks={tasks} onFilterChange={setFilteredTasks} />
        <button onClick={() => setIsAddModalOpen(true)} className="p-2 px-6 bg-[#7B1984] text-white rounded-full hover:bg-purple-700">
          Add Task
        </button>
      </div>
      {['To-Do', 'In-Progress', 'Completed'].map(status => renderSection(status))}
      {isAddModalOpen && <AddTaskModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddTask} />}
      {isUpdateModalOpen && editTask && <UpdateTaskModal onClose={() => setIsUpdateModalOpen(false)} onSave={handleUpdateTask} task={editTask} />}
    </div>
  );
};

export default List;