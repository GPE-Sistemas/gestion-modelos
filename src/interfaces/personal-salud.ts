import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const PersonalSaludSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),

  fechaCreacion: z.string().optional(),
  nombre: z.string().optional(), // Nombre completo
  rol: z.enum(['Médico', 'Enfermero']).optional(),
  matricula: z.string().optional(), // Matrícula profesional
  dni: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
  activo: z.boolean().optional(), // Disponibilidad laboral

  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IPersonalSalud = z.infer<typeof PersonalSaludSchema>;

export const CreatePersonalSaludSchema = PersonalSaludSchema.omit({
  _id: true,
});
export type ICreatePersonalSalud = z.infer<typeof CreatePersonalSaludSchema>;

export const UpdatePersonalSaludSchema = PersonalSaludSchema.omit({
  _id: true,
});
export type IUpdatePersonalSalud = z.infer<typeof UpdatePersonalSaludSchema>;
