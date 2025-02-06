import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

interface ColumnProps {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string) => void;
  deleteTask: (taskId: string) => void;
  openUpdateModal: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, moveTask, deleteTask, openUpdateModal }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { task: Task }) => {
      if (item.task.status !== status) {
        moveTask(item.task, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`w-1/3 p-4 rounded shadow ${
        isOver ? "bg-gray-300" : "bg-gray-200"
      }`}
    >
      <h2 className="font-bold text-xl mb-2">{status}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            openUpdateModal={openUpdateModal}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
