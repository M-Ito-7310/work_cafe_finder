import type { User } from './user';

export type SeatStatus = 'available' | 'crowded' | 'full';
export type Quietness = 'quiet' | 'normal' | 'noisy';
export type WifiSpeed = 'fast' | 'normal' | 'slow' | 'none';

export interface Report {
  id: string;
  cafeId: string;
  userId: string;
  seatStatus: SeatStatus;
  quietness: Quietness;
  wifi: WifiSpeed;
  powerOutlets: boolean;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface ReportCreateInput {
  cafeId: string;
  seatStatus: SeatStatus;
  quietness: Quietness;
  wifi: WifiSpeed;
  powerOutlets: boolean;
  comment?: string;
}

export type FreshnessLevel = 'fresh' | 'stale' | 'expired';
