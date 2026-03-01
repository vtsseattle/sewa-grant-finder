"use client";

import { GrantResult } from "../lib/scoring";
import { PILLARS } from "../lib/pillars";

interface GrantCardProps {
  grant: GrantResult;
  rank: number;
}

export default function GrantCard({ grant, rank }: GrantCardProps) {
  const topPillarObj = PILLARS.find((p) => p.id === grant.topPillar);

  // Get pillars with non-zero scores, sorted descending
  const activePillars = Object.entries(grant.pillarScores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({
      pillar: PILLARS.find((p) => p.id === id),
      score,
    }))
    .filter((item) => item.pillar);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-5">
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title & Source */}
          <div className="flex items-start justify-between gap-2">
            <a
              href={grant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-700 hover:text-blue-800 hover:underline line-clamp-2"
            >
              {grant.title}
            </a>
            {topPillarObj && (
              <span
                className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: topPillarObj.color }}
              >
                {topPillarObj.name}
              </span>
            )}
          </div>

          {/* Source domain */}
          <p className="text-xs text-gray-400 mt-1">{grant.source}</p>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {grant.description}
          </p>

          {/* Pillar scores bar */}
          {activePillars.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activePillars.map(({ pillar, score }) => (
                <div key={pillar!.id} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: pillar!.color }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {pillar!.name}
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(score * 100)}%`,
                        backgroundColor: pillar!.color,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
