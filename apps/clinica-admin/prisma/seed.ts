import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_NAME = 'Administrador';
const ADMIN_EMAIL = 'julianapsicopedagoga3@gmail.com';
const ADMIN_PASSWORD = 'Zaq1Xsw2@01';

async function main() {
  const [adminRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: RoleName.ADMIN },
      update: { description: 'Administrador do sistema' },
      create: {
        name: RoleName.ADMIN,
        description: 'Administrador do sistema',
      },
    }),
    prisma.role.upsert({
      where: { name: RoleName.PROPRIETARIA },
      update: { description: 'Proprietaria da clinica' },
      create: {
        name: RoleName.PROPRIETARIA,
        description: 'Proprietaria da clinica',
      },
    }),
  ]);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      passwordHash,
      status: 'ATIVO',
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      status: 'ATIVO',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('Seed executado com sucesso.');
  console.log(`Usuario: ${ADMIN_EMAIL}`);
  console.log('Roles garantidas: ADMIN e PROPRIETARIA');
  console.log('Associacao garantida: usuario -> ADMIN');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
