import { useNavigate, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavbarLoggedIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path ? "text-red-600 font-semibold" : "text-gray-600";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1
            className="text-xl font-bold text-gray-900 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Task Flow
          </h1>

          <div className="hidden md:flex items-center gap-6">
            {["MyDones", "Calendar", "Reminders", "Reports"].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className={`text-sm font-medium transition-colors hover:text-red-500 ${isActive(`/${item.toLowerCase()}`)}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <NotificationsIcon />
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
          >
            <AccountCircleIcon className="text-3xl" />
          </button>

          <button
            onClick={handleLogout}
            className="ml-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-black transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
