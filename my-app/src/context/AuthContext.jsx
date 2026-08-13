import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchSessions();
    }
    setLoading(false);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/auth/sessions");
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const { accessToken, user, sessionId } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("sessionId", sessionId);

      setUser(user);
      await fetchSessions();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
        role: "user",
      });

      const { accessToken, user, sessionId } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("sessionId", sessionId);

      setUser(user);
      await fetchSessions();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");
      setUser(null);
      setSessions([]);
      window.location.href = "/login";
    }
  };

  const logoutAllDevices = async () => {
    try {
      await api.post("/auth/logout-all");
      // Clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");
      setUser(null);
      setSessions([]);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout all devices error:", error);
      alert("Failed to logout from all devices. Please try again.");
    }
  };

  const revokeSession = async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      // Refresh sessions list
      await fetchSessions();
      return { success: true };
    } catch (error) {
      console.error("Failed to revoke session:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to revoke session",
      };
    }
  };

  const refreshSessions = fetchSessions;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessions,
        login,
        signup,
        logout,
        logoutAllDevices,
        revokeSession,
        refreshSessions,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};