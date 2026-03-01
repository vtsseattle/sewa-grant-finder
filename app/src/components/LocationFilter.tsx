"use client";

import { US_STATES } from "../lib/pillars";

interface LocationFilterProps {
  selectedState: string;
  onStateChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
}

export default function LocationFilter({
  selectedState,
  onStateChange,
  city,
  onCityChange,
}: LocationFilterProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
        >
          <option value="">All States</option>
          {US_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City (optional)
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="e.g., Houston"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-400"
        />
      </div>
    </>
  );
}
