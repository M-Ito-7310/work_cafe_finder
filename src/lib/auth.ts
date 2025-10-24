import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

// Skip adapter during build if DATABASE_URL is not set
const authConfig = {
  ...(process.env.DATABASE_URL ? { adapter: DrizzleAdapter(db) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || 'placeholder',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || 'placeholder',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: (process.env.DATABASE_URL ? 'database' : 'jwt') as const,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
