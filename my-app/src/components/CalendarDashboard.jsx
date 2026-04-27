import React, { useEffect, useState, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Paper, Typography, Box, Divider } from "@mui/material";

import SummaryChart from "./SummaryChart";
import DayModal from "./DayModal";
import { apiRequest } from "../utils/api";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import CustomCalendar from "./CustomCalender";

const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const monthKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const fetchMonthTasks = useCallback(
    async (date = currentDate) => {
      try {
        const month = monthKey(date);
        const data = await apiRequest(
          `/tasks?month=${month}`,
          "GET",
          null,
          localStorage.getItem("token"),
        );
        console.log("API Response Data:", data);
        setMonthTasks(data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    },
    [currentDate],
  );

  useEffect(() => {
    fetchMonthTasks();
  }, [fetchMonthTasks]);

  const grouped = monthTasks.reduce((acc, t) => {
    const key = t.date_logged;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = date.toISOString().split("T")[0];
    const tasks = grouped[key];
    if (!tasks || tasks.length === 0) return null;

    return (
      <div className="flex justify-center gap-0.5 mt-1">
        {tasks.some((t) => t.status === "Done") && (
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        )}
        {tasks.some((t) => t.status === "Doing") && (
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        )}
        {tasks.some((t) => t.status === "Delayed") && (
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
      </div>
    );
  };

  return (
    <>
      <NavbarLoggedIn />
      <div className="pt-24 p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Section */}
          <Paper
            elevation={0}
            className="flex-1 p-6 border border-gray-200 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
              >
                <ChevronLeft />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
              >
                <ChevronRight />
              </button>
            </div>

            <CustomCalendar
              currentDate={currentDate}
              tasks={monthTasks}
              onDateClick={(date) => {
                setSelectedDate(date);
                setModalOpen(true);
              }}
              onPrev={() =>
                setCurrentDate(
                  new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                )
              }
              onNext={() =>
                setCurrentDate(
                  new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
                )
              }
            />
          </Paper>

          {/* Stats Section */}
          <div className="lg:w-80 flex flex-col gap-6">
            <Paper
              elevation={0}
              className="p-6 border border-gray-200 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-red-500 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">Monthly Summary</h3>
              </div>
              <SummaryChart tasks={monthTasks} />

              <Divider sx={{ my: 3 }} />

              <div className="space-y-4 text-sm text-gray-600">
                <StatRow label="Total Tasks" value={monthTasks.length} />
                <StatRow
                  label="Active Days"
                  value={Object.keys(grouped).length}
                />
                <StatRow
                  label="Avg / Day"
                  value={(
                    monthTasks.length / Math.max(1, Object.keys(grouped).length)
                  ).toFixed(1)}
                />
              </div>
            </Paper>
          </div>
        </div>

        <DayModal
          isOpen={modalOpen}
          date={selectedDate}
          onClose={() => {
            setModalOpen(false);
            setSelectedDate(null);
            fetchMonthTasks();
          }}
        />
      </div>
    </>
  );
};

// Helper component for clean list rows
const StatRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default CalendarDashboard;
