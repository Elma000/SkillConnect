import React from "react";

export default function PageLoader({ variant = "profile", rows = 3, className = "" }) {
  // All visuals are controlled by CSS classes (Tailwind)
  if (variant === "profile") {
    return (
      <div role="status" className={`max-w-3xl mx-auto bg-white rounded-lg shadow p-6 animate-pulse ${className}`}>
        <span className="sr-only">Loading profile</span>
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-slate-200" />
          <div className="flex-1">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="mt-2 h-4 bg-slate-200 rounded w-1/2" />
            <div className="mt-4 h-3 bg-slate-200 rounded w-full" />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-20 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-white rounded-lg shadow p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
        <div className="h-48 bg-slate-200 rounded mb-4" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div role="status" aria-busy="true" className={`space-y-4 ${className}`}>
        <span className="sr-only">Loading list</span>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 bg-white p-4 rounded shadow animate-pulse">
            <div className="w-12 h-12 rounded-full bg-slate-200" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="mt-2 h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div role="status" className={`h-screen w-screen flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
        </div>
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  // fallback generic skeleton
  return (
    <div className={`p-6 bg-white rounded shadow animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-full" />
    </div>
  );
}

