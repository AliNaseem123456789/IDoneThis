// src/pages/MyDones.jsx
import React, { useEffect, useState } from "react";
// Assumes AddTaskForm and TaskList are already updated to match the row-based UI
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import { apiRequest } from "../utils/api";
import NavbarLoggedIn from "../components/NavbarLoggedIn";

// UI Components
import {
  Button,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  FormControl,
} from "@mui/material";

// Icons (Matching the Reference Image)
import EventIcon from "@mui/icons-material/Event";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const MyDones = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDateObj, setCurrentDateObj] = useState(new Date()); // Manage date object
  const [token] = useState(localStorage.getItem("token"));
  const [logType, setLogType] = useState("Personal Log");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Derive date string for API and UI
  const dateStr = currentDateObj.toISOString().split("T")[0];

  // ===== Fetch tasks =====
  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const data = await apiRequest(
          `/tasks?date=${dateStr}`,
          "GET",
          null,
          token,
        );
        setTasks(data);
      } catch (err) {
        console.error("Fetch tasks failed:", err.message);
      }
    };
    fetchTasks();
  }, [dateStr, token]);

  // ===== Date Navigation Handlers =====
  const changeDateByAmount = (daysAmount) => {
    setCurrentDateObj((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + daysAmount);
      return next;
    });
  };

  // ===== Add new task =====
  const handleAdd = async (title) => {
    try {
      const newTask = await apiRequest(
        "/tasks",
        "POST",
        { title, status: "Done" },
        token,
      );
      setTasks((prev) => [newTask, ...prev]);
      setShowAddForm(false); // Hide form after adding
    } catch (err) {
      alert("Failed to add task: " + err.message);
    }
  };

  // ===== Update task status =====
  const handleStatusChange = async (id, status) => {
    try {
      const updated = await apiRequest(
        `/tasks/${id}`,
        "PUT",
        { status },
        token,
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)),
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
    link.download = `mydones_${dateStr}.json`;
    link.click();
  };

  // ===== Apply filters =====
  const filteredTasks =
    statusFilter === "All"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  // Helper: Get Icon for status dropdown
  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <ChecklistRtlIcon sx={{ color: "#2e7d32", fontSize: 20 }} />;
      case "Doing":
        return <HourglassEmptyIcon sx={{ color: "#ed6c02", fontSize: 20 }} />;
      case "Blocked":
        return <HelpOutlineIcon sx={{ color: "#d32f2f", fontSize: 20 }} />;
      default:
        return (
          <FormatListBulletedIcon sx={{ color: "#757575", fontSize: 20 }} />
        );
    }
  };

  // Helper: Select styling override
  const selectStyle = {
    ".MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e0e0e0",
      borderWidth: 1,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bdbdbd" },
    backgroundColor: "#fff",
    borderRadius: "6px",
    fontSize: "14px",
    height: "36px",
  };

  return (
    <>
      <div className="pt-24 p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
        <div className="flex flex-wrap justify-between items-center py-2 mb-8 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentDateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <EventIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 border border-gray-100 rounded-md p-0.5 bg-white">
              <FormatListBulletedIcon sx={{ color: "#757575", fontSize: 22 }} />
              <ChecklistRtlIcon sx={{ color: "#d32f2f", fontSize: 22 }} />{" "}
            </div>
            <FormControl size="small" variant="outlined">
              <Select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                sx={{ ...selectStyle, width: "130px" }}
                startAdornment={
                  <InputAdornment position="start">
                    {logType === "Personal Log" ? (
                      <PersonOutlineIcon fontSize="small" />
                    ) : (
                      <GroupsIcon fontSize="small" />
                    )}
                  </InputAdornment>
                }
              >
                <MenuItem value="Personal Log">Personal Log</MenuItem>
                <MenuItem value="Team Log">Team Log</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" variant="outlined">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ ...selectStyle, width: "110px" }}
                startAdornment={
                  <InputAdornment position="start">
                    {getStatusIcon(statusFilter)}
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All Items</MenuItem>
                <MenuItem value="Done">Dones</MenuItem>
                <MenuItem value="Doing">Doing</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
            <div className="flex gap-0.5 border border-gray-100 rounded-md bg-white">
              <IconButton
                size="small"
                onClick={() => changeDateByAmount(-1)}
                sx={{ color: "#757575", p: "6px" }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => changeDateByAmount(1)}
                sx={{ color: "#757575", p: "6px" }}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleExport}
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{
                borderRadius: "6px",
                height: "36px",
                textTransform: "none",
                px: 2,
                borderColor: "#e0e0e0",
                color: "#757575",
                "&:hover": {
                  borderColor: "#bdbdbd",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setShowAddForm((prev) => !prev)}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                borderRadius: "6px",
                height: "36px",
                textTransform: "none",
                px: 2,
                shadow: "none",
                "&:hover": { shadow: "none" },
              }}
            >
              {showAddForm ? "Cancel Add" : "Add New Task"}
            </Button>
          </div>
        </div>
        {showAddForm && (
          <AddTaskForm
            onAdd={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="mt-6">
          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};

export default MyDones;
