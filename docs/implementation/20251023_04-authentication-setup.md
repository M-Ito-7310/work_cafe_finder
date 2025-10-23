# Phase 4: 認証機能実装

**Phase**: 4/11
**見積もり時間**: 60-90分
**優先度**: High
**依存関係**: Phase 2, Phase 3

---

## 📋 Phase概要

NextAuth.jsによるソーシャルログイン機能を実装します。Google OAuthとX (Twitter) OAuthを設定し、ユーザー認証とセッション管理を完了します。

## ✅ 目標

- ✅ NextAuth.js設定の完了
- ✅ Google OAuth認証の実装
- ✅ X (Twitter) OAuth認証の実装
- ✅ ユーザーセッション管理
- ✅ 保護されたルートの実装

---

## 📝 実装タスク

### 1. OAuth認証情報の取得

#### Google OAuth設定

1. **Google Cloud Console** (https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクト作成: `work-cafe-finder`
3. **APIとサービス** → **認証情報** → **OAuth 2.0 クライアントID** を作成
4. アプリケーションの種類: `ウェブアプリケーション`
5. 承認済みのリダイレクトURI:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google` (本番用)
6. **クライアントID** と **クライアントシークレット** をコピー

#### X (Twitter) OAuth設定

1. **X Developer Portal** (https://developer.twitter.com/) にアクセス
2. 新しいアプリケーション作成
3. **OAuth 2.0** を有効化
4. Callback URL:
   - `http://localhost:3000/api/auth/callback/twitter`
   - `https://your-domain.vercel.app/api/auth/callback/twitter` (本番用)
5. **Client ID** と **Client Secret** をコピー

### 2. 環境変数設定

**.env.local に追加:**
```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # openssl rand -base64 32 で生成

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# X (Twitter) OAuth
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

**NEXTAUTH_SECRETの生成:**
```bash
openssl rand -base64 32
```

### 3. NextAuth設定

**src/app/api/auth/[...nextauth]/route.ts:**
```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: 'database',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 4. SessionProvider設定

**src/app/layout.tsx:**
```typescript
import { SessionProvider } from '@/components/providers/SessionProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

**src/components/providers/SessionProvider.tsx:**
```typescript
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### 5. サインインページ

**src/app/auth/signin/page.tsx:**
```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/map';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            WorkCafeFinder
          </h1>
          <p className="mt-2 text-gray-600">
            作業できるカフェを見つけよう
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              {/* Google Icon SVG */}
            </svg>
            Googleでログイン
          </button>

          <button
            onClick={() => signIn('twitter', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              {/* X Icon SVG */}
            </svg>
            X (Twitter)でログイン
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}
```

### 6. エラーページ

**src/app/auth/error/page.tsx:**
```typescript
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

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            認証エラー
          </h1>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-primary-600 px-6 py-3 text-white transition hover:bg-primary-700"
          >
            再度ログインする
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 7. Headerコンポーネント

**src/components/layout/Header.tsx:**
```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary-600">
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
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white transition hover:bg-primary-700"
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
```

### 8. 保護されたルート

**src/lib/auth/getServerSession.ts:**
```typescript
import { getServerSession as getNextAuthServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getServerSession() {
  return await getNextAuthServerSession(authOptions);
}
```

**使用例（APIルート）:**
```typescript
// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/getServerSession';

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 投稿処理
  // ...
}
```

---

## 📦 成果物

### 完了チェックリスト

- [ ] src/app/api/auth/[...nextauth]/route.ts が作成されている
- [ ] src/components/providers/SessionProvider.tsx が作成されている
- [ ] src/app/auth/signin/page.tsx が作成されている
- [ ] src/app/auth/error/page.tsx が作成されている
- [ ] src/components/layout/Header.tsx が作成されている
- [ ] src/lib/auth/getServerSession.ts が作成されている
- [ ] 環境変数が設定されている
- [ ] Google OAuth設定が完了している
- [ ] X OAuth設定が完了している

### 動作確認

#### 1. Googleログイン
```
1. http://localhost:3000/auth/signin にアクセス
2. 「Googleでログイン」をクリック
3. Google認証画面でログイン
4. /map にリダイレクトされる
5. Headerにユーザー名と画像が表示される
```

#### 2. X (Twitter)ログイン
```
1. http://localhost:3000/auth/signin にアクセス
2. 「X (Twitter)でログイン」をクリック
3. X認証画面でログイン
4. /map にリダイレクトされる
5. Headerにユーザー名と画像が表示される
```

#### 3. ログアウト
```
1. Headerの「ログアウト」ボタンをクリック
2. セッションがクリアされる
3. 「ログイン」ボタンが表示される
```

---

## 🧪 テスト項目

| テスト項目 | 確認方法 | 期待結果 |
|-----------|---------|---------|
| Google OAuth | サインインページでGoogleログイン | 成功 |
| X OAuth | サインインページでXログイン | 成功 |
| セッション管理 | ログイン後にページリロード | セッション保持 |
| ログアウト | ログアウトボタンクリック | セッション削除 |
| 保護されたAPI | 未認証でPOST /api/reports | 401エラー |
| DB保存 | 初回ログイン | usersテーブルに保存 |

---

## ⚠️ トラブルシューティング

### 問題1: NEXTAUTH_SECRETエラー

**原因**: NEXTAUTH_SECRETが設定されていない

**解決策**:
```bash
openssl rand -base64 32
# 出力された文字列を.env.localのNEXTAUTH_SECRETに設定
```

### 問題2: OAuth認証エラー

**原因**: リダイレクトURIが一致しない

**解決策**:
- Google Cloud Console / X Developer Portalで設定したリダイレクトURIを確認
- `http://localhost:3000/api/auth/callback/google` が正しく設定されているか確認

### 問題3: DatabaseAdapterエラー

**原因**: NextAuth関連のテーブルが作成されていない

**解決策**:
```bash
# Phase 3のマイグレーションを再実行
npx drizzle-kit push:pg
```

---

## 📚 参考資料

- [NextAuth.js 公式ドキュメント](https://next-auth.js.org/)
- [Google OAuth 設定ガイド](https://console.cloud.google.com/)
- [X Developer Portal](https://developer.twitter.com/)
- [Drizzle Adapter](https://authjs.dev/reference/adapter/drizzle)

---

## 🎯 次のPhase

Phase 4が完了したら、**Phase 5: API Routes実装** (`20251023_05-api-routes.md`) に進みます。

---

**Phase完了日**: ___________
**実績時間**: ___________
**担当者**: ___________
**レビュー**: ___________
