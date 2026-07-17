import { z } from 'zod';
import { UsuarioSchema } from './usuario';

export const PasswordResetSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  idUsuario: z.string().optional(),
  token: z.string().optional(),
  vencimiento: z.string().optional(),
  utilizado: z.boolean().optional(),

  // virtuals
  usuario: UsuarioSchema.optional(),
});
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
