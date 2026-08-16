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

  const contacts = await prisma.contact.findMany({
    include: { lead: true, person: true },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ ok: true, data: contacts });
}

export async function POST(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const contact = await prisma.contact.create({
      data: {
        leadId: body.leadId,
        personId: body.personId || null,
        relation: body.relation || 'RESPONSAVEL',
        name: body.name,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        isMain: Boolean(body.isMain),
      },
      include: { lead: true },
    });

    return Response.json({ ok: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error('[contacts POST]', error);
    return Response.json({ ok: false, message: 'Erro ao criar contato.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID do contato obrigatorio.' }, { status: 400 });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        leadId: body.leadId,
        personId: body.personId || null,
        relation: body.relation || 'RESPONSAVEL',
        name: body.name,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        isMain: Boolean(body.isMain),
      },
      include: { lead: true, person: true },
    });

    return Response.json({ ok: true, data: contact });
  } catch (error) {
    console.error('[contacts PUT]', error);
    return Response.json({ ok: false, message: 'Erro ao atualizar contato.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID do contato obrigatorio.' }, { status: 400 });
    }

    await prisma.contact.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[contacts DELETE]', error);
    return Response.json({ ok: false, message: 'Erro ao excluir contato.' }, { status: 500 });
  }
}
