import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Work Cafe Finder - 作業できるカフェを見つけよう',
  description:
    'リアルタイムで作業可能なカフェを見つけるマップアプリ。コミュニティからの最新情報で、電源・WiFi・混雑状況をチェック。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
