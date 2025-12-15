// src/components/TaskList.jsx
import React from "react";
import {
  CheckCircle,
  PauseCircle,
  XCircle,
  Trash2,
} from "lucide-react";

const statusIcons = {
  Done: {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    label: "Done",
  },
  Doing: {
    icon: <PauseCircle className="w-5 h-5 text-yellow-500" />,
    label: "Doing",
  },
  Delayed: {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    label: "Delayed",
  },
};

const TaskList = ({ tasks, onStatusChange, onDelete }) => {
  if (!tasks.length)
    return <p className="text-gray-500 text-center mt-6">No tasks logged yet.</p>;

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center bg-white border rounded-lg shadow-sm p-3 hover:shadow-md transition"
        >
          {/* Left Section: status + title */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button onClick={() => onStatusChange(task.id, "Done")}>
                <CheckCircle
                  className={`w-5 h-5 ${
                    task.status === "Done"
                      ? "text-green-600"
                      : "text-gray-300 hover:text-green-600"
                  }`}
                />
              </button>
              <button onClick={() => onStatusChange(task.id, "Doing")}>
                <PauseCircle
                  className={`w-5 h-5 ${
                    task.status === "Doing"
                      ? "text-yellow-500"
                      : "text-gray-300 hover:text-yellow-500"
                  }`}
                />
              </button>
              <button onClick={() => onStatusChange(task.id, "Delayed")}>
                <XCircle
                  className={`w-5 h-5 ${
                    task.status === "Delayed"
                      ? "text-red-500"
                      : "text-gray-300 hover:text-red-500"
                  }`}
                />
              </button>
            </div>

            <div>
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-xs text-gray-500">
                {formatDateTime(task.created_at)}
              </p>
            </div>
          </div>

          {/* Right Section: delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
