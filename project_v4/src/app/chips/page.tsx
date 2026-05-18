"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CHIP_CATALOG,
  CHIP_PRICE_SNAPSHOTS,
  CONNECTIVITY_OPTIONS,
  USE_CASE_PRESETS,
  type ChipCategory,
  type ChipPriceSnapshot,
  type ChipSpec,
  type Connectivity,
} from "@/data/chipCatalog";

type FilterCategory = ChipCategory | "All";
type FilterConnectivity = Connectivity | "All";
type PricingSource = "catalog-snapshot" | "live";

interface PricingResponse {
  quotes: Record<string, ChipPriceSnapshot>;
  source: PricingSource;
  updatedAt: string;
  error?: string;
}

interface ScoredChip extends ChipSpec {
  quote: ChipPriceSnapshot;
  score: number;
  reasons: string[];
}

const CATEGORIES: FilterCategory[] = [
  "All",
  "Wireless MCU",
  "General Purpose MCU",
  "Performance MCU",
  "Ultra Low Power MCU",
  "Motor Control MCU",
  "Secure MCU",
];

const PRICE_LIMITS = [
  { label: "Any", value: 999 },
  { label: "$3", value: 3 },
  { label: "$5", value: 5 },
  { label: "$10", value: 10 },
  { label: "$15", value: 15 },
];

const FLASH_LIMITS = [
  { label: "Any", value: 0 },
  { label: "256KB", value: 256 },
  { label: "512KB", value: 512 },
  { label: "1MB", value: 1024 },
  { label: "2MB", value: 2048 },
];

const SRAM_LIMITS = [
  { label: "Any", value: 0 },
  { label: "32KB", value: 32 },
  { label: "128KB", value: 128 },
  { label: "256KB", value: 256 },
  { label: "512KB", value: 512 },
];

const ACTIVE_LIMITS = [
  { label: "Any", value: 999 },
  { label: "10mA", value: 10 },
  { label: "25mA", value: 25 },
  { label: "50mA", value: 50 },
  { label: "100mA", value: 100 },
];

function initialQuotes() {
  return Object.fromEntries(
    CHIP_PRICE_SNAPSHOTS.map((quote) => [quote.partNumber, quote])
  ) as Record<string, ChipPriceSnapshot>;
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 2 : 2,
  }).format(value);
}

function number(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function updatedLabel(value: string) {
  if (!value) return "Local catalog";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function textIncludesAll(text: string, query: string) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const haystack = text.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

function chipSearchText(chip: ChipSpec) {
  return [
    chip.name,
    chip.manufacturer,
    chip.partNumber,
    chip.category,
    chip.architecture,
    chip.core,
    chip.package,
    chip.operatingVoltage,
    chip.connectivity.join(" "),
    chip.peripherals.join(" "),
    chip.strengths.join(" "),
    chip.useCases.join(" "),
    chip.notes,
  ].join(" ");
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function includesAny(values: string[], words: string[]) {
  const combined = values.join(" ").toLowerCase();
  return hasAny(combined, words);
}

function scoreChip(chip: ChipSpec, quote: ChipPriceSnapshot, useCase: string) {
  const prompt = useCase.toLowerCase();
  const reasons: string[] = [];
  let score = 50;

  const add = (condition: boolean, points: number, reason: string) => {
    if (condition) {
      score += points;
      if (!reasons.includes(reason)) reasons.push(reason);
    }
  };

  if (!prompt.trim()) {
    score += Math.min(20, chip.coreMark / 180);
    score += quote.stock > 10000 ? 8 : 0;
    score += quote.unitPriceUsd <= 5 ? 6 : 0;
    return {
      score: Math.round(Math.min(99, score)),
      reasons: ["Balanced catalog fit", quote.stock > 0 ? "Available stock" : "Check lead time"],
    };
  }

  const chipText = chipSearchText(chip).toLowerCase();
  add(textIncludesAll(chipText, useCase), 10, "Direct keyword match");

  if (hasAny(prompt, ["iot", "sensor", "battery", "remote", "node", "logger"])) {
    add(chip.power.sleepUa <= 1, 18, "Low sleep current");
    add(chip.power.activeMa <= 15, 8, "Low active current");
    add(chip.connectivity.some((item) => ["Bluetooth LE", "Thread", "Zigbee", "Wi-Fi"].includes(item)), 12, "Built for connected nodes");
    add(chip.flashKB >= 256 || chip.psramMB !== undefined, 5, "Room for firmware growth");
  }

  if (hasAny(prompt, ["wifi", "cloud", "gateway", "mqtt", "edge"])) {
    add(chip.connectivity.includes("Wi-Fi"), 22, "Integrated Wi-Fi");
    add(chip.connectivity.includes("Ethernet"), 16, "Wired networking");
    add(chip.sramKB >= 256, 8, "Networking memory headroom");
    add(chip.clockMHz >= 150, 6, "Enough compute for gateway tasks");
  }

  if (hasAny(prompt, ["ble", "bluetooth", "wearable", "beacon", "mesh"])) {
    add(chip.connectivity.includes("Bluetooth LE"), 24, "Bluetooth LE radio");
    add(chip.power.sleepUa <= 1, 12, "Wearable sleep budget");
    add(chip.power.activeMa <= 15, 8, "Efficient active mode");
    add(chip.connectivity.includes("Thread") || chip.connectivity.includes("Zigbee"), 5, "Mesh-ready radio");
  }

  if (hasAny(prompt, ["motor", "robot", "servo", "drive", "pwm", "control", "inverter"])) {
    add(chip.connectivity.includes("CAN"), 12, "CAN for robotics buses");
    add(includesAny(chip.peripherals, ["motor-control", "high-res timer", "pwm", "op-amp", "comparator"]), 18, "Control peripherals");
    add(chip.clockMHz >= 100, 8, "Fast control loop headroom");
    add(chip.adcBits >= 12, 5, "Useful ADC resolution");
  }

  if (hasAny(prompt, ["audio", "dsp", "signal", "vision", "camera", "ml", "ai"])) {
    add(chip.coreMark >= 500, 18, "High compute score");
    add(includesAny(chip.peripherals, ["dsp", "fpu", "i2s", "audio", "camera"]), 16, "Signal-processing peripherals");
    add(chip.sramKB >= 256, 7, "Large SRAM");
    add(chip.psramMB !== undefined, 5, "External PSRAM option");
  }

  if (hasAny(prompt, ["secure", "medical", "industrial", "boot", "crypto", "safety"])) {
    add(chip.category === "Secure MCU", 14, "Security-focused MCU");
    add(includesAny(chip.peripherals, ["crypto", "trustzone", "puf", "secure"]), 12, "Hardware security");
    add(chip.connectivity.includes("CAN") || chip.connectivity.includes("Ethernet"), 6, "Industrial connectivity");
  }

  if (hasAny(prompt, ["cheap", "cost", "student", "class", "prototype", "dev board", "learning"])) {
    add(quote.unitPriceUsd <= 3, 14, "Low unit cost");
    add(chip.connectivity.includes("USB"), 7, "USB-friendly prototyping");
    add(chip.gpio >= 30, 5, "Generous GPIO");
  }

  if (hasAny(prompt, ["5v", "five volt", "mixed voltage"])) {
    add(chip.operatingVoltage.includes("5.5V"), 18, "5V-friendly supply range");
  }

  add(quote.stock > 0, 4, "In stock");
  add(quote.unitPriceUsd <= 5, 4, "Cost efficient");

  if (reasons.length === 0) {
    reasons.push("General-purpose fit");
  }

  return {
    score: Math.round(Math.max(10, Math.min(99, score))),
    reasons: reasons.slice(0, 3),
  };
}

export default function ChipsPage() {
  const [search, setSearch] = useState("");
  const [useCase, setUseCase] = useState("IoT sensor node");
  const [category, setCategory] = useState<FilterCategory>("All");
  const [connectivity, setConnectivity] = useState<FilterConnectivity>("All");
  const [maxPrice, setMaxPrice] = useState(999);
  const [minFlash, setMinFlash] = useState(0);
  const [minSram, setMinSram] = useState(0);
  const [maxActiveMa, setMaxActiveMa] = useState(999);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [quoteMap, setQuoteMap] = useState<Record<string, ChipPriceSnapshot>>(initialQuotes);
  const [feedSource, setFeedSource] = useState<PricingSource>("catalog-snapshot");
  const [feedUpdatedAt, setFeedUpdatedAt] = useState("");
  const [feedError, setFeedError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(["esp32-s3", "nrf52840"]);

  useEffect(() => {
    let active = true;

    fetch("/api/chips/pricing", { cache: "no-store" })
      .then((response) => response.json() as Promise<PricingResponse>)
      .then((data) => {
        if (!active) return;
        setQuoteMap((current) => ({ ...current, ...data.quotes }));
        setFeedSource(data.source);
        setFeedUpdatedAt(data.updatedAt);
        setFeedError(data.error || "");
      })
      .catch(() => {
        if (!active) return;
        setFeedError("Pricing refresh failed");
      });

    return () => {
      active = false;
    };
  }, []);

  const scoredChips = useMemo<ScoredChip[]>(() => {
    return CHIP_CATALOG.map((chip) => {
      const quote = quoteMap[chip.partNumber] ?? CHIP_PRICE_SNAPSHOTS[0];
      const recommendation = scoreChip(chip, quote, useCase);
      return {
        ...chip,
        quote,
        score: recommendation.score,
        reasons: recommendation.reasons,
      };
    });
  }, [quoteMap, useCase]);

  const filteredChips = useMemo(() => {
    return scoredChips
      .filter((chip) => {
        const matchesSearch = textIncludesAll(chipSearchText(chip), search);
        const matchesCategory = category === "All" || chip.category === category;
        const matchesConnectivity = connectivity === "All" || chip.connectivity.includes(connectivity);
        const matchesPrice = chip.quote.unitPriceUsd <= maxPrice;
        const matchesFlash = chip.flashKB >= minFlash;
        const matchesSram = chip.sramKB >= minSram;
        const matchesPower = chip.power.activeMa <= maxActiveMa;
        const matchesStock = !inStockOnly || chip.quote.stock > 0;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesConnectivity &&
          matchesPrice &&
          matchesFlash &&
          matchesSram &&
          matchesPower &&
          matchesStock
        );
      })
      .sort((a, b) => b.score - a.score || a.quote.unitPriceUsd - b.quote.unitPriceUsd);
  }, [category, connectivity, inStockOnly, maxActiveMa, maxPrice, minFlash, minSram, scoredChips, search]);

  const selectedChips = useMemo(() => {
    return selectedIds
      .map((id) => scoredChips.find((chip) => chip.id === id))
      .filter((chip): chip is ScoredChip => chip !== undefined);
  }, [scoredChips, selectedIds]);

  const bestChip = filteredChips[0];
  const averagePrice =
    filteredChips.length > 0
      ? filteredChips.reduce((sum, chip) => sum + chip.quote.unitPriceUsd, 0) / filteredChips.length
      : 0;
  const inStockCount = filteredChips.filter((chip) => chip.quote.stock > 0).length;

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current.slice(-3), id];
    });
  }

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setConnectivity("All");
    setMaxPrice(999);
    setMinFlash(0);
    setMinSram(0);
    setMaxActiveMa(999);
    setInStockOnly(true);
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.75rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,_rgba(124,247,212,0.16),_transparent_28%),linear-gradient(135deg,_rgba(11,25,39,0.98),_rgba(8,16,25,0.96))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.9fr]">
          <div className="space-y-6">
            <span className="tech-badge">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(124,247,212,0.9)]" />
              Chip/MCU Comparison Engine
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-mono text-3xl font-semibold uppercase tracking-[0.12em] text-slate-50 sm:text-4xl">
                Pick silicon from requirements, not vibes.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Search MCU specs, price, stock, memory, connectivity, power draw,
                and use-case fit from one embedded systems workbench.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Catalog" value={CHIP_CATALOG.length} detail="MCUs indexed" />
              <MetricCard label="Matches" value={filteredChips.length} detail={`${inStockCount} in stock`} />
              <MetricCard label="Avg Price" value={filteredChips.length ? currency(averagePrice) : "--"} detail="visible set" />
              <MetricCard label="Quote Feed" value={feedSource === "live" ? "Live" : "Local"} detail={updatedLabel(feedUpdatedAt)} />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-cyan-300/12 bg-slate-950/55 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300/75">
                  Best Fit
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-50">
                  {bestChip ? bestChip.name : "No match"}
                </h2>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-100">
                {bestChip ? `${bestChip.score}%` : "--"}
              </span>
            </div>

            {bestChip ? (
              <div className="mt-5 space-y-4">
                <div className="h-2.5 rounded-full bg-white/6">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400"
                    style={{ width: `${bestChip.score}%` }}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Signal label="Part" value={bestChip.partNumber} />
                  <Signal label="Price" value={currency(bestChip.quote.unitPriceUsd)} />
                  <Signal label="Stock" value={number(bestChip.quote.stock)} />
                  <Signal label="Power" value={`${bestChip.power.activeMa}mA active`} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {bestChip.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-400">
                No chips match the current filter stack.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
                Use Case Input
              </p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">Recommendation prompt</h2>
            </div>
            <button
              type="button"
              onClick={() => setUseCase("")}
              className="self-start rounded-xl border border-slate-600/60 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Clear
            </button>
          </div>
          <textarea
            value={useCase}
            onChange={(event) => setUseCase(event.target.value)}
            rows={4}
            placeholder="IoT sensor node with BLE, coin-cell battery, and low sleep current"
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {USE_CASE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setUseCase(preset)}
                className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:border-cyan-300/35"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
                Filters
              </p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">Spec constraints</h2>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-600/60 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Reset
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="STM32, BLE, CAN, low power..."
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none"
              />
            </label>

            <FilterSelect label="Category" value={category} onChange={(value) => setCategory(value as FilterCategory)}>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="Connectivity" value={connectivity} onChange={(value) => setConnectivity(value as FilterConnectivity)}>
              <option value="All">All</option>
              {CONNECTIVITY_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="Max Price" value={String(maxPrice)} onChange={(value) => setMaxPrice(Number(value))}>
              {PRICE_LIMITS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="Min Flash" value={String(minFlash)} onChange={(value) => setMinFlash(Number(value))}>
              {FLASH_LIMITS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="Min SRAM" value={String(minSram)} onChange={(value) => setMinSram(Number(value))}>
              {SRAM_LIMITS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FilterSelect>

            <FilterSelect label="Max Active" value={String(maxActiveMa)} onChange={(value) => setMaxActiveMa(Number(value))}>
              {ACTIVE_LIMITS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </FilterSelect>

            <label className="flex min-h-[4.3rem] items-center justify-between gap-3 rounded-xl border border-cyan-300/12 bg-slate-950/45 px-4 py-3">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Availability</span>
                <span className="mt-1 block text-sm text-slate-200">In-stock parts</span>
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
                className="h-5 w-5 rounded border-cyan-300/30"
              />
            </label>
          </div>

          {feedError && (
            <p className="mt-3 rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
              {feedError}
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
                Results
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-50">
                {filteredChips.length} matching parts
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Quote source: {feedSource === "live" ? "live provider" : "catalog snapshot"}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredChips.map((chip) => (
              <ChipCard
                key={chip.id}
                chip={chip}
                selected={selectedIds.includes(chip.id)}
                onToggle={() => toggleSelected(chip.id)}
              />
            ))}
          </div>

          {filteredChips.length === 0 && (
            <div className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 px-6 py-12 text-center">
              <p className="font-mono text-sm uppercase tracking-[0.24em] text-slate-400">
                No matching silicon
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
              Recommendation Stack
            </p>
            <div className="mt-4 space-y-3">
              {filteredChips.slice(0, 5).map((chip, index) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => toggleSelected(chip.id)}
                  className="w-full rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-left hover:border-cyan-300/25"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-300/70">
                        Rank {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 font-semibold text-slate-50">{chip.name}</p>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-100">
                      {chip.score}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {chip.reasons.join(" / ")}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
                  Compare Bench
                </p>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">
                  {selectedChips.length}/4 selected
                </h2>
              </div>
              {selectedChips.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="rounded-xl border border-slate-600/60 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-4 space-y-3">
              {selectedChips.map((chip) => (
                <div
                  key={chip.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/45 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-50">{chip.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{chip.partNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSelected(chip.id)}
                    className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100 hover:border-cyan-300/40"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {selectedChips.length === 0 && (
                <p className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 p-4 text-sm text-slate-400">
                  Add parts from the result cards to build a side-by-side matrix.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <CompareMatrix chips={selectedChips} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/18 bg-cyan-400/10 p-4 text-cyan-100">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-50">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{detail}</p>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-semibold text-slate-50">{value}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function ChipCard({
  chip,
  selected,
  onToggle,
}: {
  chip: ScoredChip;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/8 bg-slate-950/45 p-5 hover:border-cyan-300/25">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cyan-300/70">
            {chip.manufacturer}
          </p>
          <h3 className="mt-2 truncate text-lg font-semibold text-slate-50">{chip.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{chip.partNumber}</p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 font-mono text-sm text-cyan-100">
          MCU
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        <MiniSpec label="Clock" value={`${chip.clockMHz}MHz`} />
        <MiniSpec label="Flash" value={chip.flashKB > 0 ? `${chip.flashKB}KB` : "External"} />
        <MiniSpec label="SRAM" value={`${chip.sramKB}KB`} />
        <MiniSpec label="Active" value={`${chip.power.activeMa}mA`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {chip.connectivity.slice(0, 6).map((item) => (
          <span
            key={item}
            className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-50">{currency(chip.quote.unitPriceUsd)}</p>
            <p className="mt-1 text-xs text-slate-400">
              {chip.quote.distributor} / {chip.quote.packaging}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-200">{number(chip.quote.stock)}</p>
            <p className="mt-1 text-xs text-slate-400">{chip.quote.leadTimeWeeks}wk lead</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-300">Use-case match</span>
          <span className="font-mono text-cyan-100">{chip.score}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/6">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400"
            style={{ width: `${chip.score}%` }}
          />
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">{chip.notes}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {chip.category}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            selected
              ? "border border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
              : "border border-cyan-300/30 bg-cyan-400 px-4 text-slate-950 hover:bg-cyan-300"
          }`}
        >
          {selected ? "Selected" : "Compare"}
        </button>
      </div>
    </article>
  );
}

function MiniSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-3">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-50">{value}</p>
    </div>
  );
}

function CompareMatrix({ chips }: { chips: ScoredChip[] }) {
  const rows = [
    { label: "Price", render: (chip: ScoredChip) => currency(chip.quote.unitPriceUsd) },
    { label: "Stock", render: (chip: ScoredChip) => number(chip.quote.stock) },
    { label: "Core", render: (chip: ScoredChip) => chip.core },
    { label: "Clock", render: (chip: ScoredChip) => `${chip.clockMHz}MHz` },
    { label: "CoreMark", render: (chip: ScoredChip) => number(chip.coreMark) },
    { label: "Flash", render: (chip: ScoredChip) => chip.flashKB > 0 ? `${chip.flashKB}KB` : "External" },
    { label: "SRAM", render: (chip: ScoredChip) => `${chip.sramKB}KB` },
    { label: "Active", render: (chip: ScoredChip) => `${chip.power.activeMa}mA` },
    { label: "Sleep", render: (chip: ScoredChip) => `${chip.power.sleepUa}uA` },
    { label: "Connectivity", render: (chip: ScoredChip) => chip.connectivity.join(", ") },
    { label: "Package", render: (chip: ScoredChip) => chip.package },
  ];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
            Comparison Matrix
          </p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">Selected MCU specs</h2>
        </div>
        <p className="text-sm text-slate-400">{chips.length} parts on bench</p>
      </div>

      {chips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cyan-300/20 bg-slate-950/30 px-6 py-10 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-slate-400">
            Empty compare bench
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-cyan-300/15 bg-slate-950 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                  Spec
                </th>
                {chips.map((chip) => (
                  <th key={chip.id} className="border-b border-cyan-300/15 bg-slate-950 px-4 py-3">
                    <p className="font-semibold text-slate-50">{chip.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{chip.partNumber}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th className="sticky left-0 z-10 border-b border-white/8 bg-slate-950/95 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300/70">
                    {row.label}
                  </th>
                  {chips.map((chip) => (
                    <td key={`${chip.id}-${row.label}`} className="border-b border-white/8 bg-slate-950/45 px-4 py-3 text-sm text-slate-200">
                      {row.render(chip)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
