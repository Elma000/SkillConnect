import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function NotepadList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  function fetchNotes() {
    setLoading(true);
    api
      .get("/notepad/entries")
      .then((data) => setNotes(data || []))
      .catch((err) => alert(err.message || "Failed to load notes"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function onDelete(id) {
    if (!confirm("Delete this note?")) return;
    api
      .del(`/notepad/delete/${id}`)
      .then(() => fetchNotes())
      .catch((err) => alert(err.message || "Delete failed"));
  }

  if (loading) return <PageLoader variant="list" rows={4} />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <div>
          <Link to="/notepad/new" className="px-4 py-2 bg-emerald-600 text-white rounded-md">New Note</Link>
        </div>
      </div>

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-slate-600">No notes yet</div>
        ) : (
          notes.map((n) => (
            <div key={n._id} className="p-4 bg-white rounded shadow flex justify-between items-start">
              <div>
                <Link to={`/notepad/${n._id}`} className="text-lg font-medium text-indigo-600 hover:underline">{n.title}</Link>
                <div className="text-sm text-slate-500 mt-1">{n.content?.slice(0, 200)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/notepad/${n._id}/edit`)} className="px-3 py-1 bg-slate-100 rounded">Edit</button>
                <button onClick={() => onDelete(n._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
