# REGRAS_FINANCEIRAS

## Objetivo

Documentar todas as regras financeiras da Clínica Juliana Medina para garantir que futuras implementações mantenham consistência entre:

- Contratos
- Cobranças
- Rateios
- Pagamentos
- Relatórios
- Dashboard
- WhatsApp
- n8n

---

# Conceitos Fundamentais

## Clínica

A Clínica recebe parte ou totalidade dos valores dos serviços prestados.

A Clínica também recebe integralmente:

- Juros
- Multas
- Encargos financeiros

---

## Profissional

Profissional é quem executa o serviço contratado.

Exemplos:

- Psicopedagoga
- Professora de Reforço Escolar
- Fonoaudióloga
- Psicomotricista

---

## Contrato (Enrollment)

O contrato representa:

"Este aluno/paciente contratou este serviço."

Todo cálculo financeiro nasce do contrato.

---

# Regras Gerais de Rateio

## Regra 1

O rateio é calculado somente sobre o valor base contratado.

Exemplo:

Valor contratado:

R$ 500,00

Rateio:

30% Clínica

70% Profissional

---

## Regra 2

Juros e multas nunca participam do rateio.

Juros:

100% Clínica

Multa:

100% Clínica

---

## Fórmula Base

clinicShare =
valorBase × percentualClinica

professionalShare =
valorBase × percentualProfissional

---

# Serviços de Psicopedagogia

Serviços:

- Avaliação
- Tratamento Neuropsicopedagógico
- Terapia
- Outros atendimentos prestados pela Juliana

Rateio padrão:

Clínica: 100%

Profissional: 100%

Observação:

Neste caso a profissional é a própria Juliana.

---

# Reforço Escolar

Rateio padrão:

Clínica: 30%

Professora: 70%

---

# Fonoaudiologia

Rateio padrão:

Clínica: 30%

Fonoaudióloga: 70%

---

# Psicomotricidade

Rateio inicial:

Clínica: 30%

Profissional: 70%

Observação:

Configuração editável.

---

# Configurabilidade

Todos os percentuais devem ser configuráveis.

Os percentuais utilizados em um contrato deverão ser armazenados no próprio contrato para congelar a regra utilizada na contratação.

Mudanças futuras não podem alterar contratos antigos.

---

# Juros

Configuração padrão:

0,033% ao dia

Editável nas configurações do sistema.

---

# Multa

Configuração padrão:

2%

Editável nas configurações do sistema.

---

# Regra de Juros

Exemplo:

Valor:

R$ 500,00

Atraso:

10 dias

Aplicação:

Juros calculados sobre o valor do título.

Todo o valor do juro pertence à clínica.

---

# Regra de Multa

Exemplo:

Valor:

R$ 500,00

Multa:

2%

Multa:

R$ 10,00

Destino:

100% Clínica

---

# Competência Financeira

Todas as análises financeiras devem ser feitas por competência.

Exemplos:

Janeiro/2027

Fevereiro/2027

Março/2027

---

# Vencimento

Cada contrato possui seu próprio vencimento.

Exemplos:

Aluno A

Vencimento: dia 05

Aluno B

Vencimento: dia 15

Aluno C

Vencimento: dia 28

---

# Inadimplência

A inadimplência não altera o valor devido ao profissional.

Exemplo:

Aluno não pagou.

Professora continua recebendo normalmente sua participação.

A clínica assume o risco financeiro da inadimplência.

---

# Contas a Receber

Campos mínimos:

- Competência
- Valor base
- Juros
- Multa
- Desconto
- Vencimento
- Data pagamento
- Status

Status:

- Aberto
- Pago
- Atrasado
- Cancelado

---

# Contas a Pagar

Campos mínimos:

- Profissional
- Competência
- Valor devido
- Data prevista
- Data pagamento
- Status

Status:

- Aberto
- Pago
- Cancelado

---

# Descontos

Permitidos:

## Percentual

Exemplo:

10%

---

## Valor Fixo

Exemplo:

R$ 50

---

Obrigatório registrar:

- Motivo
- Responsável pela aprovação
- Data

---

# Dashboard Financeiro

Indicadores obrigatórios:

- Receita prevista
- Receita recebida
- Receita em atraso
- Juros recebidos
- Multas recebidas
- Receita da clínica
- Receita por profissional
- Receita por turma
- Inadimplência
- Ticket médio

---

# Regras de Auditoria Financeira

Toda alteração deve registrar:

- Usuário
- Data
- IP
- Valor anterior
- Valor novo

Eventos auditáveis:

- alteração de percentual
- alteração financeira
- desconto
- baixa de pagamento
- cancelamento

---

# Regras que NÃO podem ser violadas

✅ Juros pertencem 100% à clínica.

✅ Multa pertence 100% à clínica.

✅ Rateio incide somente sobre valor base.

✅ Contratos congelam percentuais usados na contratação.

✅ Inadimplência não reduz o valor devido ao profissional.

✅ Cada contrato possui vencimento próprio.

✅ Todos os relatórios trabalham por competência financeira.