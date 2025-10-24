'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';
import type { Cafe, Report, CafeWithReports } from '@/types';
import { apiClient } from '@/lib/api/client';
import { ReportCard } from './ReportCard';
import { ReportForm } from '../report/ReportForm';
import { getFreshnessLevel } from '@/lib/utils/freshness';
import { CafeCardSkeleton } from '@/components/ui/Skeleton';

interface CafeDetailModalProps {
  cafe: Cafe;
  onClose: () => void;
  onReportSuccess?: () => void;
}

type TabType = 'reports' | 'form';

export function CafeDetailModal({ cafe, onClose, onReportSuccess }: CafeDetailModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      const response = await apiClient.getCafe(cafe.id);
      const cafeData = response.data as CafeWithReports;
      setReports(cafeData?.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  }, [cafe.id]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReportSuccess = () => {
    setToast({ message: '投稿が完了しました', type: 'success' });
    setActiveTab('reports');
    fetchReports();
    if (onReportSuccess) {
      onReportSuccess();
    }
  };

  const handleReportError = (error: string) => {
    setToast({ message: error, type: 'error' });
  };

  const freshness = getFreshnessLevel(cafe.latestReport?.createdAt || null);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal - モバイルは下から、デスクトップは中央 */}
      <div className="relative w-full md:max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-2xl bg-white shadow-xl animate-slide-up md:animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="px-6 py-4">
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
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="モーダルを閉じる"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'reports'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              投稿一覧 ({reports.length})
            </button>
            <button
              onClick={() => {
                if (!session) {
                  setToast({ message: 'ログインが必要です', type: 'error' });
                  return;
                }
                setActiveTab('form');
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === 'form'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              投稿する
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {activeTab === 'reports' ? (
            loading ? (
              <div className="space-y-4">
                <CafeCardSkeleton />
                <CafeCardSkeleton />
                <CafeCardSkeleton />
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-4">
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
            )
          ) : (
            <ReportForm
              cafe={cafe}
              onSuccess={handleReportSuccess}
              onError={handleReportError}
            />
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-[3000] rounded-lg px-4 py-3 shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={`text-sm font-medium ${
            toast.type === 'success' ? 'text-green-900' : 'text-red-900'
          }`}>
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}
