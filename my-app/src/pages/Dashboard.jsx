import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if not logged in
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome Back 👋
        </h1>
        <p className="text-gray-600">
          Here’s your dashboard overview. Use the navigation above to explore
          your profile, calendar, reports, and more.
        </p>

        {/* Add widgets or summary here later */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-lg mb-2">My Dones</h2>
            <p className="text-gray-500 text-sm">
              Track all your completed tasks in one place.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-lg mb-2">Calendar</h2>
            <p className="text-gray-500 text-sm">
              Plan your tasks and visualize your progress.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-lg mb-2">Reports</h2>
            <p className="text-gray-500 text-sm">
              View performance analytics and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
