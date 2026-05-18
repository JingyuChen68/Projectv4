import { NextResponse } from "next/server";
import {
  CHIP_PRICE_SNAPSHOTS,
  type ChipPriceSnapshot,
} from "@/data/chipCatalog";

// newly added chip
export const dynamic = "force-dynamic";

type QuoteMap = Record<string, ChipPriceSnapshot>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function fallbackQuotes(updatedAt: string): QuoteMap {
  return Object.fromEntries(
    CHIP_PRICE_SNAPSHOTS.map((quote) => [
      quote.partNumber,
      {
        ...quote,
        updatedAt,
      },
    ])
  );
}

function rawQuotesFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const quotes = payload.quotes;
  if (Array.isArray(quotes)) return quotes;
  if (isRecord(quotes)) return Object.values(quotes);

  return [];
}

function normalizeQuote(raw: unknown, updatedAt: string): ChipPriceSnapshot | null {
  if (!isRecord(raw)) return null;

  const partNumber = asString(raw.partNumber ?? raw.part_number ?? raw.mpn ?? raw.sku);
  if (!partNumber) return null;

  return {
    partNumber,
    distributor: asString(raw.distributor ?? raw.seller ?? raw.supplier, "Live supplier"),
    unitPriceUsd: asNumber(raw.unitPriceUsd ?? raw.unit_price_usd ?? raw.price ?? raw.unitPrice, 0),
    stock: Math.max(0, Math.round(asNumber(raw.stock ?? raw.quantity ?? raw.inventory, 0))),
    leadTimeWeeks: Math.max(0, Math.round(asNumber(raw.leadTimeWeeks ?? raw.lead_time_weeks ?? raw.leadTime, 0))),
    packaging: asString(raw.packaging ?? raw.packageType, "Unknown"),
    source: asString(raw.source, "live provider"),
    updatedAt: asString(raw.updatedAt ?? raw.updated_at, updatedAt),
  };
}

async function fetchLiveQuotes(updatedAt: string): Promise<QuoteMap> {
  const endpoint = process.env.CHIP_PRICING_ENDPOINT;
  if (!endpoint) return {};

  const headers: HeadersInit = {
    accept: "application/json",
  };

  if (process.env.CHIP_PRICING_TOKEN) {
    headers.authorization = `Bearer ${process.env.CHIP_PRICING_TOKEN}`;
  }

  const response = await fetch(endpoint, {
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Pricing provider returned ${response.status}`);
  }

  const payload: unknown = await response.json();
  const quotes = rawQuotesFromPayload(payload);
  const normalized = quotes
    .map((quote) => normalizeQuote(quote, updatedAt))
    .filter((quote): quote is ChipPriceSnapshot => quote !== null);

  return Object.fromEntries(normalized.map((quote) => [quote.partNumber, quote]));
}

export async function GET() {
  const updatedAt = new Date().toISOString();
  const fallback = fallbackQuotes(updatedAt);

  try {
    const liveQuotes = await fetchLiveQuotes(updatedAt);
    const hasLiveQuotes = Object.keys(liveQuotes).length > 0;

    return NextResponse.json({
      quotes: {
        ...fallback,
        ...liveQuotes,
      },
      source: hasLiveQuotes ? "live" : "catalog-snapshot",
      updatedAt,
    });
  } catch (error) {
    console.error("Chip pricing feed failed:", error);
    return NextResponse.json({
      quotes: fallback,
      source: "catalog-snapshot",
      updatedAt,
      error: "Live pricing feed unavailable",
    });
  }
}
