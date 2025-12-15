import React, { useEffect, useState, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SummaryChart from "./SummaryChart";
import DayModal from "./DayModal";
import { apiRequest } from "../utils/api";

const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const fetchMonthTasks = useCallback(
    async (date = currentDate) => {
      try {
        setLoading(true);
        const month = monthKey(date);
        const data = await apiRequest(`/tasks?month=${month}`, "GET", null, localStorage.getItem("token"));
        setMonthTasks(data || []);
      } catch (err) {
        console.error("Error fetching month tasks:", err);
        setMonthTasks([]);
      } finally {
        setLoading(false);
      }
    },
    [currentDate]
  );

  useEffect(() => {
    fetchMonthTasks();
  }, [fetchMonthTasks, currentDate]);

  const grouped = monthTasks.reduce((acc, t) => {
    const key = t.date_logged;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const handlePrev = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const handleNext = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const onClickDay = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = date.toISOString().split("T")[0];
    const tasks = grouped[key];
    if (!tasks || tasks.length === 0) return null;

    return (
      <div className="flex justify-center gap-1 mt-1">
        {tasks.some((t) => t.status === "Done") && <span className="w-2 h-2 rounded-full bg-green-500" />}
        {tasks.some((t) => t.status === "Doing") && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
        {tasks.some((t) => t.status === "Delayed") && <span className="w-2 h-2 rounded-full bg-red-500" />}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        {/* CALENDAR */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-center flex-1">
              {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <Calendar
            onClickDay={onClickDay}
            value={currentDate}
            tileContent={tileContent}
            className="custom-calendar w-full text-center md:text-base"
            onActiveStartDateChange={({ activeStartDate }) => setCurrentDate(activeStartDate)}
          />
        </div>

        {/* SUMMARY */}
        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
          <h3 className="font-semibold mb-4 text-center lg:text-left">Summary</h3>
          <SummaryChart tasks={monthTasks} />

          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Total tasks</span>
              <span>{monthTasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Active days</span>
              <span>{Object.keys(grouped).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Average / day</span>
              <span>{(monthTasks.length / Math.max(1, Object.keys(grouped).length)).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <DayModal
        isOpen={modalOpen}
        date={selectedDate}
        onClose={() => {
          setModalOpen(false);
          setSelectedDate(null);
          fetchMonthTasks(currentDate);
        }}
      />
    </div>
  );
};

export default CalendarDashboard;
