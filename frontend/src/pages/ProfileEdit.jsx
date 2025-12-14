import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import { isLoggedIn, logout } from "../services/auth"; 
import PageLoader from "../components/PageLoader";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(() => isLoggedIn());
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", bio: "", profilePicture: null, skills: [], socialLinks: {} });
  const [preview, setPreview] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [_, setOriginalPicture] = useState(null);
  const [pictureChanged, setPictureChanged] = useState(false);
  useEffect(() => {
    if (!isLoggedIn()) return navigate("/login");
    api
      .get("/user/profile")
      .then((data) => {
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || null,
          skills: data.skills || [],
          socialLinks: data.socialLinks || {},
        });
        setPreview(data.profilePicture || null);
        setOriginalPicture(data.profilePicture || null);
        setPictureChanged(false);
      })
      .catch((err) => {
        if (err.status === 401) {
          logout();
          setLoading(false);
          navigate("/login");
        } else {
          setLoading(false);
          alert(err.message || "Failed to load profile");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function change(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function addSkill() {
    const v = newSkill.trim();
    if (!v) return;
    setForm((s) => ({ ...s, skills: Array.from(new Set([...(s.skills||[]), v])) }));
    setNewSkill("");
  }

  function removeSkill(name) {
    setForm((s) => ({ ...s, skills: (s.skills || []).filter((x) => x !== name) }));
  }

  function changeSocial(key, val) {
    setForm((s) => ({ ...s, socialLinks: { ...(s.socialLinks || {}), [key]: val } }));
  }

  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      change("profilePicture", dataUrl);
      setPreview(dataUrl);
      setPictureChanged(true);
    };
    reader.readAsDataURL(f);
  }

  function clearPicture() {
    change("profilePicture", null);
    setPreview(null);
    setPictureChanged(true);
  }

  function onSave(e) {
    e.preventDefault();
    setSaving(true);
    // Only send profilePicture when user actually changed it
    const payload = { ...form };
    if (!pictureChanged) delete payload.profilePicture;

    api
      .put("/user/update", payload)
      .then(() => {
        alert("Profile updated");
        navigate("/profile");
      })
      .catch((err) => alert(err.message || "Update failed"))
      .finally(() => setSaving(false));
  }

  if (loading) return <PageLoader   />;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Edit profile</h2>
      <form onSubmit={onSave} className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24">
            <img
                src={preview || "https://via.placeholder.com/96x96?text=No+Image"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover bg-slate-100"
              />

          </div>
          <div>
            <label className="block text-sm text-slate-700">Profile picture</label>
            <input type="file" accept="image/*" onChange={onFile} />
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={clearPicture} className="px-3 py-1 rounded-md bg-red-100 text-red-600">Remove</button>
            </div>
          </div>
        </div>

        <label>
          <div className="text-sm font-medium">Full name</div>
          <input value={form.fullName} onChange={(e) => change("fullName", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <label>
          <div className="text-sm font-medium">Email</div>
          <input value={form.email} onChange={(e) => change("email", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <label>
          <div className="text-sm font-medium">Bio</div>
          <textarea value={form.bio} onChange={(e) => change("bio", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <div>
          <div className="text-sm font-medium">Skills</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {(form.skills || []).map((s) => (
              <div key={s} className="px-2 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-2">
                <span>{s}</span>
                <button type="button" onClick={() => removeSkill(s)} className="text-xs text-red-500">×</button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="rounded-md border px-3 py-2" placeholder="Add skill" />
            <button type="button" onClick={addSkill} className="px-3 py-2 bg-slate-200 rounded-md">Add</button>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">Social links</div>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            <label>
              <div className="text-xs text-slate-600">LinkedIn</div>
              <input value={form.socialLinks.linkedin || ""} onChange={(e) => changeSocial("linkedin", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="https://linkedin.com/in/yourname" />
            </label>
            <label>
              <div className="text-xs text-slate-600">GitHub</div>
              <input value={form.socialLinks.github || ""} onChange={(e) => changeSocial("github", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="https://github.com/username" />
            </label>
            <label>
              <div className="text-xs text-slate-600">Twitter</div>
              <input value={form.socialLinks.twitter || ""} onChange={(e) => changeSocial("twitter", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="https://twitter.com/username" />
            </label>
            <label>
              <div className="text-xs text-slate-600">Website</div>
              <input value={form.socialLinks.website || ""} onChange={(e) => changeSocial("website", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="https://your.site" />
            </label>
          </div>
        </div>
        <label>
          <div className="text-sm font-medium">Email</div>
          <input value={form.email} onChange={(e) => change("email", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <label>
          <div className="text-sm font-medium">Bio</div>
          <textarea value={form.bio} onChange={(e) => change("bio", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-md">{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate("/profile")} className="px-4 py-2 bg-slate-100 rounded-md">Cancel</button>
        </div>
      </form>
    </div>
  );
}
