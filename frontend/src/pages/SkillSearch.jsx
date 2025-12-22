import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import { isLoggedIn, logout } from "../services/auth";
import PageLoader from "../components/PageLoader";

const QUICK_TAGS = ["React", "Node.js", "MongoDB", "UI/UX", "DevOps", "Python"];

export default function SkillSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch skills whenever the query changes (debounced)
  useEffect(() => {
    if (!isLoggedIn()) return;
    
    setLoading(true);
    setError("");
    
    const handle = setTimeout(() => {
      const searchQuery = query.trim();
      const url = searchQuery 
        ? `/skill/search?q=${encodeURIComponent(searchQuery)}`
        : `/skill/search`;
      
      api
        .get(url)
        .then((data) => {
          setSkills(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (err.status === 401) {
            logout();
            navigate("/login");
            return;
          }
          setError(err.message || "Failed to search skills");
          setSkills([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(handle);
  }, [query, navigate]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Search Skills</h1>
        <p className="mt-2 text-slate-100 max-w-2xl">
          Explore what people in the community can do. Filter by a keyword to quickly
          find the skills you need.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-xl backdrop-blur">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "React", "design", "project management"...'
            className="flex-1 rounded-lg border border-white/30 bg-white text-slate-900 px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuery("")}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 hover:bg-white/30 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-white/15 text-white text-sm hover:bg-white/25 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Available Skills</div>
            <div className="text-sm text-slate-500">
              {loading ? "Searching..." : `${skills.length} result${skills.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <PageLoader variant="list" rows={6} className="mt-4" />
        ) : skills.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-200 p-8 text-center text-slate-500">
            {query.trim() 
              ? `No skills found matching "${query}". Try a different keyword.`
              : "No skills found. Users can add skills to their profiles."}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {skills.map((skill, index) => (
              <div
                key={skill.name || index}
                className="p-4 border rounded-lg hover:shadow-sm transition bg-slate-50/40 flex items-center justify-between"
              >
                <div>
                  <div className="text-base font-medium text-slate-900">{skill.name}</div>
                  <div className="text-sm text-slate-500">
                    Listed by {skill.count} {skill.count === 1 ? "person" : "people"}
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                  {skill.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

