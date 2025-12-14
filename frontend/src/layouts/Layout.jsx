import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
