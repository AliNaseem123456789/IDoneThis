import React from "react";
import { Paper, IconButton, Typography, Box, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const TaskList = ({ tasks, onStatusChange, onDelete }) => {
  if (!tasks.length)
    return (
      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
      >
        No tasks logged yet.
      </Typography>
    );

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {tasks.map((task) => (
        <Paper
          key={task.id}
          elevation={0}
          className="flex items-center p-2 border border-gray-200 rounded-md hover:border-gray-300 transition-all"
        >
          {/* 1. Drag Handle */}
          <DragIndicatorIcon className="text-gray-300 cursor-grab mx-2" />

          {/* 2. Status Toggles */}
          <div className="flex gap-1 mr-4">
            <Tooltip title="Done">
              <IconButton
                size="small"
                onClick={() => onStatusChange(task.id, "Done")}
              >
                <CheckCircleIcon
                  fontSize="small"
                  className={
                    task.status === "Done" ? "text-green-600" : "text-gray-200"
                  }
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Doing">
              <IconButton
                size="small"
                onClick={() => onStatusChange(task.id, "Doing")}
              >
                <PauseCircleIcon
                  fontSize="small"
                  className={
                    task.status === "Doing"
                      ? "text-yellow-500"
                      : "text-gray-200"
                  }
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delayed">
              <IconButton
                size="small"
                onClick={() => onStatusChange(task.id, "Delayed")}
              >
                <CancelIcon
                  fontSize="small"
                  className={
                    task.status === "Delayed" ? "text-red-500" : "text-gray-200"
                  }
                />
              </IconButton>
            </Tooltip>
          </div>

          {/* 3. Task Title & Meta */}
          <div className="flex-grow">
            <Typography
              variant="body1"
              sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}
            >
              {task.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {formatDateTime(task.created_at)}
            </Typography>
          </div>

          {/* 4. Delete Action */}
          <IconButton
            size="small"
            onClick={() => onDelete(task.id)}
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Paper>
      ))}
    </Box>
  );
};

export default TaskList;
