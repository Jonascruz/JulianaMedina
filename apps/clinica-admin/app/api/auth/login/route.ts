import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: 'E-mail e senha sao obrigatorios.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: 'Credenciais invalidas.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ATIVO') {
      return NextResponse.json(
        { ok: false, message: 'Usuario inativo.' },
        { status: 403 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { ok: false, message: 'Credenciais invalidas.' },
        { status: 401 }
      );
    }

    const roles = user.roles.map((entry) => entry.role.name);
    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
      },
    });

    response.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('[auth/login POST]', error);
    return NextResponse.json(
      { ok: false, message: 'Erro ao realizar login.' },
      { status: 500 }
    );
  }
}
