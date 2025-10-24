import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/getServerSession';
import { createReport, getCafeWithReports } from '@/lib/db/queries';
import { createReportSchema } from '@/lib/validations/report';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // リクエストボディの取得
    const body = await request.json();

    // バリデーション
    const validationResult = createReportSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 投稿作成
    const report = await createReport({
      cafeId: data.cafeId,
      userId: session.user.id,
      seatStatus: data.seatStatus,
      quietness: data.quietness,
      wifi: data.wifi,
      powerOutlets: data.powerOutlets,
      comment: data.comment,
    });

    return NextResponse.json(
      {
        success: true,
        data: report,
        message: '投稿が完了しました',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json(
      { error: '投稿に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId');

    if (!cafeId) {
      return NextResponse.json(
        { error: 'cafeIdパラメータが必要です' },
        { status: 400 }
      );
    }

    // カフェの投稿一覧取得
    const cafe = await getCafeWithReports(cafeId);

    if (!cafe) {
      return NextResponse.json(
        { error: 'カフェが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cafe.reports || [],
    });
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}
