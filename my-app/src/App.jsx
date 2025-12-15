import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Calender from "./pages/Calender";
import MyDones from "./pages/MyDones";
import Reminders from "./pages/Remainders";
import HowItWorks from "./pages/HowItWorks";
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Reminders" element={<Reminders />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mydones" element={<MyDones />} />
        <Route path="/calendar" element={<Calender />} />
        <Route path="/How It works" element={<HowItWorks/>} />
      </Routes>
    </Router>
  );
}
