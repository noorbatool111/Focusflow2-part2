'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push("/login");
    } else {
      fetchTasks();
    }
  }, [router]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ text: newTask }),
    });

    const data = await res.json();
    setTasks([data, ...tasks]);
    setNewTask("");
  };

  const deleteTask = async (id) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-200 text-gray-900">

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white z-10 shadow-md border-b-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h2 className="text-2xl font-bold text-pink-500">✅ Task Manager</h2>
          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-24 px-6">
        <h3 className="text-3xl font-bold mb-6">Your Tasks</h3>

        {/* Add Task */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter your task..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-500 bg-white text-black font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={addTask}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg transition"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task, idx) => (
            <div
              key={task._id}
              className="bg-white px-6 py-4 rounded-lg shadow flex justify-between items-center animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: "forwards" }}
            >
              <span>{task.text}</span>
              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}