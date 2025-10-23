export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface MapBounds {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
}

export interface CafesQueryParams extends MapBounds {
  filters?: {
    seats?: boolean;
    quiet?: boolean;
    wifi?: boolean;
    power?: boolean;
  };
}
