// src/pages/MyDones.jsx
import React, { useEffect, useState } from "react";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import { apiRequest } from "../utils/api";
import {
  CalendarDays,
  Download,
  PlusCircle,
  User,
  Users,
  CheckCircle,
  PauseCircle,
  XCircle,
} from "lucide-react";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

const MyDones = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [token] = useState(localStorage.getItem("token"));
  const [logType, setLogType] = useState("Personal Log");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // ===== Fetch tasks =====
  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const data = await apiRequest(`/tasks?date=${date}`, "GET", null, token);
        setTasks(data);
      } catch (err) {
        console.error("Fetch tasks failed:", err.message);
      }
    };
    fetchTasks();
  }, [date, token]);

  // ===== Add new task =====
  const handleAdd = async (title) => {
    try {
      const newTask = await apiRequest(
        "/tasks",
        "POST",
        { title, status: "Doing" },
        token
      );
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      alert("Failed to add task: " + err.message);
    }
  };

  // ===== Update task status =====
  const handleStatusChange = async (id, status) => {
    try {
      const updated = await apiRequest(`/tasks/${id}`, "PUT", { status }, token);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t))
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // ===== Delete task =====
  const handleDelete = async (id) => {
    try {
      await apiRequest(`/tasks/${id}`, "DELETE", null, token);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete task: " + err.message);
    }
  };

  // ===== Export tasks as JSON =====
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mydones_${date}.json`;
    link.click();
  };

  // ===== Apply filters =====
  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  // ======= UI =======
  return (
    <>
      <NavbarLoggedIn />
      <div className="p-6 max-w-5xl mx-auto transform translate-y-16">
        {/* ======= Header + Toolbar ======= */}
        <div className="flex flex-wrap justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Left: Date Heading */}
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-base font-medium text-gray-800">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Log Type */}
            <div className="relative flex items-center border rounded-md px-2 py-1.5 bg-gray-50 text-sm hover:bg-gray-100">
              {logType === "Personal Log" ? (
                <User className="w-4 h-4 mr-1 text-gray-600" />
              ) : (
                <Users className="w-4 h-4 mr-1 text-gray-600" />
              )}
              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                className="bg-transparent appearance-none outline-none cursor-pointer"
              >
                <option>Personal Log</option>
                <option>Team Log</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative flex items-center border rounded-md px-2 py-1.5 bg-gray-50 text-sm hover:bg-gray-100">
              {statusFilter === "Done" ? (
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              ) : statusFilter === "Doing" ? (
                <PauseCircle className="w-4 h-4 mr-1 text-yellow-500" />
              ) : statusFilter === "Delayed" ? (
                <XCircle className="w-4 h-4 mr-1 text-red-600" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1 text-gray-400" />
              )}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent appearance-none outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Done">Dones</option>
                <option value="Doing">Doing</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>

            {/* Date Selector */}
            <div className="flex items-center border rounded-md px-2 py-1.5 bg-gray-50 text-sm hover:bg-gray-100">
              <CalendarDays className="w-4 h-4 mr-1 text-gray-600" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              />
            </div>

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>

            {/* Add Task */}
            <button
              onClick={() => setShowAddForm((prev) => !prev)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* ======= Add Task ======= */}
        {showAddForm && <AddTaskForm onAdd={handleAdd} />}

        {/* ======= Task List ======= */}
        <TaskList
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default MyDones;
