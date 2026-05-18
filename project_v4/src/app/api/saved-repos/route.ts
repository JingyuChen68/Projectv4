import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";

// GET: Fetch all saved repos for the current user
export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken({ template: "supabase" });
  if (!token) {
    return NextResponse.json({ error: "No Supabase token" }, { status: 401 });
  }

  const supabase = createSupabaseServerClient(token);
  const { data, error } = await supabase
    .from("saved_repos")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Save a new repo
export async function POST(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken({ template: "supabase" });
  if (!token) {
    return NextResponse.json({ error: "No Supabase token" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = createSupabaseServerClient(token);

  const { data, error } = await supabase.from("saved_repos").insert({
    user_id: userId,
    repo_id: body.repo_id,
    name: body.name,
    full_name: body.full_name,
    description: body.description,
    html_url: body.html_url,
    stargazers_count: body.stargazers_count,
    language: body.language,
    topics: body.topics,
    owner_avatar_url: body.owner_avatar_url,
    notes: body.notes || "",
  }).select().single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already saved" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// DELETE: Remove a saved repo
export async function DELETE(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken({ template: "supabase" });
  if (!token) {
    return NextResponse.json({ error: "No Supabase token" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const repoId = searchParams.get("repo_id");
  if (!repoId) {
    return NextResponse.json({ error: "repo_id required" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient(token);
  const { error } = await supabase
    .from("saved_repos")
    .delete()
    .eq("user_id", userId)
    .eq("repo_id", parseInt(repoId));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
