import { NextRequest, NextResponse } from "next/server";
import { processSearchResults } from "../../../lib/scoring";

const BRAVE_API_URL = "https://api.search.brave.com/res/v1/web/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const pillar = searchParams.get("pillar") || "";
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";
  const includeIndian = searchParams.get("indian") !== "false";

  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "BRAVE_API_KEY not configured. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  // Build the search query
  const searchQuery = buildSearchQuery(query, pillar, state, city, includeIndian);

  try {
    const response = await fetch(
      `${BRAVE_API_URL}?q=${encodeURIComponent(searchQuery)}&count=20&country=US`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Brave API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const webResults = data.web?.results || [];

    // Score and rank results against Sewa pillars
    const scoredResults = processSearchResults(webResults);

    return NextResponse.json({
      query: searchQuery,
      results: scoredResults,
      total: scoredResults.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search for grants. Please try again." },
      { status: 500 }
    );
  }
}

function buildSearchQuery(
  query: string,
  pillar: string,
  state: string,
  city: string,
  includeIndian: boolean
): string {
  const parts: string[] = [];

  // Base: always searching for grants for nonprofits
  if (query) {
    parts.push(query);
  }

  // Grant-specific terms
  parts.push("grant OR funding OR foundation");
  parts.push("nonprofit OR NGO OR 501c3");

  // Pillar-specific keywords
  const pillarKeywords: Record<string, string> = {
    disaster_response: "disaster relief emergency humanitarian",
    education: "education literacy after-school youth academic",
    family_services: "family health wellness community services",
    women_empowerment: "women empowerment gender equality skills",
    volunteer_development: "volunteer community service civic engagement",
    policy_research: "policy research advocacy community assessment",
  };

  if (pillar && pillarKeywords[pillar]) {
    parts.push(pillarKeywords[pillar]);
  }

  // Location filtering
  if (city) {
    parts.push(`"${city}"`);
  }
  if (state) {
    parts.push(`"${state}"`);
  }

  // US-focused
  parts.push("United States");

  // Under $1M preference
  parts.push("small grant OR community grant");

  // Indian-origin foundations
  if (includeIndian) {
    parts.push(
      'OR "Indian American" OR "South Asian" OR "Hindu" OR "Indian foundation"'
    );
  }

  return parts.join(" ");
}
