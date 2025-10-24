import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export const metadata: Metadata = {
  title: 'WorkCafeFinder - 作業できるカフェを見つけよう',
  description: 'リアルタイムで作業しやすいカフェを見つけられる地図アプリ。空席状況、Wi-Fi、電源の有無をユーザーが共有。',
  keywords: ['カフェ', '作業', 'ノマド', 'Wi-Fi', '電源', '地図'],
  openGraph: {
    title: 'WorkCafeFinder',
    description: 'リアルタイムで作業しやすいカフェを見つけよう',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#16a34a',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <SessionProvider>{children}</SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
