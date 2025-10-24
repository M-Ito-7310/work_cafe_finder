import type { ApiResponse, CafesQueryParams } from '@/types';

export class ApiClient {
  private baseUrl = '/api';

  async getCafes(params: CafesQueryParams) {
    const query = new URLSearchParams({
      neLat: params.neLat.toString(),
      neLng: params.neLng.toString(),
      swLat: params.swLat.toString(),
      swLng: params.swLng.toString(),
    });

    if (params.filters) {
      query.append('filters', JSON.stringify(params.filters));
    }

    const response = await fetch(`${this.baseUrl}/cafes?${query}`);
    return this.handleResponse(response);
  }

  async getCafe(id: string) {
    const response = await fetch(`${this.baseUrl}/cafes/${id}`);
    return this.handleResponse(response);
  }

  async createReport(data: {
    cafeId: string;
    seatStatus: 'available' | 'crowded' | 'full';
    quietness: 'quiet' | 'normal' | 'noisy';
    wifi: 'fast' | 'normal' | 'slow' | 'none';
    powerOutlets: boolean;
    comment?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'APIエラー');
    }

    return data;
  }
}

export const apiClient = new ApiClient();
