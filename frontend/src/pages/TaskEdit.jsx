import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", goals: [] });
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/task/${id}`)
      .then((data) => setForm({ title: data.title || "", content: data.content || "", goals: data.goals || [] }))
      .catch((err) => {
        alert(err.message || "Failed to load task");
        navigate("/task");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function change(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function addGoal() {
    const v = newGoal.trim();
    if (!v) return;
    setForm((s) => ({ ...s, goals: [...(s.goals || []), { title: v, done: false }] }));
    setNewGoal("");
  }

  function removeGoal(i) {
    setForm((s) => ({ ...s, goals: (s.goals || []).filter((_, idx) => idx !== i) }));
  }

  function toggleGoal(i) {
    setForm((s) => ({ ...s, goals: (s.goals || []).map((g, idx) => (idx === i ? { ...g, done: !g.done } : g)) }));
  }

  function onSave(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    setSaving(true);
    const op = id ? api.put(`/task/update/${id}`, form) : api.post(`/task/create`, form);
    op
      .then(() => navigate("/task"))
      .catch((err) => alert(err.message || "Save failed"))
      .finally(() => setSaving(false));
  }

  if (loading) return <PageLoader variant="card" />;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{id ? "Edit Task" : "New Task"}</h2>
      <form onSubmit={onSave} className="grid gap-4">
        <label>
          <div className="text-sm font-medium">Title</div>
          <input value={form.title} onChange={(e) => change("title", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <label>
          <div className="text-sm font-medium">Content</div>
          <textarea value={form.content} onChange={(e) => change("content", e.target.value)} rows={6} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <div>
          <div className="text-sm font-medium">Goals</div>
          <div className="mt-2 space-y-2">
            {(form.goals || []).map((g, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="checkbox" checked={!!g.done} onChange={() => toggleGoal(i)} />
                <input value={g.title} onChange={(e) => setForm((s) => ({ ...s, goals: s.goals.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)) }))} className="flex-1 rounded-md border px-3 py-1" />
                <button type="button" onClick={() => removeGoal(i)} className="px-2 py-1 bg-red-100 text-red-600 rounded">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add goal" className="rounded-md border px-3 py-1" />
            <button type="button" onClick={addGoal} className="px-3 py-1 bg-slate-200 rounded">Add</button>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-md">{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-100 rounded-md">Cancel</button>
        </div>
      </form>
    </div>
  );
}
