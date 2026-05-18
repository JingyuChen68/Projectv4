import { NextResponse } from "next/server";
import {
  CURATED_TREND_SIGNALS,
  TREND_SOURCE_QUERIES,
  type IndustryTrendSignal,
  type TrendDomain,
  type TrendMomentum,
  type TrendSignalType,
} from "@/data/industryTrends";
// added
export const dynamic = "force-dynamic";

interface FeedFetchResult {
  domain: TrendDomain;
  items: IndustryTrendSignal[];
  ok: boolean;
}

const SIGNAL_KEYWORDS: { type: TrendSignalType; words: string[] }[] = [
  {
    type: "Chip Release",
    words: ["chip", "processor", "gpu", "mcu", "soc", "accelerator", "npu", "hbm"],
  },
  {
    type: "Supply Chain",
    words: ["supply", "fab", "foundry", "tariff", "export", "capacity", "shortage"],
  },
  {
    type: "Company Move",
    words: ["acquires", "partners", "investment", "funding", "launches", "announces"],
  },
  {
    type: "Standards",
    words: ["standard", "certification", "compliance", "iec", "opc ua", "tsn", "ucie"],
  },
];

const MOMENTUM_WORDS: { momentum: TrendMomentum; words: string[] }[] = [
  {
    momentum: "Accelerating",
    words: ["launch", "raises", "expands", "surge", "growth", "deploys", "adoption"],
  },
  {
    momentum: "Emerging",
    words: ["startup", "prototype", "pilot", "unveils", "develops", "research"],
  },
];

function googleNewsRssUrl(query: string) {
  const params = new URLSearchParams({
    q: query,
    hl: "en-US",
    gl: "US",
    ceid: "US:en",
  });

  return `https://news.google.com/rss/search?${params.toString()}`;
}

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripTags(match[1]) : "";
}

function domainKeywords(domain: TrendDomain) {
  return TREND_SOURCE_QUERIES.find((source) => source.domain === domain)?.keywords ?? [];
}

function classifySignalType(text: string): TrendSignalType {
  const lower = text.toLowerCase();
  return SIGNAL_KEYWORDS.find(({ words }) => words.some((word) => lower.includes(word)))?.type ?? "Emerging Tech";
}

function classifyMomentum(text: string): TrendMomentum {
  const lower = text.toLowerCase();
  return MOMENTUM_WORDS.find(({ words }) => words.some((word) => lower.includes(word)))?.momentum ?? "Watching";
}

function tagMatches(text: string, tags: string[]) {
  const lower = text.toLowerCase();
  return tags.filter((tag) => lower.includes(tag.toLowerCase())).slice(0, 5);
}

function sourceFromTitle(title: string) {
  const parts = title.split(" - ");
  if (parts.length < 2) return "Google News";
  return parts[parts.length - 1].trim() || "Google News";
}

function cleanTitle(title: string) {
  const parts = title.split(" - ");
  return (parts.length > 1 ? parts.slice(0, -1).join(" - ") : title).trim();
}

function impactFor(signalType: TrendSignalType, domain: TrendDomain) {
  if (signalType === "Supply Chain") {
    return "Watch availability, lead times, alternate parts, and architecture portability.";
  }

  if (signalType === "Chip Release") {
    return "Compare performance, power, memory bandwidth, toolchains, and production readiness.";
  }

  if (signalType === "Standards") {
    return "Track compliance, interoperability, and the skills employers may start screening for.";
  }

  if (domain === "Robotics") {
    return "Look for implications across perception, controls, safety, and deployment cost.";
  }

  if (domain === "Automation") {
    return "Look for plant integration, uptime, cybersecurity, and maintenance impacts.";
  }

  return "Track whether this changes architecture choices, hiring needs, or product roadmaps.";
}

function horizonFor(signalType: TrendSignalType, momentum: TrendMomentum) {
  if (signalType === "Chip Release" || momentum === "Accelerating") return "Now";
  if (momentum === "Emerging") return "Next 12 months";
  return "2-5 years";
}

function normalizeFeedItem(item: string, domain: TrendDomain, index: number): IndustryTrendSignal | null {
  const rawTitle = extractTag(item, "title");
  const link = extractTag(item, "link");
  const publishedAt = extractTag(item, "pubDate");
  const description = extractTag(item, "description");

  if (!rawTitle || !link) return null;

  const title = cleanTitle(rawTitle);
  const sourceName = sourceFromTitle(rawTitle);
  const combined = `${title} ${description}`;
  const signalType = classifySignalType(combined);
  const momentum = classifyMomentum(combined);
  const tags = tagMatches(combined, [
    ...domainKeywords(domain),
    "AI",
    "edge AI",
    "RISC-V",
    "chiplet",
    "supply chain",
    "ROS 2",
    "OPC UA",
    "automation",
    "robotics",
  ]);

  return {
    id: `${domain.toLowerCase()}-${index}-${encodeURIComponent(title).slice(0, 52)}`,
    title,
    summary:
      description ||
      "A live industry signal matched against the dashboard watchlist for semiconductors, robotics, and automation.",
    domain,
    signalType,
    momentum,
    horizon: horizonFor(signalType, momentum),
    impact: impactFor(signalType, domain),
    tags: tags.length ? tags : domainKeywords(domain).slice(0, 3),
    sourceName,
    sourceUrl: link,
    publishedAt,
  };
}

function parseRss(xml: string, domain: TrendDomain) {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  return itemMatches
    .map((item, index) => normalizeFeedItem(item, domain, index))
    .filter((item): item is IndustryTrendSignal => item !== null)
    .slice(0, 8);
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "EmbedPrep-Trends/1.0",
      },
      next: { revalidate: 1800 },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Feed returned ${response.status}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchDomainFeed(source: (typeof TREND_SOURCE_QUERIES)[number]): Promise<FeedFetchResult> {
  try {
    const xml = await fetchWithTimeout(googleNewsRssUrl(source.query));
    return {
      domain: source.domain,
      items: parseRss(xml, source.domain),
      ok: true,
    };
  } catch (error) {
    console.error(`Industry trend feed failed for ${source.domain}:`, error);
    return {
      domain: source.domain,
      items: [],
      ok: false,
    };
  }
}

function dedupeByTitle(items: IndustryTrendSignal[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortByPublishedAt(items: IndustryTrendSignal[]) {
  return [...items].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

function buildSummary(signals: IndustryTrendSignal[]) {
  const domainCounts = signals.reduce<Record<string, number>>((acc, item) => {
    acc[item.domain] = (acc[item.domain] || 0) + 1;
    return acc;
  }, {});

  const topDomain =
    Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Cross-industry";

  const accelerating = signals.filter((item) => item.momentum === "Accelerating").length;
  const supply = signals.filter((item) => item.signalType === "Supply Chain").length;
  const topTags = signals
    .flatMap((item) => item.tags)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const watchlist = Object.entries(topTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);

  return [
    `${topDomain} has the strongest signal density in the current feed.`,
    `${accelerating} items are marked as accelerating; prioritize these for near-term interview and portfolio talking points.`,
    supply
      ? `${supply} supply-chain items are present, so track second-source planning and component availability.`
      : "No supply-chain-heavy item dominates this refresh; focus on architecture and technology adoption signals.",
    watchlist.length ? `Watchlist terms: ${watchlist.join(", ")}.` : "Watchlist terms will appear as the feed refreshes.",
  ];
}

function fallbackSignals(updatedAt: string) {
  return CURATED_TREND_SIGNALS.map((signal) => ({
    ...signal,
    publishedAt: signal.publishedAt ?? updatedAt,
  }));
}

export async function GET() {
  const updatedAt = new Date().toISOString();
  const feedResults = await Promise.all(TREND_SOURCE_QUERIES.map(fetchDomainFeed));
  const liveSignals = sortByPublishedAt(dedupeByTitle(feedResults.flatMap((result) => result.items))).slice(0, 18);
  const hasLiveSignals = liveSignals.length > 0;
  const curatedSignals = fallbackSignals(updatedAt);
  const signals = hasLiveSignals
    ? dedupeByTitle([...liveSignals, ...curatedSignals])
    : curatedSignals;

  return NextResponse.json({
    signals,
    source: hasLiveSignals ? "live-rss" : "curated-fallback",
    updatedAt,
    summary: buildSummary(signals),
    trackedSources: TREND_SOURCE_QUERIES.map((source) => ({
      domain: source.domain,
      query: source.query,
      ok: feedResults.find((result) => result.domain === source.domain)?.ok ?? false,
    })),
  });
}
