// 地図デフォルト設定
export const MAP_DEFAULT_CENTER = {
  lat: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT) || 35.6812,
  lng: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG) || 139.7671,
} as const;

export const MAP_DEFAULT_ZOOM = Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM) || 15;

// 鮮度判定の閾値（時間）
export const FRESHNESS_THRESHOLDS = {
  FRESH: 3, // 3時間以内
  STALE: 24, // 24時間以内
} as const;

// 投稿フォームの制限
export const REPORT_CONSTRAINTS = {
  COMMENT_MAX_LENGTH: 50,
} as const;

// APIエンドポイント
export const API_ENDPOINTS = {
  CAFES: '/api/cafes',
  REPORTS: '/api/reports',
  AUTH: '/api/auth',
} as const;

// 空席状況のラベル
export const SEAT_STATUS_LABELS = {
  available: '空席あり',
  crowded: '混雑',
  full: '満席',
} as const;

// 静かさのラベル
export const QUIETNESS_LABELS = {
  quiet: '静か',
  normal: '普通',
  noisy: 'にぎやか',
} as const;

// Wi-Fi速度のラベル
export const WIFI_LABELS = {
  fast: '速い',
  normal: '普通',
  slow: '遅い',
  none: 'なし',
} as const;
