import { useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = (e) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTasks([...tasks, { id: crypto.randomUUID(), title, done: false }]);
    setText("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const visible = tasks.filter((t) =>
    filter === "active" ? !t.done : filter === "completed" ? t.done : true
  );
  const completed = tasks.filter((t) => t.done).length;

  return (
    <div>
      <h1>Class Requirements To-Do List</h1>

      <form className="card row" onSubmit={addTask}>
        <input
          style={{ flex: 1 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
        />
        <button type="submit">Add</button>
      </form>

      <div className="card">
        <div className="row filters">
          {["all", "active", "completed"].map((f) => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <p>No tasks yet!</p>
        ) : (
          <>
            <p>{completed} of {tasks.length} completed</p>
            <ul>
              {visible.map((task) => (
                <li key={task.id}>
                  <span className={task.done ? "done" : ""} onClick={() => toggleTask(task.id)}>
                    {task.title}
                  </span>
                  <button className="del" onClick={() => deleteTask(task.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}