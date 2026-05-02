import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Paper, IconButton, Typography } from "@mui/material";

const CustomCalendar = ({
  currentDate,
  tasks,
  onDateClick,
  onPrev,
  onNext,
}) => {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...paddingDays, ...monthDays];
  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-500";
      case "Doing":
        return "bg-orange-400";
      case "Delayed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusDots = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayTasks = tasks.filter((t) => t.date_logged === dateStr);

    if (dayTasks.length === 0) return null;

    return (
      <div className="flex flex-wrap justify-center gap-1 mt-2 px-1">
        {dayTasks
          .sort((a, b) => a.status.localeCompare(b.status))
          .map((task, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
              title={`${task.status}: ${task.title}`}
            />
          ))}
      </div>
    );
  };

  return (
    <Paper
      elevation={0}
      className="border border-gray-200 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <IconButton onClick={onPrev}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Typography>
        <IconButton onClick={onNext}>
          <ChevronRight />
        </IconButton>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-400 uppercase py-2"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-t border-l border-gray-100">
        {allDays.map((day, index) => (
          <div
            key={index}
            onClick={() =>
              day &&
              onDateClick(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                ),
              )
            }
            className={`
              min-h-[100px] border-r border-b border-gray-100 p-2 cursor-pointer transition-colors
              ${day ? "hover:bg-gray-50" : "bg-gray-50"}
            `}
          >
            {day && (
              <>
                <div className="text-sm font-medium text-gray-700">{day}</div>
                {getStatusDots(day)}
              </>
            )}
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default CustomCalendar;
