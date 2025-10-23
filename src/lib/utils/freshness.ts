import type { FreshnessLevel } from '@/types';

/**
 * 投稿の鮮度レベルを判定
 * @param createdAt 投稿日時
 * @returns 'fresh' (3時間以内) | 'stale' (3-24時間) | 'expired' (24時間以上)
 */
export function getFreshnessLevel(createdAt: Date | null): FreshnessLevel {
  if (!createdAt) return 'expired';

  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 3) return 'fresh';
  if (diffHours <= 24) return 'stale';
  return 'expired';
}

/**
 * 鮮度レベルに応じた日本語ラベルを取得
 * @param createdAt 投稿日時
 * @returns 「15分前の情報」「6時間前の古い情報です」など
 */
export function getFreshnessLabel(createdAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'たった今';
  if (diffMinutes < 60) return `${diffMinutes}分前の情報`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間前の情報`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}日前の古い情報です`;
}

/**
 * 鮮度レベルに応じたTailwindテキストカラークラスを取得
 * @param level 鮮度レベル
 * @returns Tailwindクラス名
 */
export function getFreshnessColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return 'text-green-600';
    case 'stale':
      return 'text-yellow-600';
    case 'expired':
      return 'text-gray-400';
  }
}

/**
 * 鮮度レベルに応じたマーカー色（16進数）を取得
 * @param level 鮮度レベル
 * @returns 16進数カラーコード
 */
export function getMarkerColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return '#10B981'; // green-500
    case 'stale':
      return '#F59E0B'; // yellow-500
    case 'expired':
      return '#9CA3AF'; // gray-400
  }
}
