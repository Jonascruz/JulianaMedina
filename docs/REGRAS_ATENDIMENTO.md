# REGRAS_ATENDIMENTO

## Objetivo

Documentar as regras operacionais de atendimento da Clínica Juliana Medina.

Este documento define:

- Agenda
- Sessões
- Presenças
- Faltas
- Reposições
- Cancelamentos
- Evoluções
- Laudos
- Histórico clínico

As regras aqui documentadas devem ser consideradas referência oficial para futuras implementações do sistema.

---

# Conceitos

## Contrato Ativo

Somente alunos ou pacientes com contrato ativo podem possuir:

- Sessões
- Agenda
- Presenças
- Reposições
- Evoluções
- Laudos

---

## Sessão

Uma sessão representa um atendimento individual realizado ou programado.

Exemplos:

- Psicopedagogia
- Fonoaudiologia
- Psicomotricidade
- Reforço Escolar Individual

---

# Agenda

A agenda representa os horários reservados para atendimentos.

---

## Psicopedagogia

Utiliza agenda da Juliana.

A agenda deve exibir:

- Horários ocupados
- Horários livres
- Horários recorrentes disponíveis

---

## Reforço Escolar

A agenda é definida pela turma.

Exemplo:

Turma:
Fundamental I

Horário:
Segunda a Sexta

14:00 às 15:00

---

# Sessões

## Campos obrigatórios

- Data
- Horário
- Profissional
- Aluno/Paciente
- Serviço
- Status

---

## Status possíveis

AGENDADA

REALIZADA

FALTA_JUSTIFICADA

FALTA_NAO_JUSTIFICADA

REPOSICAO

CANCELADA

---

# Presenças

## Presença Realizada

Significa que o atendimento ocorreu normalmente.

Deve registrar:

- Data
- Horário
- Profissional
- Observação opcional

---

## Efeitos

- Sessão contabilizada
- Presença registrada
- Utilizada para relatórios

---

# Faltas

Existem dois tipos de falta.

---

## Falta Justificada

Motivos possíveis:

- Doença
- Compromisso escolar
- Emergência familiar
- Outro motivo aprovado

---

## Efeitos

- Pode gerar reposição
- Não prejudica histórico

---

## Falta Não Justificada

Ausência sem justificativa aceita.

---

## Efeitos

- Não gera reposição automática
- É contabilizada no histórico

---

# Reposições

Reposição é uma sessão criada para compensar uma falta justificada.

---

## Pode ser criada quando

- Falta Justificada

---

## Não pode ser criada quando

- Falta Não Justificada

---

## 