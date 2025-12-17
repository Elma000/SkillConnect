import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function Notifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async (append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const skip = append ? notifications.length : 0;
      const url = `/notifications?limit=20&skip=${skip}${
        filter === "unread" ? "&unreadOnly=true" : ""
      }`;
      const data = await api.get(url);
      
      if (append) {
        setNotifications(prev => [...prev, ...(data || [])]);
        setHasMore(data && data.length === 20);
      } else {
        setNotifications(data || []);
        setHasMore(data && data.length === 20);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      alert(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      alert(err.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    try {
      await api.del(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
      alert(err.message || "Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Delete all notifications? This cannot be undone.")) return;
    try {
      await api.del("/notifications");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
      alert(err.message || "Failed to delete notifications");
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
      case "skill_match":
        return "🎯";
      case "task_reminder":
        return "⏰";
      default:
        return "🔔";
    }
  };

  const formatDate = (date) => {
    const notifDate = new Date(date);
    const now = new Date();
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    return notifDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: notifDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
  };

  if (loading) return <PageLoader variant="list" rows={5} />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-slate-600 mt-1">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Delete all
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === "all"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === "unread"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-slate-600">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "When you get notifications, they'll show up here"}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 hover:bg-slate-50 transition ${
                  !notif.read ? "bg-indigo-50" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                      {getNotificationIcon(notif.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-slate-400">
                            {formatDate(notif.createdAt)}
                          </span>
                          {notif.link && (
                            <button
                              onClick={() => {
                                if (!notif.read) handleMarkAsRead(notif._id);
                                navigate(notif.link);
                              }}
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              View
                            </button>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkAsRead(notif._id)}
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        title="Delete notification"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load more */}
        {hasMore && notifications.length > 0 && (
          <div className="p-4 border-t border-slate-200 text-center">
            <button
              onClick={() => fetchNotifications(true)}
              disabled={loadingMore}
              className="px-4 py-2 text-sm text-indigo-600 hover:underline disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}