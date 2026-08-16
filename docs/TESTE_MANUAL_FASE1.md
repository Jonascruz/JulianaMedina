# Teste Manual - Fase 1

## Pre-requisitos

1. Banco PostgreSQL ativo.
2. Variavel `DATABASE_URL` configurada em `.env`.
3. Seed ja executado (`npm run seed`).
4. Usuario de teste:
   - Email: `julianapsicopedagoga3@gmail.com`
   - Senha: `Zaq1Xsw2@01`

## Subir aplicacao

```bash
npm run dev
```

Aplicacao em: `http://localhost:3000`

## 1) Fluxo de login e sessao

1. Acesse `http://localhost:3000/login`.
2. Informe email e senha validos.
3. Clique em `Entrar`.
4. Valide redirecionamento para `/admin`.
5. Abra DevTools > Application > Cookies e confirme cookie `session`.
6. Clique em `Sair` no header admin.
7. Valide retorno para `/login` e limpeza da sessao.

## 2) Middleware em /admin

1. Com sessao encerrada, tente abrir `http://localhost:3000/admin`.
2. Resultado esperado: redireciona para `/login`.
3. Logue novamente e abra:
   - `/admin/leads`
   - `/admin/profissionais`
   - `/admin/turmas`
4. Resultado esperado: acesso permitido para ADMIN/PROPRIETARIA.

## 3) API protegida por auth + role

Sem sessao:

```bash
curl -i http://localhost:3000/api/leads
curl -i http://localhost:3000/api/contacts
curl -i http://localhost:3000/api/professionals
curl -i http://localhost:3000/api/turmas
```

Esperado: `401` (nao autenticado).

Com sessao valida (via browser logado):

- Executar operacoes GET/POST/PUT/DELETE pelas telas admin.
- Esperado: sucesso para usuario com role ADMIN ou PROPRIETARIA.

## 4) CRUD de Leads

1. Acesse `/admin/leads`.
2. Criar lead com nome + telefone + status.
3. Confirmar aparicao na tabela.
4. Editar o lead.
5. Excluir o lead.
6. Esperado: mensagens de sucesso e tabela refletindo alteracoes.

## 5) CRUD de Profissionais

1. Acesse `/admin/profissionais`.
2. Criar profissional.
3. Editar profissional.
4. Excluir profissional sem vinculos.
5. Esperado: operacoes concluidas.

## 6) CRUD de Turmas

1. Acesse `/admin/turmas`.
2. Criar turma associada a profissional existente.
3. Editar turma.
4. Excluir turma.
5. Esperado: operacoes concluidas.

## 7) Endpoint publico /api/public/leads

Teste de validacao (payload invalido):

```bash
curl -i -X POST http://localhost:3000/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{"firstName":"A"}'
```

Esperado: `400` com erros de validacao.

Teste de criacao (payload valido):

```bash
curl -i -X POST http://localhost:3000/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Maria",
    "lastName":"Silva",
    "phone":"21999999999",
    "whatsapp":"21999999999",
    "email":"maria@example.com",
    "motivation":"Dificuldade de aprendizagem"
  }'
```

Esperado: `201` com `{ "ok": true, "created": true, ... }`.

## Resultado esperado da Fase 1

- Login/logout funcional.
- Sessao JWT em cookie httpOnly.
- Middleware ativo em `/admin`.
- APIs internas protegidas por auth + role.
- CRUD administrativo funcional para Leads, Profissionais e Turmas.
- Endpoint publico de leads validando e criando dados.
