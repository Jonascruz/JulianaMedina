export const publicLeadPayload = {
  type: 'object',
  required: ['firstName', 'phone', 'motivation'],
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string' },
    phone: { type: 'string', minLength: 10 },
    whatsapp: { type: 'string' },
    email: { type: 'string' },
    childName: { type: 'string' },
    birthDate: { type: 'string' },
    school: { type: 'string' },
    motivation: { type: 'string', minLength: 2 },
    message: { type: 'string' },
    source: { type: 'string' },
  },
  additionalProperties: true,
};
