'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import { createReportSchema } from '@/lib/validations/report';
import type { Cafe } from '@/types';

interface ReportFormProps {
  cafe: Cafe;
  onSuccess: () => void;
  onError: (error: string) => void;
}

type FormData = {
  seatStatus: 'available' | 'crowded' | 'full' | '';
  quietness: 'quiet' | 'normal' | 'noisy' | '';
  wifi: 'fast' | 'normal' | 'slow' | 'none' | '';
  powerOutlets: boolean;
  comment: string;
};

export function ReportForm({ cafe, onSuccess, onError }: ReportFormProps) {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    seatStatus: '',
    quietness: '',
    wifi: '',
    powerOutlets: false,
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      onError('ログインが必要です');
      return;
    }

    // バリデーション
    try {
      createReportSchema.parse({
        cafeId: cafe.id,
        ...formData,
      });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    // 投稿
    setSubmitting(true);
    try {
      await apiClient.createReport({
        cafeId: cafe.id,
        seatStatus: formData.seatStatus as 'available' | 'crowded' | 'full',
        quietness: formData.quietness as 'quiet' | 'normal' | 'noisy',
        wifi: formData.wifi as 'fast' | 'normal' | 'slow' | 'none',
        powerOutlets: formData.powerOutlets,
        comment: formData.comment || undefined,
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to create report:', error);
      onError('投稿に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 空席状況 */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          空席状況 <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {[
            { value: 'available', label: '空いている', emoji: '◯' },
            { value: 'crowded', label: 'やや混雑', emoji: '△' },
            { value: 'full', label: '満席', emoji: '✕' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, seatStatus: option.value as 'available' | 'crowded' | 'full' })}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition ${
                formData.seatStatus === option.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl">{option.emoji}</div>
              <div className="mt-1">{option.label}</div>
            </button>
          ))}
        </div>
        {errors.seatStatus && (
          <p className="mt-1 text-sm text-red-500">{errors.seatStatus}</p>
        )}
      </div>

      {/* 静かさ */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          静かさ <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {[
            { value: 'quiet', label: '静か', emoji: '🔇' },
            { value: 'normal', label: '普通', emoji: '🔉' },
            { value: 'noisy', label: 'うるさい', emoji: '🔊' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, quietness: option.value as 'quiet' | 'normal' | 'noisy' })}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition ${
                formData.quietness === option.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl">{option.emoji}</div>
              <div className="mt-1">{option.label}</div>
            </button>
          ))}
        </div>
        {errors.quietness && (
          <p className="mt-1 text-sm text-red-500">{errors.quietness}</p>
        )}
      </div>

      {/* Wi-Fi速度 */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Wi-Fi速度 <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[
            { value: 'fast', label: '高速' },
            { value: 'normal', label: '普通' },
            { value: 'slow', label: '低速' },
            { value: 'none', label: 'なし' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, wifi: option.value as 'fast' | 'normal' | 'slow' | 'none' })}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                formData.wifi === option.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.wifi && (
          <p className="mt-1 text-sm text-red-500">{errors.wifi}</p>
        )}
      </div>

      {/* 電源席 */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.powerOutlets}
            onChange={(e) => setFormData({ ...formData, powerOutlets: e.target.checked })}
            className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-900">
            電源席がある
          </span>
        </label>
      </div>

      {/* コメント */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          コメント（任意）
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          maxLength={50}
          rows={3}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="例: 窓側の席が空いてます"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.comment.length}/50文字
        </p>
        {errors.comment && (
          <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
}
