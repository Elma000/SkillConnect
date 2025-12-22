import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../services/api";

export default function NotificationIcon() {
  const [count, setCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Check for incomplete items on mount (once per session)
    const checkIncomplete = async () => {
      try {
        await api.post("/notifications/check-incomplete");
        fetchUnreadCount(); // Refresh count after check
      } catch (err) {
        console.log("Notification check failed:", err);
      }
    };
    checkIncomplete();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown && notifications.length === 0) {
      fetchNotifications();
    }
  }, [showDropdown]);

  const fetchUnreadCount = async () => {
    try {
      const data = await api.get("/notifications/unread-count");
      setCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.get("/notifications?limit=5");
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "connection_request":
        return "👤";
      case "connection_accepted":
        return "✅";
      case "message":
        return "💬";
      case "profile_view":
        return "👁️";
      case "task_reminder":
        return "⏰";
      case "incomplete_task":
        return "📋";
      case "incomplete_course":
        return "📚";
      default:
        return "🔔";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {count > 0 && (
                <button
                  onClick={async () => {
                    try {
                      await api.put("/notifications/read-all");
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setCount(0);
                    } catch (err) {
                      console.error("Failed to mark all as read:", err);
                    }
                  }}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-slate-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <div className="text-4xl mb-2">🔔</div>
                  <div>No notifications yet</div>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${
                      !notif.read ? "bg-indigo-50" : ""
                    }`}
                    onClick={() => {
                      if (!notif.read) handleMarkAsRead(notif._id);
                      if (notif.link) {
                        setShowDropdown(false);
                        window.location.href = notif.link;
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-sm">{notif.title}</div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {notif.message}
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          {formatTime(notif.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-200 text-center">
              <Link
                to="/notifications"
                onClick={() => setShowDropdown(false)}
                className="text-sm text-indigo-600 hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}