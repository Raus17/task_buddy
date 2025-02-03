const Column = ({ status, tasks, moveTask, deleteTask }) => {
    return (
      <div className="w-1/3 bg-gray-200 p-4 rounded">
        <h2 className="font-bold text-xl mb-2">{status}</h2>
        {tasks.map((task) => (
          <Task key={task.id} task={task} moveTask={moveTask} deleteTask={deleteTask} />
        ))}
      </div>
    );
  };
  
  export default Column;
  