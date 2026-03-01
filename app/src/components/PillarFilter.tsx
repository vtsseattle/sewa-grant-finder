"use client";

import { PILLARS } from "../lib/pillars";

interface PillarFilterProps {
  selected: string;
  onChange: (value: string) => void;
}

export default function PillarFilter({ selected, onChange }: PillarFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Sewa Pillar
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
      >
        <option value="">All Pillars</option>
        {PILLARS.map((pillar) => (
          <option key={pillar.id} value={pillar.id}>
            {pillar.name}
          </option>
        ))}
      </select>
    </div>
  );
}
