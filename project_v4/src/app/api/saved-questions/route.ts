import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";

// GET: we get all current users
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
    .from("saved_questions")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Save a question
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

  const { data, error } = await supabase.from("saved_questions").insert({
    user_id: userId,
    question_id: body.question_id,
    title: body.title,
    category: body.category,
    difficulty: body.difficulty,
    status: body.status || "Not Started",
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

// DELETE: Remove a saved question
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
  const questionId = searchParams.get("question_id");
  if (!questionId) {
    return NextResponse.json({ error: "question_id required" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient(token);
  const { error } = await supabase
    .from("saved_questions")
    .delete()
    .eq("user_id", userId)
    .eq("question_id", questionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
