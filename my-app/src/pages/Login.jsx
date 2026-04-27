import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../api/api";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login can be implemented here");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Left side content */}
        <div className="md:w-1/2 bg-blue-900 text-white p-10 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="mb-6">
            Track your tasks, measure your progress, and get more done every
            day!
          </p>
          <img
            src="https://source.unsplash.com/300x200/?productivity"
            alt="illustration"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-6">Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password input with visibility toggle */}
          <div className="relative mb-2 w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-4">
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Forgot password?
            </a>
          </div>

          {/* Sign In button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4 transition"
          >
            Sign In
          </button>

          {/* OR divider */}
          <div className="flex items-center justify-center mb-4">
            <hr className="w-1/3 border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="w-1/3 border-gray-300" />
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 flex items-center justify-center py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <GoogleIcon className="mr-2" /> Sign in with Google
          </button>

          {/* Sign up link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account yet?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
