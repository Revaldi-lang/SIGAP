import { createHmac, timingSafeEqual } from 'node:crypto';

export type SessionRole = 'Masyarakat' | 'Administrator' | 'Petugas PUPR' | 'Petugas';

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  role: SessionRole;
  status: string;
}

export const SESSION_COOKIE = 'sigap_session';
export const SESSION_MAX_AGE = 30 * 60; // 30 menit (detik) — selaras dgn SessionTimeoutHandler client

type SessionPayload = SessionUser & { exp: number };

const getSecret = (): string => {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET wajib di-set (minimal 32 karakter) di environment.');
  }
  return secret;
};

const sign = (payload: string): string =>
  createHmac('sha256', getSecret()).update(payload, 'utf8').digest('base64url');

export const encodeSession = (user: SessionUser, ttlSeconds: number = SESSION_MAX_AGE): string => {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  };
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${body}.${sign(body)}`;
};

export const decodeSession = (token: string): SessionUser | null => {
  try {
    const [body, signature] = token.split('.');
    if (!body || !signature) return null;

    const expected = Buffer.from(sign(body), 'base64url');
    const actual = Buffer.from(signature, 'base64url');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    const parsed: unknown = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed !== 'object') return null;

    const candidate = parsed as SessionUser;
    if (
      typeof candidate.id !== 'string' || candidate.id.length === 0 ||
      typeof candidate.email !== 'string' || candidate.email.length === 0 ||
      typeof candidate.username !== 'string' ||
      typeof candidate.role !== 'string' || candidate.role.length === 0 ||
      typeof candidate.status !== 'string'
    ) {
      return null;
    }

    const payload = parsed as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return candidate;
  } catch {
    return null;
  }
};
