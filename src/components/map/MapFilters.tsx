'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';

export interface FilterState {
  seats: boolean;    // 空席あり
  quiet: boolean;    // 静か
  wifi: boolean;     // Wi-Fiあり
  power: boolean;    // 電源あり
}

interface MapFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function MapFilters({ filters, onChange }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = [
    { key: 'seats' as const, label: '空席あり', emoji: '🪑' },
    { key: 'quiet' as const, label: '静か', emoji: '🔇' },
    { key: 'wifi' as const, label: 'Wi-Fiあり', emoji: '📶' },
    { key: 'power' as const, label: '電源あり', emoji: '🔌' },
  ];

  const toggleFilter = (key: keyof FilterState) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const clearFilters = () => {
    onChange({
      seats: false,
      quiet: false,
      wifi: false,
      power: false,
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="absolute left-4 top-4 z-[1000]">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg transition hover:bg-gray-50"
      >
        <Filter size={20} className="text-gray-700" />
        <span className="font-medium text-gray-900">フィルター</span>
        {activeFilterCount > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-2 w-64 rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">絞り込み条件</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                クリア
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filterOptions.map((option) => (
              <label
                key={option.key}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={filters[option.key]}
                  onChange={() => toggleFilter(option.key)}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xl">{option.emoji}</span>
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-600">
              {activeFilterCount === 0
                ? 'すべてのカフェを表示'
                : `${activeFilterCount}個の条件で絞り込み中`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
