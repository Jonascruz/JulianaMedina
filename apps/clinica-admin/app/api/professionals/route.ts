import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

async function ensureAdmin() {
  const user = await getSessionUser();

  if (!user) {
    return Response.json({ ok: false, message: 'Nao autenticado.' }, { status: 401 });
  }

  if (!hasAdminAccess(user)) {
    return Response.json({ ok: false, message: 'Acesso negado.' }, { status: 403 });
  }

  return null;
}

export async function GET() {
  const denied = await ensureAdmin();
  if (denied) return denied;

  const professionals = await prisma.professional.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ ok: true, data: professionals });
}

export async function POST(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();

    const professional = await prisma.professional.create({
      data: {
        name: body.name,
        type: body.type,
        phone: body.phone || null,
        email: body.email || null,
        status: body.status || 'ATIVO',
        defaultPercent: body.defaultPercent ? Number(body.defaultPercent) : null,
        defaultTransferDay: body.defaultTransferDay || null,
      },
    });

    return Response.json({ ok: true, data: professional }, { status: 201 });
  } catch (error) {
    console.error('[professionals POST]', error);
    return Response.json({ ok: false, message: 'Erro ao criar profissional.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID do profissional obrigatorio.' }, { status: 400 });
    }

    const professional = await prisma.professional.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        phone: body.phone || null,
        email: body.email || null,
        status: body.status || 'ATIVO',
        defaultPercent: body.defaultPercent ? Number(body.defaultPercent) : null,
        defaultTransferDay: body.defaultTransferDay || null,
      },
    });

    return Response.json({ ok: true, data: professional });
  } catch (error) {
    console.error('[professionals PUT]', error);
    return Response.json({ ok: false, message: 'Erro ao atualizar profissional.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID do profissional obrigatorio.' }, { status: 400 });
    }

    await prisma.professional.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[professionals DELETE]', error);
    return Response.json({ ok: false, message: 'Erro ao excluir profissional.' }, { status: 500 });
  }
}
