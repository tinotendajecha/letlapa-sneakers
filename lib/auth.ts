// /src/lib/auth.ts
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_NAME = 'letlapa_session';
const JWT_TTL_DAYS = 7;

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;           // user id
  email: string;
  name?: string | null;
  isAdmin?: boolean;
} & JWTPayload;

export async function signSession(payload: SessionPayload) {
  const key = getKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_TTL_DAYS}d`)
    .sign(key);
}

export async function verifySession(token: string) {
  const key = getKey();
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, key);
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: JWT_NAME,
  maxAge: 60 * 60 * 24 * JWT_TTL_DAYS, // seconds
  path: '/',
  httpOnly: true,
  secure: true,        // keep true; on localhost with http you may temporarily set false
  sameSite: 'lax' as const,
};
