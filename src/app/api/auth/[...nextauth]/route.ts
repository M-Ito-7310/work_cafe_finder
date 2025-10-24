import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
