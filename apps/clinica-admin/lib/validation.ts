import { z } from 'zod';

export const leadSchema = z.object({
  source: z.string().optional().default('landing-page'),
  status: z.enum(['LEAD', 'EM_AVALIACAO', 'EM_TRATAMENTO', 'INATIVO']).optional(),
  firstName: z.string().min(2, 'Informe o nome do responsável.'),
  lastName: z.string().optional(),
  phone: z.string().min(10, 'Informe um telefone válido.'),
  whatsapp: z.string().optional(),
  email: z.string().email('Informe um e-mail válido.').optional().or(z.literal('')),
  childName: z.string().min(2, 'Informe o nome da criança.').optional(),
  birthDate: z.string().optional(),
  school: z.string().optional(),
  motivation: z.string().min(2, 'Selecione ou informe o motivo da busca.'),
  message: z.string().optional(),
});

export const professionalSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório.'),
  type: z.string().min(2, 'Tipo obrigatório.'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  status: z.enum(['ATIVO', 'INATIVO']).optional().default('ATIVO'),
  defaultPercent: z.number().min(0).max(100).optional(),
  defaultTransferDay: z.number().int().min(1).max(31).optional(),
});

export const classSchema = z.object({
  name: z.string().min(2, 'Nome da turma obrigatório.'),
  professionalId: z.string().min(1, 'Profissional obrigatório.'),
  daysOfWeek: z.array(z.string()).min(1, 'Selecione ao menos um dia.'),
  schedule: z.string().optional(),
  defaultValue: z.number().min(0).optional(),
  defaultClinicPercent: z.number().min(0).max(100).optional(),
  defaultProfessionalPercent: z.number().min(0).max(100).optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional().default('ATIVO'),
});
