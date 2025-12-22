import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import { setAuth, isLoggedIn } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  React.useEffect(()=>{ if(isLoggedIn()) navigate('/profile') },[navigate]);

  function onSubmit(e) {
    e.preventDefault();
    api
      .post("/login", { email, password })
      .then(async (data) => {
        if (data && data.token) {
          setAuth({ token: data.token, userId: data.userId });
          // Check for incomplete items and create notifications
          try {
            await api.post("/notifications/check-incomplete");
          } catch (err) {
            // Silently fail - notifications will be checked later
            console.log("Notification check failed:", err);
          }
          window.location.href = "/profile";
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => alert(err.message || "Login failed"));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-6xl">
        {/* Left illustration */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-96 h-96 bg-linear-to-tr from-indigo-400 to-rose-300 rounded-3xl shadow-xl flex items-center justify-center">
            <div className="text-white text-center p-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-slate-100">
                Sign in to access your dashboard and manage your projects.
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="auth-card">
          <div className="mb-6 text-center">
            <a href="/">Home</a>
            <h1 className="text-2xl font-semibold">Sign in</h1>

            <p className="mt-1 text-sm text-slate-600">
              Welcome back — please enter your details
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Your password"
              />
            </label>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" /> Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
