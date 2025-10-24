import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          ページが見つかりません
        </p>
        <Link
          href="/map"
          className="mt-8 inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition"
        >
          地図に戻る
        </Link>
      </div>
    </div>
  );
}
