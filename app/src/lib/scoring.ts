import { PILLARS } from "./pillars";

export interface GrantResult {
  title: string;
  url: string;
  description: string;
  source: string;
  pillarScores: Record<string, number>;
  topPillar: string;
  topPillarScore: number;
  totalRelevance: number;
}

/**
 * Score a piece of text against all Sewa pillars using keyword matching.
 * Returns a map of pillar_id -> score (0 to 1).
 */
export function scorePillars(
  text: string
): Record<string, number> {
  const lowerText = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const pillar of PILLARS) {
    let matchCount = 0;
    for (const keyword of pillar.keywords) {
      // Use word-boundary-aware matching
      const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    }
    // Normalize: cap at 1.0, scale so ~5 keyword matches = 1.0
    scores[pillar.id] = Math.min(matchCount / 5, 1.0);
  }

  return scores;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Transform Brave Search API results into scored grant results.
 */
export function processSearchResults(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  braveResults: any[]
): GrantResult[] {
  return braveResults
    .map((result) => {
      const combinedText = `${result.title || ""} ${result.description || ""}`;
      const pillarScores = scorePillars(combinedText);

      // Find top pillar
      let topPillar = "";
      let topPillarScore = 0;
      let totalRelevance = 0;

      for (const [pillarId, score] of Object.entries(pillarScores)) {
        totalRelevance += score;
        if (score > topPillarScore) {
          topPillarScore = score;
          topPillar = pillarId;
        }
      }

      return {
        title: result.title || "Untitled",
        url: result.url || "",
        description: result.description || "",
        source: extractDomain(result.url || ""),
        pillarScores,
        topPillar,
        topPillarScore,
        totalRelevance,
      };
    })
    .sort((a, b) => b.totalRelevance - a.totalRelevance);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
