import { NextRequest, NextResponse } from 'next/server';
import { getCafeWithReports } from '@/lib/db/queries';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // UUIDバリデーション
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: '有効なカフェIDを指定してください' },
        { status: 400 }
      );
    }

    // カフェ詳細取得
    const cafe = await getCafeWithReports(id);

    if (!cafe) {
      return NextResponse.json(
        { error: 'カフェが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cafe,
    });
  } catch (error) {
    console.error('GET /api/cafes/[id] error:', error);
    return NextResponse.json(
      { error: 'カフェ詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}
