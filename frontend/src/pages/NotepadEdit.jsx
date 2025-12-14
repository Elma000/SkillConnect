import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function NotepadEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/notepad/${id}`)
      .then((data) => setForm({ title: data.title || "", content: data.content || "" }))
      .catch((err) => {
        alert(err.message || "Failed to load note");
        navigate("/notepad");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function change(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function onSave(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    setSaving(true);
    const op = id ? api.put(`/notepad/update/${id}`, form) : api.post(`/notepad/create`, form);
    op
      .then(() => navigate("/notepad"))
      .catch((err) => alert(err.message || "Save failed"))
      .finally(() => setSaving(false));
  }

  if (loading) return <PageLoader variant="card" />;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{id ? "Edit Note" : "New Note"}</h2>
      <form onSubmit={onSave} className="grid gap-4">
        <label>
          <div className="text-sm font-medium">Title</div>
          <input value={form.title} onChange={(e) => change("title", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <label>
          <div className="text-sm font-medium">Content</div>
          <textarea value={form.content} onChange={(e) => change("content", e.target.value)} rows={10} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-md">{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-100 rounded-md">Cancel</button>
        </div>
      </form>
    </div>
  );
}
