import { NextRequest, NextResponse } from "next/server";

// newly added github repo
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  owner?: {
    avatar_url?: string;
  };
  forks_count: number;
  updated_at: string;
}

interface GitHubSearchResponse {
  total_count: number;
  items?: GitHubRepo[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "embedded systems";
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "12";

  const searchQuery = query;

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "EmbedPrep-App",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "GitHub API error", details: errorText },
        { status: res.status }
      );
    }

    const data = (await res.json()) as GitHubSearchResponse;

    // Shape the response to only include what we need
    const repos = (data.items || []).map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics || [],
      owner_avatar_url: repo.owner?.avatar_url,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
    }));

    return NextResponse.json({
      total_count: data.total_count,
      repos,
    });
  } catch (error) {
    console.error("GitHub search error:", error);
    return NextResponse.json(
      { error: "Failed to search GitHub" },
      { status: 500 }
    );
  }
}
