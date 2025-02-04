"use client";
import React from "react";
import { useDrag } from "react-dnd";

const ItemTypes = { TASK: "task" };

const Task = ({ task, moveTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 bg-white rounded shadow ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => deleteTask(task.id)} className="mt-2 text-red-500">
        Delete
      </button>
    </div>
  );
};

export default Task;
