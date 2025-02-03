"use client"
import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { db } from "../../FirebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import AddTaskModal from "./AddTaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
}

interface TaskProps {
  task: Task;
  moveTask: (task: Task, newStatus: string) => void;
  deleteTask: (id: string) => void;
}

interface ColumnProps {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string) => void;
  deleteTask: (id: string) => void;
}

const ItemTypes = {
  TASK: "task",
};

const Task: React.FC<TaskProps> = ({ task, moveTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="p-2 m-2 bg-white shadow rounded cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.date}</p>
      <button onClick={() => deleteTask(task.id)} className="text-red-500">Delete</button>
    </div>
  );
};

const Column: React.FC<ColumnProps> = ({ status, tasks, moveTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: { id: string }) => moveTask(tasks.find(task => task.id === item.id)!, status),
  });

  return (
    <div
      ref={drop}
      className="w-1/3 p-4 bg-gray-100 rounded min-h-[300px]"
    >
      <h2 className={`text-center p-2 rounded mb-2 ${status === "To-Do" ? "bg-purple-300" : status === "In-Progress" ? "bg-blue-300" : "bg-green-300"}`}>{status}</h2>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No Tasks in {status}</p>
      ) : (
        tasks.map((task) => (
          <Task key={task.id} task={task} moveTask={moveTask} deleteTask={deleteTask} />
        ))
      )}
    </div>
  );
};

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Task[];
    setTasks(tasksData);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<Task, "id">) => {
    const docRef = await addDoc(collection(db, "tasks"), task);
    setTasks((prev) => [...prev, { ...task, id: docRef.id }]);
  };

  const moveTask = async (task: Task, newStatus: string) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, { status: newStatus });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks((prev) => prev.filter((task) => task.id !== id));
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
              moveTask={moveTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>
        {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} onSave={addTask} />}
      </div>
    </DndProvider>
  );
};

export default Board;
