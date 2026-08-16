# REFATORACAO_DOMINIO_CLINICA

## Objetivo

Ajustar a modelagem do sistema da Clínica Juliana Medina para refletir corretamente as regras de negócio antes da implementação do financeiro, agenda, WhatsApp e automações.

---

# Modelo Atual

Hoje o sistema possui:

- Leads
- Profissionais
- Turmas
- Enrollment
- Receivables
- Payments

Problemas identificados:

1. Turma contém percentuais financeiros.
2. Professional.type é texto livre.
3. Lead tende a acumular responsabilidades além da captação.
4. Enrollment ainda não representa completamente um contrato de serviço.
5. Rateio está distribuído entre múltiplas entidades.
6. Juros e multa não possuem regra formal de separação financeira.

---

# Objetivo da Refatoração

Separar corretamente:

- Captação Comercial
- Contrato de Serviço
- Operação
- Financeiro

---

# Fluxo Correto

Lead
↓
Qualificação
↓
Conversão
↓
Enrollment (Contrato)
↓
Sessões
↓
Financeiro
↓
Rateio

---

# Lead

Responsabilidade:

Somente captação comercial.

Campos:

- Responsável
- Telefone
- WhatsApp
- E-mail
- Criança
- Escola
- Motivo da busca
- Mensagem inicial
- Origem

Não armazenar:

- Financeiro
- Rateio
- Laudos
- Tratamento

---

# Enrollment (Contrato)

Passa a ser a entidade central do sistema.

Representa:

"Este cliente contratou este serviço."

Campos obrigatórios:

- Lead de origem
- Criança
- Responsável
- Serviço
- Profissional responsável
- Turma (quando aplicável)
- Data de entrada
- Dia do vencimento
- Valor contratado
- Modalidade
- Status

Campos recomendados:

- clinicPercent
- professionalPercent

Esses percentuais devem ser congelados no momento da contratação.

---

# Profissionais

Tipos permitidos:

- PSICOPEDAGOGA
- PSICOMOTRICIDADE
- FONOAUDIOLOGA
- PROFESSORA_REFORCO
- OUTRO

Importante:

PROPRIETARIA não é profissão.

PROPRIETARIA continua existindo apenas como perfil de acesso.

---

# Perfis de Acesso

ADMIN

- Jonas

PROPRIETARIA

- Juliana

Separado dos tipos profissionais.

---

# Turmas

Turma controla:

- Nome
- Professora
- Dias da semana
- Horário
- Status
- Valor sugerido

Turma NÃO controla:

- Percentual Clínica
- Percentual Profissional

---

# Regras Financeiras

## Reforço Escolar

Clínica: 30%

Professora: 70%

---

## Fonoaudiologia

Clínica: 30%

Fonoaudióloga: 70%

---

## Psicopedagogia

Juliana: 100%

---

# Juros e Multas

Regra obrigatória:

Juros = 100% Clínica

Multa = 100% Clínica

Nunca participar do rateio do profissional.

---

# Fases Futuras

## Fase 2

- Alunos/Pacientes
- Contratos
- Presenças
- Evolução
- Laudos

## Fase 3

- Financeiro
- Recebíveis
- Rateio
- Competência

## Fase 4

- Agenda
- Google Calendar

## Fase 5

- WhatsApp Cloud API
- n8n
- Comunicação automática

---

# Decisões Arquiteturais Aprovadas

✅ Lead = captação

✅ Enrollment = contrato

✅ Turma não possui percentual

✅ Tipo profissional controlado

✅ Juros e multa pertencem à clínica

✅ Conversão Lead → Enrollment

---

Data:

___/___/____

Versão:

1.0