'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          WorkCafeFinder
        </Link>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
