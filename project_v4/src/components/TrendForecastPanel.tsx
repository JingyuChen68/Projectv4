"use client";

import { useMemo, useState } from "react";
import {
  DECLINING_TECHNOLOGIES,
  SKILLS_FORECAST,
  TREND_FORECASTS,
  type TrendDomain,
} from "@/data/industryTrends";

type ForecastFilter = TrendDomain | "Cross-industry" | "All";

const FORECAST_FILTERS: ForecastFilter[] = [
  "All",
  "Cross-industry",
  "Semiconductors",
  "Robotics",
  "Automation",
];

const DIRECTION_TONES = {
  "Gaining traction": "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
  "Stable demand": "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
  "Losing momentum": "border-amber-300/20 bg-amber-400/10 text-amber-100",
};

const DEMAND_TONES = {
  Critical: "border-rose-300/20 bg-rose-400/10 text-rose-100",
  High: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
  Rising: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
};

function forecastSearchText(forecast: (typeof TREND_FORECASTS)[number]) {
  return [
    forecast.title,
    forecast.direction,
    forecast.domain,
    forecast.timeframe,
    forecast.summary,
    forecast.whyItMatters,
    forecast.signals.join(" "),
    forecast.skills.join(" "),
    forecast.watchouts.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export default function TrendForecastPanel({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [filter, setFilter] = useState<ForecastFilter>("All");

  const filteredForecasts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return TREND_FORECASTS.filter((forecast) => {
      const matchesFilter = filter === "All" || forecast.domain === filter;
      const matchesSearch = !query || forecastSearchText(forecast).includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
              Trend Analysis & Forecasting
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Architecture, technology, and skills outlook
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Summarized industry direction for the next 2-5 years across silicon,
              robots, and factory systems.
            </p>
          </div>

          <label className="block min-w-56 text-sm text-slate-300">
            Forecast area
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as ForecastFilter)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none"
            >
              {FORECAST_FILTERS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">{filteredForecasts.length} forecasts found</p>
            <p className="text-xs text-slate-500">Confidence is directional, not a guarantee</p>
          </div>

          {filteredForecasts.map((forecast) => (
            <article
              key={forecast.id}
              className="rounded-2xl border border-cyan-300/12 bg-slate-950/45 p-5 hover:border-cyan-300/28"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium ${DIRECTION_TONES[forecast.direction]}`}>
                      {forecast.direction}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] font-medium text-slate-300">
                      {forecast.domain}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] font-medium text-slate-300">
                      {forecast.timeframe}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-50">
                    {forecast.title}
                  </h3>
                </div>

                <div className="min-w-32">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Confidence</span>
                    <span className="font-mono text-cyan-100">{forecast.confidence}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                      style={{ width: `${forecast.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">{forecast.summary}</p>
              <p className="mt-3 rounded-xl border border-white/8 bg-white/5 p-3 text-sm leading-6 text-slate-200">
                {forecast.whyItMatters}
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <ForecastList title="Signals" items={forecast.signals} />
                <ForecastList title="Skills" items={forecast.skills} />
                <ForecastList title="Watchouts" items={forecast.watchouts} />
              </div>
            </article>
          ))}

          {filteredForecasts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 p-8 text-center">
              <p className="text-sm text-slate-300">No forecasts match the current filters.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/75">
              2-5 Year Skill Map
            </p>
            <div className="mt-4 space-y-3">
              {SKILLS_FORECAST.map((skill) => (
                <div key={skill.skill} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-50">{skill.skill}</p>
                      <p className="mt-1 text-xs text-slate-500">{skill.timeframe}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium ${DEMAND_TONES[skill.demand]}`}>
                      {skill.demand}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{skill.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skill.domains.map((domain) => (
                      <span key={`${skill.skill}-${domain}`} className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-slate-300">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/75">
              Technologies Losing Momentum
            </p>
            <div className="mt-4 space-y-3">
              {DECLINING_TECHNOLOGIES.map((tech) => (
                <div key={tech.name} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-50">{tech.name}</p>
                    <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2.5 py-1 text-[0.68rem] font-medium text-amber-100">
                      {tech.pressure}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-cyan-100">{tech.replacement}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{tech.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function ForecastList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-3">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="text-sm leading-5 text-slate-300">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
