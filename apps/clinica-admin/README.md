# Clínica Admin

Aplicação administrativa para gestão da clínica, seguindo a Fase 1 do projeto.

## Stack

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- Docker
- JWT via `jose`

## Estrutura de pastas

- app/
- components/
- lib/
- prisma/
- types/

## Setup inicial

1. Copie `.env.example` para `.env`.
2. Ajuste `DATABASE_URL`.
3. Suba o banco com Docker.
4. Execute `npm install`.
5. Execute `npx prisma generate`.
6. Execute `npx prisma migrate dev --name init`.
7. Inicie o projeto com `npm run dev`.

## Fase 1 incluída

- Login e autorização por perfil
- CRUD de leads
- CRUD de contatos
- CRUD de profissionais
- CRUD de turmas
- API pública para captura de leads
- Ajuste do formulário público da landing page
