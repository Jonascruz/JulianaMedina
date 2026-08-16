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

  const classes = await prisma.classRoom.findMany({
    include: { professional: true },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ ok: true, data: classes });
}

export async function POST(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();

    const classRoom = await prisma.classRoom.create({
      data: {
        name: body.name,
        professionalId: body.professionalId,
        daysOfWeek: Array.isArray(body.daysOfWeek) ? body.daysOfWeek : [],
        schedule: body.schedule || null,
        defaultValue: body.defaultValue ? Number(body.defaultValue) : null,
        defaultClinicPercent: body.defaultClinicPercent ? Number(body.defaultClinicPercent) : null,
        defaultProfessionalPercent: body.defaultProfessionalPercent ? Number(body.defaultProfessionalPercent) : null,
        status: body.status || 'ATIVO',
      },
      include: { professional: true },
    });

    return Response.json({ ok: true, data: classRoom }, { status: 201 });
  } catch (error) {
    console.error('[turmas POST]', error);
    return Response.json({ ok: false, message: 'Erro ao criar turma.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID da turma obrigatorio.' }, { status: 400 });
    }

    const classRoom = await prisma.classRoom.update({
      where: { id },
      data: {
        name: body.name,
        professionalId: body.professionalId,
        daysOfWeek: Array.isArray(body.daysOfWeek) ? body.daysOfWeek : [],
        schedule: body.schedule || null,
        defaultValue: body.defaultValue ? Number(body.defaultValue) : null,
        defaultClinicPercent: body.defaultClinicPercent ? Number(body.defaultClinicPercent) : null,
        defaultProfessionalPercent: body.defaultProfessionalPercent ? Number(body.defaultProfessionalPercent) : null,
        status: body.status || 'ATIVO',
      },
      include: { professional: true },
    });

    return Response.json({ ok: true, data: classRoom });
  } catch (error) {
    console.error('[turmas PUT]', error);
    return Response.json({ ok: false, message: 'Erro ao atualizar turma.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID da turma obrigatorio.' }, { status: 400 });
    }

    await prisma.classRoom.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[turmas DELETE]', error);
    return Response.json({ ok: false, message: 'Erro ao excluir turma.' }, { status: 500 });
  }
}
