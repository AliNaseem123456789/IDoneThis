import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavbarLoggedIn() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 flex items-center px-6 py-3">
      {/* Left side: Logo + main nav */}
      <div className="flex items-center gap-6 text-gray-900 font-medium">
        <h1
          className="font-semibold text-lg cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          iDoneThis
        </h1>

        <button onClick={() => navigate("/mydones")} className="hover:text-red-500">
          My Dones
        </button>
        <button onClick={() => navigate("/calendar")} className="hover:text-red-500">
          Calendar
        </button>
          <button onClick={() => navigate("/reminders")} className="hover:text-red-500">
          Reminders
        </button>
        <button onClick={() => navigate("/reports")} className="hover:text-red-500">
          Reports
        </button>
      </div>

      {/* Right side: notifications, profile, logout */}
      <div className="ml-auto flex items-center gap-6 text-gray-900 font-medium">
        <NotificationsIcon className="cursor-pointer" />
        <AccountCircleIcon
          className="cursor-pointer text-3xl"
          onClick={() => navigate("/profile")}
        />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
