import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../api/api";
import axios from "axios";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        role: "user",
      });
      alert(`Signup successful! Welcome ${res.data.user.email}`);
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleGoogleSignup = () => {
    alert("Google sign-up can be implemented here");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 bg-green-700 text-white p-10 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold mb-6">Join Us!</h1>
          <p className="mb-6">
            Sign up and start tracking your tasks, measuring progress, and
            celebrating success!
          </p>
          <img
            src="https://source.unsplash.com/300x200/?productivity,success"
            alt="illustration"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-6">Sign Up</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          <button
            onClick={handleSignup}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 mb-4 transition"
          >
            Sign Up
          </button>
          <div className="flex items-center justify-center mb-4">
            <hr className="w-1/3 border-gray-300" />
            <span className="mx-2 text-gray-500">OR</span>
            <hr className="w-1/3 border-gray-300" />
          </div>
          {/* <button
            onClick={handleGoogleSignup}
            className="w-full border border-gray-300 flex items-center justify-center py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <GoogleIcon className="mr-2" /> Sign up with Google
          </button> */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?
            <a href="/login" className="text-green-600 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
