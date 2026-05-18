"use client";
// added pages here
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface SavedRepo {
  id: string;
  repo_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  owner_avatar_url: string;
  notes: string;
  saved_at: string;
}

interface SavedQuestion {
  id: string;
  question_id: string;
  title: string;
  category: string;
  difficulty: string;
  status: string;
  notes: string;
  saved_at: string;
}

export default function SavedPage() {
  const { isSignedIn, user } = useUser();
  const [repos, setRepos] = useState<SavedRepo[]>([]);
  const [questions, setQuestions] = useState<SavedQuestion[]>([]);
  const [tab, setTab] = useState<"repos" | "questions">("repos");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    async function loadData() {
      setLoading(true);
      try {
        const [reposRes, questionsRes] = await Promise.all([
          fetch("/api/saved-repos"),
          fetch("/api/saved-questions"),
        ]);
        const reposData = await reposRes.json();
        const questionsData = await questionsRes.json();
        if (Array.isArray(reposData)) setRepos(reposData);
        if (Array.isArray(questionsData)) setQuestions(questionsData);
      } catch (error) {
        console.error("Failed to load saved items:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isSignedIn]);

  async function removeRepo(repoId: number) {
    setRemovingId(String(repoId));
    try {
      const res = await fetch(`/api/saved-repos?repo_id=${repoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRepos((prev) => prev.filter((r) => r.repo_id !== repoId));
      }
    } catch (error) {
      console.error("Remove failed:", error);
    } finally {
      setRemovingId(null);
    }
  }

  async function removeQuestion(questionId: string) {
    setRemovingId(questionId);
    try {
      const res = await fetch(
        `/api/saved-questions?question_id=${questionId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setQuestions((prev) =>
          prev.filter((q) => q.question_id !== questionId)
        );
      }
    } catch (error) {
      console.error("Remove failed:", error);
    } finally {
      setRemovingId(null);
    }
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-lg">Sign in to view your saved items</p>
        <Link
          href="/sign-in"
          className="inline-block mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            My Saved Items
          </h1>
          <p className="text-emerald-100 text-lg">
            {user?.firstName
              ? `${user.firstName}'s study collection`
              : "Your personal study collection"}{" "}
            — {repos.length} projects and {questions.length} questions saved.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl border border-gray-200 p-1.5">
        <button
          onClick={() => setTab("repos")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
            tab === "repos"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          GitHub Projects ({repos.length})
        </button>
        <button
          onClick={() => setTab("questions")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
            tab === "questions"
              ? "bg-violet-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Saved Questions ({questions.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Loading your saved items...</p>
        </div>
      ) : tab === "repos" ? (
        /* Saved Repos */
        repos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-5xl mb-4">📁</p>
            <p className="text-lg">No projects saved yet</p>
            <Link
              href="/explore"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Explore Projects
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow"
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
                    <p className="text-xs text-gray-400">
                      Saved {new Date(repo.saved_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-2">
                  {repo.description || "No description"}
                </p>

                {repo.topics && repo.topics.length > 0 && (
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

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  {repo.language && <span>{repo.language}</span>}
                  <span>★ {repo.stargazers_count.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => removeRepo(repo.repo_id)}
                  disabled={removingId === String(repo.repo_id)}
                  className="w-full py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                >
                  {removingId === String(repo.repo_id)
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )
      ) : /* Saved Questions */
      questions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-5xl mb-4">🧠</p>
          <p className="text-lg">No questions saved yet</p>
          <Link
            href="/questions"
            className="inline-block mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
          >
            Browse Questions
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{q.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{q.category}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      q.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : q.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">
                    Saved {new Date(q.saved_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeQuestion(q.question_id)}
                disabled={removingId === q.question_id}
                className="ml-4 px-4 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
              >
                {removingId === q.question_id ? "..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
