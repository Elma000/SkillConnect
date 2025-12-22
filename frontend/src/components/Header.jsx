import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import { logout, isLoggedIn } from "../services/auth";
import NotificationIcon from "./NotificationIcon";

export default function Header() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) return;
    api
      .get("/user/profile")
      .then((data) => {
        setName(data?.fullName || "");
        setPicture(data?.profilePicture || null);
      })
      .catch((err) => {
        if (err.status === 401) {
          logout();
          navigate("/login");
        }
      });
  }, [navigate]);

  const initials = name
    ? name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
    : "U";

  return (
    <header className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          MERN
        </Link>
        <nav className="flex gap-3">
          <Link to="/" className="text-sm text-slate-600 hover:underline">
            Home
          </Link>
          {isLoggedIn() && (
            <Link
              to="/notepad"
              className="text-sm text-slate-600 hover:underline"
            >
              Notes
            </Link>
          )}
          {isLoggedIn() && (
            <Link to="/task" className="text-sm text-slate-600 hover:underline">
              Tasks
            </Link>
          )}
          {isLoggedIn() && (
            <Link
              to="/skillsearch"
              className="text-sm text-slate-600 hover:underline"
            >
              Skills
            </Link>
          )}
          {isLoggedIn() && (
            <Link
              to="/profile"
              className="text-sm text-slate-600 hover:underline"
            >
              Profile
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn() ? (
          <div className="flex items-center gap-3">
            <NotificationIcon />
            {picture ? (
              <img
                src={picture}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">
                {initials}
              </div>
            )}
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="text-sm text-slate-600 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm text-slate-600 hover:underline">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}