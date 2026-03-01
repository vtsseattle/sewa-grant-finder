"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import PillarFilter from "../components/PillarFilter";
import LocationFilter from "../components/LocationFilter";
import GrantCard from "../components/GrantCard";
import { GrantResult } from "../lib/scoring";

export default function Home() {
  const [results, setResults] = useState<GrantResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  const [includeIndian, setIncludeIndian] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    setError("");
    setHasSearched(true);

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedPillar) params.set("pillar", selectedPillar);
    if (selectedState) params.set("state", selectedState);
    if (city) params.set("city", city);
    params.set("indian", includeIndian.toString());

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed");
        setResults([]);
      } else {
        setResults(data.results || []);
      }
    } catch {
      setError("Failed to connect to search API");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sewa Grant Finder
              </h1>
              <p className="text-sm text-gray-500">
                Discover grants aligned with Sewa International&apos;s pillars
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PillarFilter
              selected={selectedPillar}
              onChange={setSelectedPillar}
            />
            <LocationFilter
              selectedState={selectedState}
              onStateChange={setSelectedState}
              city={city}
              onCityChange={setCity}
            />
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeIndian}
                  onChange={(e) => setIncludeIndian(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  Include Indian-origin foundations
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">
              Searching for grants matching Sewa&apos;s pillars...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {results.length > 0
                  ? `${results.length} grants found`
                  : "No grants found"}
              </h2>
              {searchQuery && (
                <span className="text-sm text-gray-500">
                  Ranked by pillar relevance
                </span>
              )}
            </div>

            <div className="space-y-4">
              {results.map((grant, index) => (
                <GrantCard key={index} grant={grant} rank={index + 1} />
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No matching grants found.</p>
                <p className="mt-2">
                  Try broadening your search or removing filters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Welcome state */}
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Find Grants for Sewa&apos;s Mission
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-6">
              Search for US grants under $1M that align with Sewa
              International&apos;s six pillars: Disaster Response, Education,
              Family Services, Women Empowerment, Volunteer Development, and
              Policy Research.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "disaster relief grants for nonprofits",
                "education grants for underserved youth",
                "family wellness community health grants",
                "women empowerment foundation grants",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm hover:bg-orange-100 transition border border-orange-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Sewa Grant Finder — Built for{" "}
          <a
            href="https://www.sewausa.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            Sewa International USA
          </a>
        </div>
      </footer>
    </div>
  );
}
