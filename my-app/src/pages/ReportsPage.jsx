import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Download,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Info,
  Loader,
} from "lucide-react";
import { Paper, Button, Alert, CircularProgress } from "@mui/material";
import { apiRequest } from "../utils/api";

const ReportsPage = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Reflections");
  const [aiSummary, setAiSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const getUserId = useCallback(() => {
    if (userId) return userId;
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData.user_id;
      }
      const storedUserId = localStorage.getItem("user_id");
      if (storedUserId) return storedUserId;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.sub || payload.user_id || payload.id;
        } catch (e) {
          console.log("Token is not JWT format");
        }
      }
    } catch (err) {
      console.error("Error getting user ID:", err);
    }

    return null;
  }, [userId]);
  const callAISummaryDirectly = async (userId, startDate, endDate) => {
    if (!userId) {
      throw new Error("User ID is required. Please log in again.");
    }

    const API_BASE_URL = "https://idonethis-1.onrender.com";
    const url = `${API_BASE_URL}/api/ai-summary`;

    const body = {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    };

    console.log("Calling AI summary with:", { url, body });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Direct API call failed:", error);
      throw error;
    }
  };
  const fetchTasks = useCallback(async () => {
    const currentUserId = getUserId();
    if (!currentUserId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let url = `/tasks?user_id=${currentUserId}`;
      if (dateRange.startDate) {
        url += `&start_date=${dateRange.startDate}`;
      }
      if (dateRange.endDate) {
        url += `&end_date=${dateRange.endDate}`;
      }
      const data = await apiRequest(
        url,
        "GET",
        null,
        localStorage.getItem("token"),
      );
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getUserId, dateRange]);

  // Fetch AI-powered summary using direct port 8000 call
  const fetchAISummary = useCallback(async () => {
    const currentUserId = getUserId();

    if (!currentUserId) {
      console.error("No user ID available for AI summary");
      setError(
        "Cannot generate AI summary: User not identified. Please log in again.",
      );
      return;
    }

    if (!tasks.length) {
      console.log("No tasks to analyze");
      return;
    }

    try {
      setSummaryLoading(true);
      setError(null);
      console.log("Fetching AI summary for user:", currentUserId);
      console.log("Date range:", dateRange);
      const response = await callAISummaryDirectly(
        currentUserId,
        dateRange.startDate,
        dateRange.endDate,
      );

      console.log("AI Summary response:", response);
      setAiSummary(response);
    } catch (err) {
      console.error("Failed to fetch AI summary:", err);
      setError(
        `AI summary generation failed: ${err.message}. Make sure backend is running on port 8000`,
      );

      // Set fallback data when AI fails
      const dones = tasks.filter((t) => t.status === "Done");
      const doing = tasks.filter((t) => t.status === "Doing");
      const delayed = tasks.filter((t) => t.status === "Delayed");

      setAiSummary({
        summary: `Task Summary: You have completed ${dones.length} tasks, with ${doing.length} in progress and ${delayed.length} delayed. ${
          delayed.length > 0
            ? "Consider prioritizing your delayed tasks."
            : "Great job staying on top of your tasks!"
        }`,
        insights: {
          dones: dones.map((t) => t.title),
          doing: doing.map((t) => t.title),
          delayed: delayed.map((t) => t.title),
        },
        recommendations: [
          {
            title: "Backend Connection Issue",
            text: `Unable to connect to AI service on port 8000. Please ensure the backend server is running with: python main.py`,
          },
          {
            title: "Quick Tip",
            text:
              delayed.length > 0
                ? `Focus on completing your ${delayed.length} delayed task(s) first.`
                : "Keep up the good work! Try to complete one more task today.",
          },
        ],
        stats: {
          total_tasks: tasks.length,
          completion_rate: tasks.length
            ? Math.round((dones.length / tasks.length) * 100)
            : 0,
          delayed_count: delayed.length,
        },
      });
    } finally {
      setSummaryLoading(false);
    }
  }, [getUserId, tasks, dateRange]);

  useEffect(() => {
    const currentUserId = getUserId();
    console.log("Current User ID from storage:", currentUserId);

    if (currentUserId) {
      fetchTasks();
    } else {
      setLoading(false);
      setError("User not authenticated. Please log in to view reports.");
    }
  }, [getUserId, fetchTasks]);

  useEffect(() => {
    if (tasks.length > 0 && getUserId()) {
      fetchAISummary();
    }
  }, [tasks, getUserId, fetchAISummary]);

  // Manual refresh
  const handleRefresh = () => {
    fetchTasks();
  };

  // Export report
  const handleExport = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      user_id: getUserId(),
      tasks: tasks,
      ai_summary: aiSummary,
      stats: aiSummary?.stats || {},
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:8000/");
      const data = await response.json();
      console.log("Backend test response:", data);

      const currentUserId = getUserId();
      alert(
        `Backend is running! Status: ${data.status || "OK"}\nUser ID: ${currentUserId || "Not found"}`,
      );
    } catch (error) {
      console.error("Backend connection test failed:", error);
      alert(
        "Cannot connect to backend on port 8000. Please start the backend server.",
      );
    }
  };

  if (loading) {
    return (
      <div className="pt-24 p-6 flex justify-center items-center min-h-screen">
        <CircularProgress />
        <span className="ml-3">Loading your report...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header & Controls */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Reports & Insights</h1>
          <p className="text-gray-600">
            AI-powered analysis of your productivity
          </p>
          {getUserId() && (
            <p className="text-xs text-gray-400 mt-1">
              User ID: {getUserId().substring(0, 8)}...
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {/* <Button
            variant="outlined"
            startIcon={<Settings size={18} />}
            onClick={testBackendConnection}
          >
            Test Backend
          </Button> */}
          <Button
            variant="outlined"
            startIcon={<Calendar size={18} />}
            onClick={() => {
              /* Add date picker logic */
            }}
          >
            Filter by Date
          </Button>
          <Button
            variant="contained"
            startIcon={<Download size={18} />}
            onClick={handleExport}
            sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" } }}
          >
            Export Report
          </Button>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>
      <div className="mb-8 border-b border-gray-200">
        <div className="flex gap-8">
          {["Accomplishments", "Reflections", "Trends"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-red-500 text-red-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <Alert
          severity="warning"
          className="mb-6"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Paper elevation={0} className="p-8 border border-gray-200 rounded-xl">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Info size={20} className="text-purple-600" />
              AI-Powered Summary
              <span className="text-xs font-normal text-gray-500 ml-2">
                (Port 8000)
              </span>
            </h2>
            {summaryLoading && <Loader size={20} className="animate-spin" />}
          </div>

          {aiSummary ? (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {aiSummary.summary}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-purple-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {aiSummary.stats?.completion_rate || 0}%
                  </div>
                  <div className="text-xs text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {aiSummary.stats?.total_tasks || 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {aiSummary.stats?.delayed_count || 0}
                  </div>
                  <div className="text-xs text-gray-600">Delayed</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader
                size={32}
                className="animate-spin mx-auto mb-3 text-purple-600"
              />
              <p className="text-gray-500">
                {tasks.length === 0
                  ? "No tasks to analyze. Start adding tasks to get AI insights!"
                  : "Connecting to AI service on port 8000..."}
              </p>
              <button
                onClick={fetchAISummary}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 underline"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Task Breakdown</h3>
            <InsightCard
              title="Done"
              items={
                aiSummary?.insights?.dones ||
                tasks.filter((t) => t.status === "Done").map((t) => t.title)
              }
              color="green"
            />
            <InsightCard
              title="Doing"
              items={
                aiSummary?.insights?.doing ||
                tasks.filter((t) => t.status === "Doing").map((t) => t.title)
              }
              color="orange"
            />
            <InsightCard
              title="Delayed"
              items={
                aiSummary?.insights?.delayed ||
                tasks.filter((t) => t.status === "Delayed").map((t) => t.title)
              }
              color="red"
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ThumbsUp size={18} />
              Recommendations
            </h3>
            <div className="space-y-4 text-sm">
              {aiSummary?.recommendations?.length > 0 ? (
                aiSummary.recommendations.map((rec, i) => (
                  <RecItem key={i} title={rec.title} text={rec.text} />
                ))
              ) : (
                <div className="space-y-2">
                  <RecItem
                    title="Keep Going!"
                    text="You're on track. Continue maintaining your current productivity level."
                  />
                  {tasks.length === 0 && (
                    <RecItem
                      title="Getting Started"
                      text="Create your first task to begin tracking and getting personalized insights."
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

const InsightCard = ({ title, items, color }) => {
  const colorMap = {
    green: "bg-green-50 border-green-100 text-green-900",
    orange: "bg-orange-50 border-orange-100 text-orange-900",
    red: "bg-red-50 border-red-100 text-red-900",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <h4 className="font-semibold mb-2">
        {title} ({items.length})
      </h4>
      {items.length > 0 ? (
        <ul className="list-disc pl-5 text-sm space-y-1 max-h-48 overflow-y-auto">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs opacity-70">No tasks in this category.</p>
      )}
    </div>
  );
};

const RecItem = ({ title, text }) => (
  <div className="p-3 bg-white rounded-lg">
    <span className="font-bold text-blue-900 block mb-1">{title}</span>
    <p className="text-blue-800 text-sm">{text}</p>
  </div>
);

export default ReportsPage;
