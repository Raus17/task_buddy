"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTasks, addTask, updateTask, deleteTask } from "../redux/tasksSlice";
import AddTaskModal from "./AddTaskModal";
import Column from "./Column"; 

const ItemTypes = { TASK: "task" };

const Board: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = (task: Omit<Task, "id">) => {
    dispatch(addTask(task));
  };

  const handleMoveTask = (task: Task, newStatus: string) => {
    dispatch(updateTask({ ...task, status: newStatus }));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <button onClick={() => setIsModalOpen(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">Add Task</button>
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
      </div>
    </DndProvider>
  );
};

export default Board;
