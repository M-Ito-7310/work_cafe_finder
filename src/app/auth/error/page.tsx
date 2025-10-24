'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'サーバーの設定に問題があります。',
    AccessDenied: 'アクセスが拒否されました。',
    Verification: '認証トークンの有効期限が切れています。',
    Default: '認証中にエラーが発生しました。',
  };

  const message = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">認証エラー</h1>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            再度ログインする
          </Link>
        </div>
      </div>
    </div>
  );
}
