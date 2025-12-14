import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import { logout, isLoggedIn } from "../services/auth";
import { Link } from "react-router"; 
import PageLoader from "../components/PageLoader";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(() => isLoggedIn());
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    bio: "",
    profilePicture: null,
  });

  useEffect(() => {
    if (!isLoggedIn()) return navigate("/login");
    api
      .get("/user/profile")
      .then((data) => {
        if (data)
          setForm({
            fullName: data.fullName || "",
            email: data.email || "",
            bio: data.bio || "",
            profilePicture: data.profilePicture || null,
            skills: data.skills || [],
            socialLinks: data.socialLinks || {},
          });
      })
      .catch((err) => {
        console.error(err);
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

  function onDelete() {
    if (!confirm("Delete your account? This is irreversible.")) return;
    api
      .del("/user/delete")
      .then(() => {
        logout();
        navigate("/login");
      })
      .catch((err) => alert(err.message || "Delete failed"));
  }

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-6">
        <div className="w-28 h-28">
          <img
            src={
              form.profilePicture ||
              "https://via.placeholder.com/112x112?text=No+Image"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover bg-slate-100"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{form.fullName}</h2>
          <div className="text-sm text-slate-600">{form.email}</div>
          <p className="mt-2 text-slate-700">{form.bio || "No bio yet"}</p>
          <div className="mt-4">
            <div className="text-sm font-medium text-slate-600">Skills</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {form.skills && form.skills.length > 0 ? (
                form.skills.map((s, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 bg-slate-100 rounded-full text-sm text-slate-700"
                  >
                    {s}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No skills yet</div>
              )}
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium text-slate-600">Social</div>
              <div className="mt-2 flex gap-4">
                {form.socialLinks &&
                Object.keys(form.socialLinks).filter((k) => form.socialLinks[k])
                  .length > 0 ? (
                  Object.entries(form.socialLinks).map(([k, v]) =>
                    v ? (
                      <a
                        key={k}
                        href={v}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        {k}
                      </a>
                    ) : null
                  )
                ) : (
                  <div className="text-sm text-slate-500">
                    No social links yet
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/profile/edit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Edit profile
              </Link>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
