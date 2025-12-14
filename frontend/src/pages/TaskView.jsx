import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function TaskView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!id) return navigate("/task");
    api
      .get(`/task/${id}`)
      .then((data) => setTask(data))
      .catch((err) => {
        alert(err.message || "Failed to load task");
        navigate("/task");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function toggleGoal(index) {
    const newGoals = (task.goals || []).map((g, i) => (i === index ? { ...g, done: !g.done } : g));
    api
      .put(`/task/update/${id}`, { goals: newGoals })
      .then((updated) => setTask(updated))
      .catch((err) => alert(err.message || "Update failed"));
  }

  function onDelete() {
    if (!confirm("Delete this task?")) return;
    api
      .del(`/task/delete/${id}`)
      .then(() => navigate("/task"))
      .catch((err) => alert(err.message || "Delete failed"));
  }

  if (loading) return <PageLoader variant="card" />;

  const percent = task.percentCompleted || 0;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/task/${id}/edit`)} className="px-3 py-1 bg-slate-100 rounded">Edit</button>
          <button onClick={onDelete} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
        </div>
      </div>

      <div className="mt-4 text-slate-700">{task.content}</div>

      <div className="mt-6">
        <div className="text-sm text-slate-600 mb-2">Progress: {percent}%</div>
        <div className="h-2 bg-slate-200 rounded overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium mb-2">Goals</div>
        <div className="space-y-2">
          {(task.goals || []).map((g, i) => (
            <label key={i} className="flex items-center gap-3">
              <input type="checkbox" checked={!!g.done} onChange={() => toggleGoal(i)} />
              <span className={g.done ? "line-through text-slate-500" : ""}>{g.title}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
