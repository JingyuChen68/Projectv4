"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  owner_avatar_url: string;
  forks_count: number;
  updated_at: string;
}

interface SavedRepoRow {
  repo_id: number;
}

export default function ExplorePage() {
  const { isSignedIn } = useUser();
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingId, setSavingId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Load user's saved repos to show which are already saved
  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/saved-repos")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSavedIds(new Set(data.map((r: SavedRepoRow) => r.repo_id)));
          }
        })
        .catch(console.error);
    }
  }, [isSignedIn]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/github/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setRepos(data.repos || []);
      setTotalCount(data.total_count || 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(repo: Repo) {
    if (!isSignedIn) return;
    setSavingId(repo.id);
    try {
      const res = await fetch("/api/saved-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          language: repo.language,
          topics: repo.topics,
          owner_avatar_url: repo.owner_avatar_url,
        }),
      });
      if (res.ok) {
        setSavedIds((prev) => new Set([...prev, repo.id]));
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSavingId(null);
    }
  }

  async function handleUnsave(repoId: number) {
    setSavingId(repoId);
    try {
      const res = await fetch(`/api/saved-repos?repo_id=${repoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(repoId);
          return next;
        });
      }
    } catch (error) {
      console.error("Unsave failed:", error);
    } finally {
      setSavingId(null);
    }
  }

  const SUGGESTIONS = [
    "RTOS",
    "STM32",
    "Arduino",
    "Raspberry Pi",
    "FreeRTOS",
    "Zephyr",
    "ESP32",
    "firmware",
    "PLC",
    "embedded Linux",
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
          <p className="text-cyan-100 text-lg">
            Search GitHub for embedded systems projects, firmware libraries, and
            hardware tools. Save the best ones to your study list.
          </p>
        </div>
        <svg className="absolute right-4 bottom-4 w-28 h-28 opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"/>
          <path d="M50 20 L50 50 L70 60" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="50" cy="50" r="4" fill="white"/>
        </svg>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search embedded systems projects..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuery(s);
              }}
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {hasSearched && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {totalCount > 0
              ? `Found ${totalCount.toLocaleString()} repositories`
              : "No repositories found"}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => {
              const isSaved = savedIds.has(repo.id);
              const isSaving = savingId === repo.id;

              return (
                <div
                  key={repo.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {repo.owner_avatar_url && (
                      <img
                        src={repo.owner_avatar_url}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:text-blue-700 text-sm truncate block"
                      >
                        {repo.full_name}
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-2">
                    {repo.description || "No description"}
                  </p>

                  {/* Topics */}
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {repo.topics.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                        {repo.language}
                      </span>
                    )}
                    <span>★ {repo.stargazers_count.toLocaleString()}</span>
                    <span>🍴 {repo.forks_count}</span>
                  </div>

                  {/* Save button */}
                  {isSignedIn && (
                    <button
                      onClick={() =>
                        isSaved ? handleUnsave(repo.id) : handleSave(repo)
                      }
                      disabled={isSaving}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                        isSaved
                          ? "bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } disabled:opacity-50`}
                    >
                      {isSaving
                        ? "..."
                        : isSaved
                          ? "✓ Saved — Click to Remove"
                          : "Save to Study List"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasSearched && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">
            Search for embedded systems projects to study
          </p>
          <p className="text-sm mt-2">
            Try &quot;RTOS&quot;, &quot;STM32&quot;, &quot;firmware&quot;, or
            &quot;Arduino&quot;
          </p>
        </div>
      )}
    </div>
  );
}
