"use client";
import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

const ItemTypes = { TASK: "task" };

const Column = ({ status, tasks, moveTask, deleteTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`w-1/3 p-4 rounded shadow ${isOver ? "bg-gray-300" : "bg-gray-200"}`}>
      <h2 className="font-bold text-xl mb-2">{status}</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} moveTask={moveTask} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

export default Column;
