'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Cafe, Report, CafeWithReports } from '@/types';
import { apiClient } from '@/lib/api/client';
import { ReportCard } from './ReportCard';
import { getFreshnessLevel } from '@/lib/utils/freshness';

interface CafeDetailModalProps {
  cafe: Cafe;
  onClose: () => void;
}

export function CafeDetailModal({ cafe, onClose }: CafeDetailModalProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiClient.getCafe(cafe.id);
        const cafeData = response.data as CafeWithReports;
        setReports(cafeData?.reports || []);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [cafe.id]);

  const freshness = getFreshnessLevel(cafe.latestReport?.createdAt || null);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{cafe.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{cafe.address}</p>
              {cafe.latestReport && (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    freshness === 'fresh' ? 'bg-green-500' :
                    freshness === 'stale' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-600">
                    {freshness === 'fresh' ? '最新情報（3時間以内）' :
                     freshness === 'stale' ? '情報やや古い（24時間以内）' :
                     '情報古い（24時間以上前）'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                最新の投稿 ({reports.length}件)
              </h3>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">まだ投稿がありません</p>
              <p className="mt-2 text-sm text-gray-400">
                最初の投稿者になりましょう！
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-white px-6 py-4">
          <button
            onClick={() => {
              // Phase 8で実装
              console.log('投稿フォームを開く');
            }}
            className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700"
          >
            このカフェの情報を投稿
          </button>
        </div>
      </div>
    </div>
  );
}
