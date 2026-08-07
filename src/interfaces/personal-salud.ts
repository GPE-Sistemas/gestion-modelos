import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const PersonalSaludSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    nombre: z.string().optional(), // Nombre completo
    rol: z.enum(['Médico', 'Enfermero']).optional(),
    matricula: z.string().optional(), // Matrícula profesional
    dni: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().optional(),
    activo: z.boolean().optional(), // Disponibilidad laboral

    //Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
      },
    }),
  })
  .meta({ 'x-collection': 'personalsaluds' });
export type IPersonalSalud = z.infer<typeof PersonalSaludSchema>;

export const CreatePersonalSaludSchema = PersonalSaludSchema.omit({
  _id: true,
});
export type ICreatePersonalSalud = z.infer<typeof CreatePersonalSaludSchema>;

export const UpdatePersonalSaludSchema = PersonalSaludSchema.omit({
  _id: true,
});
export type IUpdatePersonalSalud = z.infer<typeof UpdatePersonalSaludSchema>;
