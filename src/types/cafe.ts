import type { Report } from './report';

export interface Cafe {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  latestReport?: Report | null;
}

export type CafeWithReports = Cafe & {
  reports: Report[];
};

export interface CafeCreateInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}
