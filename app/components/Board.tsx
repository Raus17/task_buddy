"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTasks, addTask, updateTask, deleteTask } from "../redux/tasksSlice";
import AddTaskModal from "./AddTaskModal";
import Column from "./Column";
import { auth } from "../../FirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const Board: React.FC = () => {
  const [user] = useAuthState(auth); // Get the logged-in user
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user-specific tasks when user is authenticated
  useEffect(() => {
    if (user) {
      console.log("Fetching tasks for user:", user.uid);
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  const handleAddTask = (task: Omit<Task, "id">) => {
    if (!user) return;
    dispatch(addTask({ userId: user.uid, task }));
  };

  const handleMoveTask = (task: Task, newStatus: string) => {
    if (!user || task.status === newStatus) return;
    dispatch(updateTask({ userId: user.uid, task: { ...task, status: newStatus } }));
  };

  const handleDeleteTask = (taskId: string) => {
    if (!user) return;
    dispatch(deleteTask({ userId: user.uid, taskId }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        {user ? (
          <>
            <button onClick={() => setIsModalOpen(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">
              Add Task
            </button>
            <div className="flex gap-4">
              {["To-Do", "In-Progress", "Completed"].map((status) => (
                <Column
                  key={status}
                  status={status}
                  tasks={tasks.filter((task) => task.status === status)}
                  moveTask={handleMoveTask}
                  deleteTask={handleDeleteTask}
                />
              ))}
            </div>
            {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} onSave={handleAddTask} />}
          </>
        ) : (
          <p className="text-center text-red-500">Please log in to manage tasks.</p>
        )}
      </div>
    </DndProvider>
  );
};

export default Board;
