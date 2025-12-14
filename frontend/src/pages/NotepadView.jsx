import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { api } from "../services/api";
import PageLoader from "../components/PageLoader";

export default function NotepadView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!id) return navigate("/notepad");
    api
      .get(`/notepad/${id}`)
      .then((data) => setNote(data))
      .catch((err) => {
        alert(err.message || "Failed to load note");
        navigate("/notepad");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function onDelete() {
    if (!confirm("Delete this note?")) return;
    api
      .del(`/notepad/delete/${id}`)
      .then(() => navigate("/notepad"))
      .catch((err) => alert(err.message || "Delete failed"));
  }

  if (loading) return <PageLoader variant="card" />;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{note.title}</h1>
        <div className="flex gap-2">
          <Link to={`/notepad/${id}/edit`} className="px-3 py-1 bg-slate-100 rounded">Edit</Link>
          <button onClick={onDelete} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
        </div>
      </div>
      <div className="mt-4 whitespace-pre-wrap text-slate-800">{note.content}</div>
    </div>
  );
}
