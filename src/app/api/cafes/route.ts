import { NextRequest, NextResponse } from 'next/server';
import { getCafesInBounds } from '@/lib/db/queries';
import type { CafesQueryParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータの取得
    const neLat = parseFloat(searchParams.get('neLat') || '0');
    const neLng = parseFloat(searchParams.get('neLng') || '0');
    const swLat = parseFloat(searchParams.get('swLat') || '0');
    const swLng = parseFloat(searchParams.get('swLng') || '0');

    // バリデーション
    if (!neLat || !neLng || !swLat || !swLng) {
      return NextResponse.json(
        { error: '地図範囲のパラメータが不正です' },
        { status: 400 }
      );
    }

    // フィルターの取得
    const filtersParam = searchParams.get('filters');
    const filters = filtersParam
      ? {
          seats: filtersParam.includes('seats'),
          quiet: filtersParam.includes('quiet'),
          wifi: filtersParam.includes('wifi'),
          power: filtersParam.includes('power'),
        }
      : undefined;

    const params: CafesQueryParams = {
      neLat,
      neLng,
      swLat,
      swLng,
      filters,
    };

    // カフェ取得
    const cafes = await getCafesInBounds(params);

    return NextResponse.json({
      success: true,
      data: cafes,
    });
  } catch (error) {
    console.error('GET /api/cafes error:', error);
    return NextResponse.json(
      { error: 'カフェの取得に失敗しました' },
      { status: 500 }
    );
  }
}
