import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function TaskList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  function fetchTasks() {
    setLoading(true);
    api
      .get("/task/entries")
      .then((data) => setTasks(data || []))
      .catch((err) => alert(err.message || "Failed to load tasks"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function onDelete(id) {
    if (!confirm("Delete this task?")) return;
    api
      .del(`/task/delete/${id}`)
      .then(() => fetchTasks())
      .catch((err) => alert(err.message || "Delete failed"));
  }

  if (loading) return <PageLoader variant="list" rows={4} />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div>
          <Link to="/task/new" className="px-4 py-2 bg-emerald-600 text-white rounded-md">New Task</Link>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-slate-600">No tasks yet</div>
        ) : (
          tasks.map((t) => (
            <div key={t._id} className="p-4 bg-white rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <Link to={`/task/${t._id}`} className="text-lg font-medium text-indigo-600 hover:underline">{t.title}</Link>
                  <div className="text-sm text-slate-500 mt-1">{t.content?.slice(0, 150)}</div>
                </div>
                <div className="w-40">
                  <div className="text-xs text-slate-500 mb-1">Completed</div>
                  <div className="h-2 bg-slate-200 rounded overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${t.percentCompleted}%` }} />
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{t.percentCompleted}%</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => navigate(`/task/${t._id}/edit`)} className="px-3 py-1 bg-slate-100 rounded">Edit</button>
                <button onClick={() => onDelete(t._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
