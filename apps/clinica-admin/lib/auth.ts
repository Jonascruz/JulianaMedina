import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dev-session-secret'
);

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
};

export function hasAdminAccess(user: SessionUser | null) {
  if (!user) return false;
  return user.roles.includes('ADMIN') || user.roles.includes('PROPRIETARIA');
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    roles: user.roles,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  return {
    id: String(payload.sub ?? ''),
    email: String(payload.email ?? ''),
    name: String(payload.name ?? ''),
    roles: Array.isArray(payload.roles) ? payload.roles.map(String) : [],
  };
}

export async function getSessionUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
