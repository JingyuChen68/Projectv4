"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CURATED_TREND_SIGNALS,
  TREND_SOURCE_QUERIES,
  type IndustryTrendSignal,
  type TrendDomain,
  type TrendSignalType,
} from "@/data/industryTrends";

type FeedSource = "live-rss" | "curated-fallback";
type DomainFilter = TrendDomain | "All";
type SignalFilter = TrendSignalType | "All";

interface TrendFeedResponse {
  signals?: IndustryTrendSignal[];
  source?: FeedSource;
  updatedAt?: string;
  summary?: string[];
  trackedSources?: {
    domain: TrendDomain;
    query: string;
    ok: boolean;
  }[];
}

const DOMAINS: DomainFilter[] = ["All", "Semiconductors", "Robotics", "Automation"];
const SIGNAL_TYPES: SignalFilter[] = [
  "All",
  "Chip Release",
  "Supply Chain",
  "Company Move",
  "Emerging Tech",
  "Standards",
];

const TYPE_TONES: Record<TrendSignalType, string> = {
  "Chip Release": "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
  "Supply Chain": "border-amber-300/20 bg-amber-400/10 text-amber-100",
  "Company Move": "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
  "Emerging Tech": "border-violet-300/20 bg-violet-400/10 text-violet-100",
  Standards: "border-sky-300/20 bg-sky-400/10 text-sky-100",
};

function fallbackResponse(): TrendFeedResponse {
  const updatedAt = new Date().toISOString();

  return {
    signals: CURATED_TREND_SIGNALS.map((signal) => ({
      ...signal,
      publishedAt: signal.publishedAt ?? updatedAt,
    })),
    source: "curated-fallback",
    updatedAt,
    summary: [
      "Curated baseline is active until the live feed returns data.",
      "Highest-value signals cluster around edge AI, RISC-V, secure automation, and robotics safety.",
      "Use the feed as a weekly scan for interview examples, portfolio ideas, and architecture vocabulary.",
    ],
    trackedSources: TREND_SOURCE_QUERIES.map((source) => ({
      domain: source.domain,
      query: source.query,
      ok: false,
    })),
  };
}

function formatDate(value?: string) {
  if (!value) return "Curated baseline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function searchText(signal: IndustryTrendSignal) {
  return [
    signal.title,
    signal.summary,
    signal.domain,
    signal.signalType,
    signal.momentum,
    signal.horizon,
    signal.impact,
    signal.tags.join(" "),
    signal.sourceName,
  ]
    .join(" ")
    .toLowerCase();
}

function sourceLabel(source: FeedSource | undefined) {
  return source === "live-rss" ? "Live RSS feed" : "Curated fallback";
}

export default function IndustryTrendsDashboard({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [signals, setSignals] = useState<IndustryTrendSignal[]>(() => fallbackResponse().signals ?? []);
  const [summary, setSummary] = useState<string[]>(() => fallbackResponse().summary ?? []);
  const [source, setSource] = useState<FeedSource>("curated-fallback");
  const [trackedSources, setTrackedSources] = useState<TrendFeedResponse["trackedSources"]>(
    () => fallbackResponse().trackedSources
  );
  const [updatedAt, setUpdatedAt] = useState<string>(() => new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("All");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("All");

  const refreshFeed = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/industry-trends", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Trend feed returned ${response.status}`);
      }

      const data = (await response.json()) as TrendFeedResponse;
      const fallback = fallbackResponse();

      setSignals(data.signals?.length ? data.signals : fallback.signals ?? []);
      setSummary(data.summary?.length ? data.summary : fallback.summary ?? []);
      setSource(data.source ?? fallback.source ?? "curated-fallback");
      setTrackedSources(data.trackedSources ?? fallback.trackedSources);
      setUpdatedAt(data.updatedAt ?? fallback.updatedAt ?? new Date().toISOString());
    } catch (feedError) {
      console.error("Industry trend refresh failed:", feedError);
      const fallback = fallbackResponse();
      setSignals(fallback.signals ?? []);
      setSummary(fallback.summary ?? []);
      setSource("curated-fallback");
      setTrackedSources(fallback.trackedSources);
      setUpdatedAt(fallback.updatedAt ?? new Date().toISOString());
      setError("Live feed unavailable. Showing curated baseline signals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFeed();
  }, [refreshFeed]);

  useEffect(() => {
    if (!autoRefresh) return;

    const id = window.setInterval(() => {
      refreshFeed();
    }, 30 * 60 * 1000);

    return () => window.clearInterval(id);
  }, [autoRefresh, refreshFeed]);

  const filteredSignals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return signals.filter((signal) => {
      const matchesDomain = domainFilter === "All" || signal.domain === domainFilter;
      const matchesType = signalFilter === "All" || signal.signalType === signalFilter;
      const matchesSearch = !query || searchText(signal).includes(query);

      return matchesDomain && matchesType && matchesSearch;
    });
  }, [domainFilter, searchQuery, signalFilter, signals]);

  const stats = useMemo(() => {
    const nowSignals = signals.filter((signal) => signal.horizon === "Now").length;
    const accelerating = signals.filter((signal) => signal.momentum === "Accelerating").length;
    const liveSources = trackedSources?.filter((item) => item.ok).length ?? 0;

    return [
      { label: "Signals tracked", value: signals.length, detail: `${filteredSignals.length} visible` },
      { label: "Near-term signals", value: nowSignals, detail: "marked now" },
      { label: "Accelerating", value: accelerating, detail: "highest momentum" },
      { label: "Live sources", value: liveSources, detail: `${trackedSources?.length ?? 0} queries` },
    ];
  }, [filteredSignals.length, signals, trackedSources]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
              Industry Trends Dashboard
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Semiconductors, robotics, and automation signals
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              A curated feed that refreshes from live industry news when available, then falls
              back to durable watchlist signals for chip releases, supply shifts, company moves,
              standards, and emerging architectures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              {sourceLabel(source)}
            </span>
            <button
              type="button"
              onClick={refreshFeed}
              disabled={loading}
              className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/15 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh feed"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-50">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.5fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/75">
                  Analysis Summary
                </p>
                <p className="mt-2 text-sm text-slate-400">Updated {formatDate(updatedAt)}</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(event) => setAutoRefresh(event.target.checked)}
                  className="h-4 w-4 rounded border-cyan-300/30"
                />
                Auto refresh
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {summary.map((item) => (
                <div key={item} className="rounded-xl border border-white/8 bg-white/5 p-3 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/75">
              Filters
            </p>
            <div className="mt-4 space-y-4">
              <label className="block text-sm text-slate-300">
                Domain
                <select
                  value={domainFilter}
                  onChange={(event) => setDomainFilter(event.target.value as DomainFilter)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none"
                >
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm text-slate-300">
                Signal type
                <select
                  value={signalFilter}
                  onChange={(event) => setSignalFilter(event.target.value as SignalFilter)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none"
                >
                  {SIGNAL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 space-y-2">
              {trackedSources?.map((tracked) => (
                <div
                  key={tracked.domain}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-slate-300">{tracked.domain}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] ${
                      tracked.ok
                        ? "bg-emerald-400/10 text-emerald-100"
                        : "bg-slate-700/50 text-slate-300"
                    }`}
                  >
                    {tracked.ok ? "Live" : "Fallback"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">{filteredSignals.length} signals found</p>
            <p className="text-xs text-slate-500">Auto-refresh interval: 30 minutes</p>
          </div>

          {filteredSignals.map((signal) => (
            <article
              key={signal.id}
              className="rounded-2xl border border-cyan-300/12 bg-slate-950/45 p-5 hover:border-cyan-300/28"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium ${TYPE_TONES[signal.signalType]}`}>
                      {signal.signalType}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] font-medium text-slate-300">
                      {signal.domain}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] font-medium text-slate-300">
                      {signal.horizon}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold leading-6 text-slate-50">
                    {signal.sourceUrl ? (
                      <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-200">
                        {signal.title}
                      </a>
                    ) : (
                      signal.title
                    )}
                  </h3>
                </div>

                <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
                  {signal.momentum}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">{signal.summary}</p>
              <p className="mt-3 rounded-xl border border-white/8 bg-white/5 p-3 text-sm leading-6 text-slate-200">
                {signal.impact}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {signal.tags.map((tag) => (
                  <span key={`${signal.id}-${tag}`} className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-3 text-xs text-slate-500">
                <span>{signal.sourceName}</span>
                <span>{formatDate(signal.publishedAt)}</span>
              </div>
            </article>
          ))}

          {filteredSignals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 p-8 text-center">
              <p className="text-sm text-slate-300">No trend signals match the current filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
