import { z } from 'zod';
import { UsuarioSchema } from './usuario';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const PasswordResetSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  idUsuario: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  token: z.string().optional(),
  vencimiento: z.string().optional().meta({ 'x-bson': 'date' }),
  utilizado: z.boolean().optional(),

  // virtuals
  usuario: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idUsuario',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'passwordresets' });
export type IPasswordReset = z.infer<typeof PasswordResetSchema>;

export const CreatePasswordResetSchema = PasswordResetSchema.omit({
  _id: true,
  usuario: true,
});
export type ICreatePasswordReset = z.infer<typeof CreatePasswordResetSchema>;

export const UpdatePasswordResetSchema = PasswordResetSchema.omit({
  _id: true,
  usuario: true,
});
export type IUpdatePasswordReset = z.infer<typeof UpdatePasswordResetSchema>;
