import { NextRequest } from 'next/server';
import { leadSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const normalizedPhone = data.phone.replace(/\D/g, '');
    const normalizedWhatsapp = (data.whatsapp || data.phone).replace(/\D/g, '');

    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { contacts: { some: { phone: { contains: normalizedPhone } } } },
          { person: { phone: { contains: normalizedPhone } } },
        ],
      },
      include: { contacts: true, person: true },
    });

    if (existingLead) {
      return Response.json({
        ok: true,
        created: false,
        leadId: existingLead.id,
        status: existingLead.status,
      });
    }

    const person = await prisma.person.create({
      data: {
        name: `${data.firstName} ${data.lastName ?? ''}`.trim(),
        phone: data.phone,
        whatsapp: data.whatsapp || data.phone,
        email: data.email || null,
        school: data.school || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      },
    });

    const lead = await prisma.lead.create({
      data: {
        source: data.source,
        status: data.status || 'LEAD',
        personId: person.id,
        firstContactAt: new Date(),
        contacts: {
          create: {
            name: `${data.firstName} ${data.lastName ?? ''}`.trim(),
            phone: data.phone,
            whatsapp: normalizedWhatsapp,
            email: data.email || null,
            relation: 'RESPONSAVEL',
            isMain: true,
          },
        },
      },
      include: { contacts: true },
    });

    await prisma.message.create({
      data: {
        leadId: lead.id,
        direction: 'INBOUND',
        channel: 'WhatsApp',
        content: data.message || `Motivo da busca: ${data.motivation}`,
      },
    });

    return Response.json({
      ok: true,
      created: true,
      leadId: lead.id,
      status: lead.status,
    }, { status: 201 });
  } catch (error) {
    console.error('[public leads]', error);
    return Response.json(
      { ok: false, message: 'Erro ao processar lead.' },
      { status: 500 }
    );
  }
}
