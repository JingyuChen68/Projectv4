"use client";

import Link from "next/link";
import { useApp, DIFFICULTY_COLORS, STATUS_COLORS } from "@/context/AppContext";
import { LESSONS } from "@/data/lessons";

export default function Dashboard() {
  const { questions, companies, checklist } = useApp();

  const totalQuestions = questions.length;
  const masteredCount = questions.filter((q) => q.status === "Mastered").length;
  const inProgressCount = questions.filter((q) => q.status === "In Progress").length;
  const checklistDone = checklist.filter((item) => item.completed).length;
  const checklistTotal = checklist.length;
  const checklistPercent =
    checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0;
  const activeCompanies = companies.filter((c) => c.status === "Interviewing").length;

  const categoryBreakdown = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});

  const recentQuestions = questions.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.75rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,_rgba(87,212,255,0.18),_transparent_30%),linear-gradient(135deg,_rgba(11,25,39,0.98),_rgba(7,16,26,0.96))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
        <div className="grid gap-8 lg:grid-cols-[1.7fr_0.95fr]">
          <div className="space-y-6">
            <span className="tech-badge">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(87,212,255,0.9)]" />
              Hardware Interview Command Center
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-mono text-3xl font-semibold uppercase tracking-[0.12em] text-slate-50 sm:text-4xl">
                Build your embedded interview stack like a control system.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Keep every prep workflow in one deck: concept review, question drills,
                company tracking, and final interview readiness with a cleaner
                hardware-lab layout.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SignalCard label="Question Bank" value={totalQuestions} sub={`${masteredCount} mastered`} tone="cyan" />
              <SignalCard label="Study Queue" value={inProgressCount} sub="active review" tone="blue" />
              <SignalCard label="Live Companies" value={companies.length} sub={`${activeCompanies} interviewing`} tone="amber" />
              <SignalCard label="Readiness" value={`${checklistPercent}%`} sub={`${checklistDone}/${checklistTotal} complete`} tone="emerald" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/questions"
                className="rounded-xl border border-cyan-300/30 bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Open Question Console
              </Link>
              <Link
                href="/lessons"
                className="rounded-xl border border-slate-600/60 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                Browse Study Modules
              </Link>
              <Link
                href="/chips"
                className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15"
              >
                Compare MCUs
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-cyan-300/12 bg-slate-950/55 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/75">
                  System Telemetry
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-50">Prep status at a glance</h2>
              </div>
              <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-emerald-200">
                Nominal
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <TelemetryRow
                label="Question mastery"
                value={totalQuestions ? Math.round((masteredCount / totalQuestions) * 100) : 0}
                accent="from-cyan-400 to-sky-500"
              />
              <TelemetryRow
                label="Checklist completion"
                value={checklistPercent}
                accent="from-emerald-400 to-teal-500"
              />
              <TelemetryRow
                label="Company pipeline"
                value={companies.length ? Math.min(100, activeCompanies * 20) : 0}
                accent="from-amber-400 to-orange-500"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                  Active Tracks
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {Object.keys(categoryBreakdown).length}
                </p>
                <p className="mt-1 text-sm text-slate-400">technical categories loaded</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                  Lesson Modules
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">{LESSONS.length}</p>
                <p className="mt-1 text-sm text-slate-400">guided study packets ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
        <ActionTile href="/lessons" index="A1" title="Lessons" detail="Structured concept review" />
        <ActionTile href="/questions" index="A2" title="Questions" detail="Practice and track answers" />
        <ActionTile href="/chips" index="A3" title="Chip Lab" detail="Compare specs and supply" />
        <ActionTile href="/career" index="A4" title="Career" detail="Map roles and milestones" />
        <ActionTile href="/industry" index="A5" title="Industry" detail="Watch trends and forecasts" />
        <ActionTile href="/companies" index="A6" title="Pipeline" detail="Track research and interviews" />
        <ActionTile href="/checklist" index="A7" title="Checklist" detail="Final readiness review" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
                  Training Modules
                </p>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">Featured study guides</h2>
              </div>
              <Link href="/lessons" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                View all {LESSONS.length}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {LESSONS.slice(0, 4).map((lesson) => (
                <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} className="group">
                  <div className="rounded-2xl border border-cyan-300/12 bg-slate-950/45 p-4 hover:border-cyan-300/30">
                    <div className={`h-1 rounded-full bg-gradient-to-r ${lesson.gradientFrom} ${lesson.gradientTo}`} />
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl">{lesson.icon}</p>
                        <p className="mt-3 text-sm font-semibold text-slate-50 group-hover:text-cyan-200">
                          {lesson.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                          {lesson.category}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-slate-300">
                        {lesson.estimatedMinutes}m
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
                  Recent Activity
                </p>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">Question queue</h2>
              </div>
              <Link href="/questions" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                Open all
              </Link>
            </div>

            {recentQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 px-6 py-10 text-center">
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-slate-400">
                  No active prompts
                </p>
                <Link
                  href="/questions"
                  className="mt-4 inline-flex rounded-xl border border-cyan-300/30 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                >
                  Add Question
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentQuestions.map((q, index) => (
                  <Link
                    key={q.id}
                    href={`/questions/${q.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-slate-950/45 p-4 hover:border-cyan-300/25"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-400/10 font-mono text-sm text-cyan-200">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 group-hover:text-violet-700">
                        {q.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{q.category}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[q.status]}`}>
                        {q.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
              Category Loadout
            </p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">Coverage by topic</h2>

            <div className="mt-5 space-y-3">
              {Object.entries(categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => (
                  <div key={category} className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-200">{category}</span>
                      <span className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
                        {count}
                      </span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/6">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500"
                        style={{ width: `${Math.max(14, Math.min(100, count * 7))}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
              Recommended Flow
            </p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">Prep sequence</h2>

            <div className="mt-5 space-y-3">
              {[
                "Refresh lessons and core concepts",
                "Practice technical question sets",
                "Research target companies",
                "Run final checklist before interviews",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-950/45 p-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-400/10 font-mono text-xs text-cyan-100">
                    0{index + 1}
                  </span>
                  <p className="pt-1 text-sm text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SignalCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub: string;
  tone: "cyan" | "blue" | "amber" | "emerald";
}) {
  const tones = {
    cyan: "border-cyan-300/18 bg-cyan-400/10 text-cyan-100",
    blue: "border-sky-300/18 bg-sky-400/10 text-sky-100",
    amber: "border-amber-300/18 bg-amber-400/10 text-amber-100",
    emerald: "border-emerald-300/18 bg-emerald-400/10 text-emerald-100",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{sub}</p>
    </div>
  );
}

function TelemetryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-cyan-100">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/6">
        <div className={`h-2.5 rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ActionTile({
  href,
  index,
  title,
  detail,
}: {
  href: string;
  index: string;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/8 bg-slate-950/45 p-4 hover:border-cyan-300/25 hover:bg-slate-950/65"
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-300/70">
        {index}
      </p>
      <p className="mt-3 text-base font-semibold text-slate-50">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{detail}</p>
    </Link>
  );
}
