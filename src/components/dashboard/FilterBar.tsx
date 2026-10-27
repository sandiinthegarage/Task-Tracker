"use client";

import { useState, useRef } from "react";

interface FilterBarProps {
  keyword: string;
  onSearch: (v: string) => void;
  onFilter: (filters: { status?: string; priority?: string; category?: string }) => void;
  allCategories: string[];
}

const STATUS_FILTERS = [
  { key: "", label: "Semua" },
  { key: "todo", label: "Akan Dikerjakan" },
  { key: "doing", label: "Sedang Dikerjakan" },
  { key: "done", label: "Selesai" },
];

const PRIORITY_FILTERS = [
  { key: "", label: "Semua" },
  { key: "low", label: "Rendah" },
  { key: "medium", label: "Sedang" },
  { key: "high", label: "Tinggi" },
];

export default function FilterBar({
  keyword,
  onSearch,
  onFilter,
  allCategories,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(keyword);
  const [activeStatus, setActiveStatus] = useState("");
  const [activePriority, setActivePriority] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onSearch(value);
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    onFilter({ status });
  };

  const handlePriorityChange = (priority: string) => {
    setActivePriority(priority);
    onFilter({ priority });
  };

  const uniqueCategories = Array.from(new Set(allCategories.filter(Boolean))).sort();

  return (
    <div className="space-y-4">
      <input
        ref={searchRef}
        type="text"
        value={searchInput}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="🔍 Pencarian..."
        className="w-full border-3 border-fg p-3 font-bold text-base rounded-none focus:outline-none focus:shadow-brutal min-h-[48px]"
      />

      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold mb-2 uppercase text-gray-500">Status</p>
          <div className="flex gap-1 overflow-x-auto md:flex-wrap pb-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleStatusChange(f.key)}
                className={`px-2 py-1 text-xs font-bold border-2 rounded-none whitespace-nowrap flex-shrink-0 md:flex-shrink ${
                  activeStatus === f.key ? "bg-fg text-bg shadow-brutal" : "border-2 border-fg bg-gray-50 text-fg"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold mb-2 uppercase text-gray-500">Prioritas</p>
          <div className="flex gap-1 overflow-x-auto md:flex-wrap pb-2">
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handlePriorityChange(f.key)}
                className={`px-2 py-1 text-xs font-bold border-2 rounded-none whitespace-nowrap flex-shrink-0 md:flex-shrink ${
                  activePriority === f.key ? "bg-fg text-bg shadow-brutal" : "border-2 border-fg bg-gray-50 text-fg"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
