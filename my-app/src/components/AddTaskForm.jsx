import React, { useState } from "react";
import { Paper, IconButton, InputBase, Divider } from "@mui/material";

// Icons matching the reference image style
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const AddTaskForm = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      className="flex items-center p-1 mb-4 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
    >
      {/* 1. Drag Handle (Placeholder) */}
      <DragIndicatorIcon className="text-gray-400 cursor-grab mx-2" />

      {/* 2. Status Indicator (Placeholder for alignment) */}
      <div className="p-2">
        <CheckCircleOutlineIcon className="text-gray-300" fontSize="small" />
      </div>

      {/* 3. Input Field */}
      <InputBase
        autoFocus
        placeholder="What did you get done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow px-2"
        sx={{ fontSize: "14px" }}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      {/* 4. Action Buttons (X and Check) */}
      <div className="flex gap-1 pr-1">
        <IconButton
          size="small"
          onClick={onCancel} // Ensure you add logic to hide the form in parent
          className="text-gray-400 hover:text-gray-600"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <IconButton
          type="submit"
          size="small"
          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full"
        >
          <CheckIcon fontSize="small" />
        </IconButton>
      </div>
    </Paper>
  );
};

export default AddTaskForm;
