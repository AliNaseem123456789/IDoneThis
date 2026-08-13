import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DevicesIcon from "@mui/icons-material/Devices";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LaptopIcon from "@mui/icons-material/Laptop";
import TabletIcon from "@mui/icons-material/Tablet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatDistanceToNow } from "date-fns";

export default function Sessions() {
  const { sessions, revokeSession, refreshSessions } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshSessions();
  }, []);

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <DevicesIcon />;
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile")) return <SmartphoneIcon />;
    if (ua.includes("tablet")) return <TabletIcon />;
    return <LaptopIcon />;
  };

  const getDeviceName = (userAgent) => {
    if (!userAgent) return "Unknown Device";
    const ua = userAgent.toLowerCase();
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("mac")) return "Mac";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("android")) return "Android";
    if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
      return "iOS";
    return "Unknown";
  };

  const handleRevoke = async (sessionId) => {
    if (
      window.confirm(
        "Are you sure you want to revoke this session? The user will be logged out from this device."
      )
    ) {
      setLoading(true);
      await revokeSession(sessionId);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        <DevicesIcon className="mr-2" />
        Active Sessions
      </h1>

      <p className="text-gray-600 mb-8">
        These are all the devices currently logged into your account.
      </p>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between transition-all ${
              session.is_current ? "border-blue-500 border-2" : ""
            } ${!session.is_active ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-gray-500">
                {getDeviceIcon(session.user_agent)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {session.device_name || "Unknown Device"}
                  </span>
                  {session.is_current && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Current
                    </span>
                  )}
                  {!session.is_active && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      Revoked
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {session.ip_address && `${session.ip_address} · `}
                  {session.city && session.country
                    ? `${session.city}, ${session.country}`
                    : "Unknown Location"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {session.is_active
                    ? `Last active ${formatDistanceToNow(
                        new Date(session.last_accessed_at),
                        { addSuffix: true }
                      )}`
                    : `Revoked ${formatDistanceToNow(
                        new Date(session.revoked_at),
                        { addSuffix: true }
                      )}`}
                </div>
              </div>
            </div>

            {!session.is_current && session.is_active && (
              <button
                onClick={() => handleRevoke(session.id)}
                disabled={loading}
                className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Revoke
              </button>
            )}

            {session.is_current && (
              <span className="ml-4 text-blue-600 text-sm font-medium">
                <CheckCircleIcon className="text-sm" /> Active
              </span>
            )}

            {!session.is_active && (
              <span className="ml-4 text-gray-400 text-sm font-medium">
                <CancelIcon className="text-sm" /> Revoked
              </span>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <DevicesIcon className="text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500">No active sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
}