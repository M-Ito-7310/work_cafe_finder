# Phase 8: 投稿システム

**Phase**: 8/11
**見積もり時間**: 90-120分
**優先度**: High
**依存関係**: Phase 2, Phase 4, Phase 5, Phase 7

---

## 📋 Phase概要

カフェ情報投稿フォーム、バリデーション、投稿処理、Toast通知を実装します。ユーザーが空席状況、静かさ、Wi-Fi、電源の有無をレポートできる機能を完成させます。

## ✅ 目標

- ✅ 投稿フォームコンポーネントの実装
- ✅ Zodバリデーション統合
- ✅ POST /api/reports連携
- ✅ Toast通知の実装
- ✅ 認証チェック

---

## 📝 実装タスク

### 1. Toast通知システム

**src/components/ui/Toast.tsx:**
```typescript
'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-[3000] flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${bgColors[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}
```

**src/hooks/useToast.ts:**
```typescript
'use client';

import { useState, useCallback } from 'react';
import type { ToastType } from '@/components/ui/Toast';

interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
```

### 2. ReportFormコンポーネント

**src/components/report/ReportForm.tsx:**
```typescript
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
        seatStatus: formData.seatStatus as any,
        quietness: formData.quietness as any,
        wifi: formData.wifi as any,
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
              onClick={() => setFormData({ ...formData, seatStatus: option.value as any })}
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
              onClick={() => setFormData({ ...formData, quietness: option.value as any })}
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
              onClick={() => setFormData({ ...formData, wifi: option.value as any })}
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
```

### 3. CafeDetailModalに投稿フォーム統合

**src/components/cafe/CafeDetailModal.tsx を更新:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';
import type { Cafe, Report } from '@/types';
import { apiClient } from '@/lib/api/client';
import { ReportCard } from './ReportCard';
import { ReportForm } from '../report/ReportForm';
import { getFreshnessLevel } from '@/lib/utils/freshness';

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

  useEffect(() => {
    fetchReports();
  }, [cafe.id]);

  const fetchReports = async () => {
    try {
      const response = await apiClient.getCafe(cafe.id);
      setReports(response.data?.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-2xl bg-white shadow-xl">
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
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
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
```

### 4. 地図ページを更新

**src/app/map/page.tsx を更新:**
```typescript
// onReportSuccess を追加して、投稿後に地図をリフレッシュ
{selectedCafe && (
  <CafeDetailModal
    cafe={selectedCafe}
    onClose={() => setSelectedCafe(null)}
    onReportSuccess={() => {
      // 地図を再読み込み
      handleMapMove(currentBounds);
    }}
  />
)}
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] src/components/ui/Toast.tsx が作成されている
- [ ] src/hooks/useToast.ts が作成されている
- [ ] src/components/report/ReportForm.tsx が作成されている
- [ ] src/components/cafe/CafeDetailModal.tsx が更新されている
- [ ] Zodバリデーションが動作する
- [ ] POST /api/reports連携が動作する
- [ ] Toast通知が表示される

### 動作確認

#### 1. 投稿フォーム表示
```
1. カフェ詳細モーダルを開く
2. 「投稿する」タブをクリック
3. 投稿フォームが表示される
```

#### 2. バリデーション
```
1. 必須項目を空のまま投稿
2. バリデーションエラーが表示される
3. エラーメッセージが赤字で表示される
```

#### 3. 投稿成功
```
1. すべての項目を入力
2. 「投稿する」ボタンをクリック
3. 「投稿が完了しました」トーストが表示される
4. 「投稿一覧」タブに自動的に戻る
5. 新しい投稿が一覧に表示される
```

#### 4. 認証チェック
```
1. ログアウト状態で「投稿する」タブをクリック
2. 「ログインが必要です」エラーが表示される
```

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| フォーム表示 | 投稿するタブクリック | フォーム表示 |
| バリデーション | 空で投稿 | エラー表示 |
| 投稿成功 | 正しいデータで投稿 | 成功トースト表示 |
| 投稿一覧更新 | 投稿後 | 新しい投稿が表示 |
| 認証チェック | 未ログインで投稿 | エラー表示 |
| 文字数制限 | コメント51文字入力 | バリデーションエラー |

---

## ⚠️ トラブルシューティング

### 問題1: 投稿が失敗する

**原因**: 認証エラーまたはバリデーションエラー

**解決策**:
```typescript
// ブラウザのコンソールでエラーを確認
// Phase 4の認証設定を確認
// Phase 5のAPI実装を確認
```

### 問題2: Toast通知が表示されない

**原因**: z-indexの競合

**解決策**:
```typescript
// Toastのz-indexを確認
className="z-[3000]"
```

### 問題3: フォームが送信されない

**原因**: バリデーションエラー

**解決策**:
```typescript
// createReportSchemaを確認
// formDataの型を確認
```

---

## 📚 参考資料

- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/) (将来的な改善)
- [NextAuth.js Session](https://next-auth.js.org/getting-started/client#usesession)

---

## 🎯 次のPhase

Phase 8が完了したら、**Phase 9: フィルタリング・鮮度管理** (`20251023_09-filtering-freshness.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
