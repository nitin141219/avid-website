import { NextResponse } from "next/server";

const ALLOWED_STRATEGIES = new Set(["mobile", "desktop"]);
const ALLOWED_CATEGORIES = new Set([
  "performance",
  "accessibility",
  "best-practices",
  "seo",
  "pwa",
]);

const DEFAULT_CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

function toScore(value?: number) {
  if (typeof value !== "number") return null;
  return Math.round(value * 100);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const siteUrl = searchParams.get("url") || process.env.NEXT_PUBLIC_BASE_URL;
  if (!siteUrl) {
    return NextResponse.json(
      {
        message:
          "Missing `url` query param and NEXT_PUBLIC_BASE_URL is not set in environment.",
      },
      { status: 400 }
    );
  }

  const strategyParam = (searchParams.get("strategy") || "mobile").toLowerCase();
  if (!ALLOWED_STRATEGIES.has(strategyParam)) {
    return NextResponse.json(
      { message: "Invalid `strategy`. Allowed values: mobile, desktop." },
      { status: 400 }
    );
  }

  const categoriesFromQuery = searchParams
    .getAll("category")
    .map((category) => category.toLowerCase())
    .filter((category) => ALLOWED_CATEGORIES.has(category));
  const categories = categoriesFromQuery.length > 0 ? categoriesFromQuery : DEFAULT_CATEGORIES;

  const psiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  psiUrl.searchParams.set("url", siteUrl);
  psiUrl.searchParams.set("strategy", strategyParam);
  categories.forEach((category) => psiUrl.searchParams.append("category", category));

  const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY;
  if (apiKey) {
    psiUrl.searchParams.set("key", apiKey);
  }

  try {
    const res = await fetch(psiUrl.toString(), { cache: "no-store" });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      return NextResponse.json(
        {
          message: "Failed to fetch PageSpeed report.",
          details: data?.error?.message || "Unexpected response from API.",
        },
        { status: res.status || 500 }
      );
    }

    const categoriesData = data?.lighthouseResult?.categories || {};
    const summary = {
      performance: toScore(categoriesData.performance?.score),
      accessibility: toScore(categoriesData.accessibility?.score),
      bestPractices: toScore(categoriesData["best-practices"]?.score),
      seo: toScore(categoriesData.seo?.score),
      pwa: toScore(categoriesData.pwa?.score),
    };

    return NextResponse.json({
      requested: {
        url: siteUrl,
        strategy: strategyParam,
        categories,
      },
      summary,
      fetchedAt: new Date().toISOString(),
      lighthouseVersion: data?.lighthouseResult?.lighthouseVersion || null,
      finalUrl: data?.lighthouseResult?.finalDisplayedUrl || null,
      fullReport: data,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Internal Server Error while requesting PageSpeed Insights.",
      },
      { status: 500 }
    );
  }
}
