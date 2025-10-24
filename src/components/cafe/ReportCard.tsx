'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Report } from '@/types';
import { getFreshnessLevel } from '@/lib/utils/freshness';

interface ReportCardProps {
  report: Report;
}

const seatStatusLabels = {
  available: { label: '空いている', color: 'text-green-600', bg: 'bg-green-50' },
  crowded: { label: 'やや混雑', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  full: { label: '満席', color: 'text-red-600', bg: 'bg-red-50' },
};

const quietnessLabels = {
  quiet: { label: '静か', icon: '🔇' },
  normal: { label: '普通', icon: '🔉' },
  noisy: { label: 'うるさい', icon: '🔊' },
};

const wifiLabels = {
  fast: { label: '高速', icon: '📶' },
  normal: { label: '普通', icon: '📶' },
  slow: { label: '低速', icon: '📶' },
  none: { label: 'なし', icon: '❌' },
};

export function ReportCard({ report }: ReportCardProps) {
  const freshness = getFreshnessLevel(report.createdAt);
  const seatStatus = seatStatusLabels[report.seatStatus];
  const quietness = quietnessLabels[report.quietness];
  const wifi = wifiLabels[report.wifi];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {report.user?.image && (
            <img
              src={report.user.image}
              alt={report.user.name || 'User'}
              className="h-8 w-8 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {report.user?.name || '匿名ユーザー'}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(report.createdAt), 'M月d日 HH:mm', { locale: ja })}
            </p>
          </div>
        </div>
        <span className={`inline-block h-2 w-2 rounded-full ${
          freshness === 'fresh' ? 'bg-green-500' :
          freshness === 'stale' ? 'bg-yellow-500' :
          'bg-gray-400'
        }`} />
      </div>

      {/* Status Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* 空席状況 */}
        <div className={`rounded-lg ${seatStatus.bg} px-3 py-2`}>
          <p className="text-xs text-gray-600">空席状況</p>
          <p className={`mt-1 font-semibold ${seatStatus.color}`}>
            {seatStatus.label}
          </p>
        </div>

        {/* 静かさ */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">静かさ</p>
          <p className="mt-1 font-semibold text-gray-900">
            {quietness.icon} {quietness.label}
          </p>
        </div>

        {/* Wi-Fi */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">Wi-Fi</p>
          <p className="mt-1 font-semibold text-gray-900">
            {wifi.icon} {wifi.label}
          </p>
        </div>

        {/* 電源 */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">電源席</p>
          <p className="mt-1 font-semibold text-gray-900">
            {report.powerOutlets ? '🔌 あり' : '❌ なし'}
          </p>
        </div>
      </div>

      {/* Comment */}
      {report.comment && (
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-sm text-gray-700">{report.comment}</p>
        </div>
      )}
    </div>
  );
}
