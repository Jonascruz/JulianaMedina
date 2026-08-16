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

  try {
    const leads = await prisma.lead.findMany({
      include: {
        person: true,
        contacts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ ok: true, data: leads });
  } catch (error) {
    console.error('[leads GET]', error);
    return Response.json({ ok: false, message: 'Erro ao listar leads.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const lead = await prisma.lead.create({
      data: {
        source: body.source || 'manual',
        status: body.status || 'LEAD',
        person: {
          create: {
            name: body.name,
            phone: body.phone,
            whatsapp: body.whatsapp || body.phone,
            email: body.email || null,
            school: body.school || null,
          },
        },
      },
      include: { person: true },
    });

    return Response.json({ ok: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error('[leads POST]', error);
    return Response.json({ ok: false, message: 'Erro ao criar lead.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID do lead obrigatorio.' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { person: true, contacts: true },
    });

    if (!lead) {
      return Response.json({ ok: false, message: 'Lead nao encontrado.' }, { status: 404 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        source: body.source ?? lead.source,
        status: body.status ?? lead.status,
      },
      include: { person: true, contacts: true },
    });

    if (lead.personId && lead.person) {
      await prisma.person.update({
        where: { id: lead.personId },
        data: {
          name: body.name ?? lead.person.name,
          phone: body.phone ?? lead.person.phone,
          whatsapp: body.whatsapp ?? lead.person.whatsapp,
          email: body.email ?? lead.person.email,
          school: body.school ?? lead.person.school,
        },
      });
    }

    const refreshed = await prisma.lead.findUnique({
      where: { id },
      include: { person: true, contacts: true },
    });

    return Response.json({ ok: true, data: refreshed ?? updatedLead });
  } catch (error) {
    console.error('[leads PUT]', error);
    return Response.json({ ok: false, message: 'Erro ao atualizar lead.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await ensureAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body?.id ?? '');

    if (!id) {
      return Response.json({ ok: false, message: 'ID do lead obrigatorio.' }, { status: 400 });
    }

    await prisma.lead.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[leads DELETE]', error);
    return Response.json({ ok: false, message: 'Erro ao excluir lead.' }, { status: 500 });
  }
}
