# Arquitetura e análise do sistema da Clínica Juliana Medina

## 1. Objetivo do projeto

Criar uma plataforma web para gestão operacional da clínica, com foco em relacionamento, atendimento, turmas, profissionais, agenda e regras financeiras configuráveis. O sistema deve ser escalável, genérico e seguir os princípios de privacidade e auditoria exigidos pela LGPD.

## 2. Regras de design e arquitetura

- Não depender de nomes específicos da clínica ou da proprietária.
- Modelar entidades genéricas: `Profissional`, `Prestador de Serviço`, `Turma`, `Serviço`, `Categoria de Serviço`.
- O cadastro principal deve ser único por pessoa; qualquer novo contato inicia como `Lead` e pode ser convertido em `Paciente` ou `Aluno`.
- A estrutura financeira deve ser parametrizável por serviço, categoria e profissional.
- O desenvolvimento deve seguir a abordagem de Fases:
  - Fase 1: base do sistema, autenticação, leads, contatos, profissionais, turmas e API pública.
  - Fase 2: financeiro, agenda, presenças, relatórios e dashboard.
  - Fase 3: WhatsApp, Google Calendar, automações e integrações externas.

## 3. Diagrama ERD

```mermaid
erDiagram
  USER ||--o{ USER_ROLE : has
  USER ||--o{ AUDIT_LOG : creates
  ROLE ||--o{ USER_ROLE : assigned_to

  LEAD ||--o| CONTACT : has_contact
  CONTACT ||--o{ LEAD : belongs_to
  LEAD ||--o| PATIENT : converts_to
  LEAD ||--o| STUDENT : converts_to

  PERSON ||--o| PATIENT : is
  PERSON ||--o| STUDENT : is
  PERSON ||--o| CONTACT : is

  PROFESSIONAL ||--o{ CLASS : manages
  PROFESSIONAL ||--o{ PAYMENT_SPLIT : receives
  SERVICE ||--o{ PAYMENT_SPLIT : uses
  CATEGORY ||--o{ SERVICE : groups
  CLASS ||--o{ ENROLLMENT : contains
  PATIENT ||--o{ ENROLLMENT : enrolled
  STUDENT ||--o{ ENROLLMENT : enrolled
  PROFESSIONAL ||--o{ SESSION : performs
  ENROLLMENT ||--o{ SESSION : has
  SERVICE ||--o{ SESSION : is
  SESSION ||--o{ ATTENDANCE : records
  PATIENT ||--o{ RECEIVABLE : has
  STUDENT ||--o{ RECEIVABLE : has
  RECEIVABLE ||--o{ PAYMENT : receives
  PAYABLE ||--o{ PAYMENT : pays
  SYSTEM_SETTING ||--o{ RECEIVABLE : config
  LGPD_CONSENT ||--o| PERSON : authorizes
  AUDIT_LOG }o--|| ENTITY : references
```

## 4. Mapa de casos de uso

### 4.1 Casos de uso de usuários

- Login seguro com perfil `ADMIN` ou `PROPRIETARIA`.
- Cadastro e edição de leads.
- Conversão de lead em paciente ou aluno.
- Criação de contatos, profissionais, turmas e serviços.
- Consulta e filtro por status, turma e profissional.
- Geração de auditoria para cada alteração crítica.
- Acesso restrito por perfil.

### 4.2 Casos de uso de pacientes e alunos

- Registrar dados pessoais e responsáveis.
- Controlar matrícula, responsável, vínculo e status.
- Vincular a serviços e turmas.
- Registrar presença, falta e reposição.

### 4.3 Casos de uso financeiros

- Definir percentual padrão por categoria e serviço.
- Gerar contas a receber, rateios e pagamentos ao profissional.
- Registrar descontos, juros, multa e status.
- Calcular receitas previstas, recebidas e inadimplência.

## 5. Arquitetura proposta

### 5.1 Frontend

- Next.js 14+
- TypeScript
- App Router
- Design system com componentes reutilizáveis
- Rotas privadas com autenticação por sessão segura
- API interna server-side com Prisma

### 5.2 Backend

- Node.js
- Prisma ORM
- PostgreSQL
- Validação por Zod
- Middleware de autorização por perfil
- Logging de auditoria centralizado

### 5.3 Infraestrutura

- Docker para Postgres e app
- VPS Hostinger para deploy
- n8n self-hosted para automações futuras
- Google Calendar API e WhatsApp Business Cloud API como integrações futuras

### 5.4 Segurança e LGPD

- Headers de segurança do Next.js
- Cookies `HttpOnly`, `Secure`, `SameSite=Lax`
- Autorização por perfil na rota
- Registros mínimos de dados e consentimento do responsável
- Logs de acesso e auditoria financeira

## 6. Modelo de dados final

### Entidades principais

- `User`
- `UserRole`
- `Role`
- `Lead`
- `Contact`
- `Person`
- `Patient`
- `Student`
- `Professional`
- `Category`
- `Service`
- `ClassRoom`
- `Enrollment`
- `Session`
- `Attendance`
- `Payment`
- `Receivable`
- `Payable`
- `RevenueSplit`
- `Message`
- `Consent`
- `AuditLog`
- `SystemSetting`

### Regras de negócio centrais

- Todo cadastro começa como `Lead`.
- `Lead` pode virar `Paciente` ou `Aluno`.
- O cadastro principal é único por pessoa.
- Cada `Lead` pode ter múltiplos `Contact` responsáveis.
- `Professional` possui percentual padrão e dia padrão de repasse.
- `ClassRoom` pertence a uma profissional responsável e pode ter múltiplos horários e dias.
- `Receivable` e `Payable` são separados por natureza, mas compartilhando a mesma lógica de rastreio.
- Multa e juros pertencem à clínica, nunca ao rateio.

## 7. Dependências entre módulos

- `Lead` → `Contact` → `Person`
- `Patient/Student` → `Enrollment` → `ClassRoom/Service`
- `Service` → `Category` → `SystemSetting`
- `Professional` → `RevenueSplit` → `Receivable`/`Payment`
- `Session` → `Attendance` → `Enrollment`
- `Auth` → `UserRole` → `Role` → `Resource permissions`
- `AuditLog` → qualquer entidade de negócio que seja alterada

## 8. Riscos e pontos de atenção

- Não duplicar registros de responsável ou criança.
- Definir um critério único para conversão de lead.
- Separar claramente `Receivable` e `Payable` para evitar confusão operacional.
- Garantir que o rateio ignore multa e juros.
- Preservar a LGPD em dados de menores e saúde.
- Planejar um design de banco que permita expansão futura de múltiplos profissionais e integrações.

## 9. Estrutura proposta de pastas

```text
apps/
  clinica-admin/
    app/
      api/
        auth/
        public/
        leads/
        contacts/
        professionals/
        turmas/
      (private)/
      globals.css
      layout.tsx
      page.tsx
    components/
      forms/
      tables/
      ui/
    lib/
      auth.ts
      prisma.ts
      validation.ts
    prisma/
      schema.prisma
      seed.ts
    docker/
      docker-compose.yml
    .env.example
    package.json
    tsconfig.json
    next.config.mjs
    README.md
```

## 10. Fase 1 — implementação mínima

### Escopo

- Setup Next.js + TypeScript
- Prisma + PostgreSQL
- Docker
- Autenticação com perfis admin e proprietária
- CRUD de Leads
- CRUD de Contatos
- CRUD de Profissionais
- CRUD de Turmas
- Public endpoint para captura de leads
- Atualização do script JS da landing page para enviar para a API

### Não incluído nesta fase

- Financeiro
- Dashboard
- Relatórios
- Presenças
- Google Calendar
- WhatsApp
- n8n

## 11. Plano de implementação por fases

### Fase 1

1. Setup do Next.js com TypeScript e Prisma.
2. Configuração do PostgreSQL com Docker.
3. Modelagem inicial do banco com perfis e entidades essenciais.
4. Autenticação segura e middleware de acesso.
5. CRUD de leads, contatos, profissionais e turmas.
6. Endpoint público de lead.
7. Ajuste do formulário da landing page.

### Fase 2

1. Financeiro completo.
2. Contas a receber e pagar.
3. Rateios e percentuais.
4. Dashboard e filtros por período.

### Fase 3

1. Agenda, sessões e Google Calendar.
2. Presenças e faltas.
3. WhatsApp e n8n.
4. Comunicação e automações.

## 12. Estratégia de migração do formulário atual

- O formulário público atual deve continuar com UX e campos já existentes.
- O payload deve ser enviado para um endpoint seguro no backend.
- O backend cria ou atualiza um `Lead` a partir do telefone informado.
- O campo `source` deve registrar a origem do lead (`landing-page`, `whatsapp`, `manual`, etc.).
- A API deve rejeitar payloads inválidos e registrar logs de auditoria.

## 13. Payloads planejados para n8n

- `lead.created`
- `lead.updated`
- `contact.follow_up`
- `payment.reminder`
- `payment.overdue`

Exemplo:

```json
{
  "event": "lead.created",
  "leadId": "uuid",
  "phone": "+5521999999999",
  "status": "LEAD",
  "source": "landing-page",
  "createdAt": "2026-08-15T10:00:00Z"
}
```

## 14. Checklist de testes

- Autenticação com usuário válido.
- Bloqueio de acesso sem token.
- Criação de lead válido.
- Rejeição de lead inválido.
- Atualização de lead existente pelo mesmo telefone.
- CRUD de profissionais com perfil correto.
- CRUD de turmas vinculadas à profissional responsável.
- Validação de dados sensíveis fora do frontend.
- Verificação de observabilidade e logs de auditoria.

## 15. Conclusão

A arquitetura proposta equilibra segurança, escalabilidade, organização funcional e aderência à LGPD. O projeto segue uma base genérica, pronta para crescer sem depender de nomes da clínica e sem bloquear futuras integrações com WhatsApp, Google Calendar e automações via n8n.
