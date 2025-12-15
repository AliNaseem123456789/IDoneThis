// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

const AddTaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="What did you get done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700"
      >
        <PlusCircle className="w-4 h-4" /> Add
      </button>
    </form>
  );
};

export default AddTaskForm;
