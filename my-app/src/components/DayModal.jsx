import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const DayModal = ({ isOpen, date, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const dateKey = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : null;

  useEffect(() => {
    if (!isOpen || !dateKey) return;

    const fetchForDate = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(
          `/tasks?date=${dateKey}`,
          "GET",
          null,
          localStorage.getItem("token"),
        );
        setTasks(data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForDate();
  }, [isOpen, dateKey]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const updated = await apiRequest(
        `/tasks/${taskId}`,
        "PUT",
        { status: newStatus },
        localStorage.getItem("token"),
      );
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;

    try {
      await apiRequest(
        `/tasks/${taskId}`,
        "DELETE",
        null,
        localStorage.getItem("token"),
      );
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white max-w-3xl w-full rounded-xl shadow-lg p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tasks — {dateKey}</h3>
          <button className="px-3 py-1 rounded border" onClick={onClose}>
            Close
          </button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="text-gray-500">No tasks logged for this date.</div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="p-3 border rounded-lg flex justify-between items-start"
              >
                <div>
                  <div className="font-medium">{t.title}</div>
                  {t.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {t.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Created: {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option>Doing</option>
                    <option>Done</option>
                    <option>Delayed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DayModal;
