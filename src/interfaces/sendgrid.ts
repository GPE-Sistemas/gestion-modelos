// EMAIL

import { z } from 'zod';
import { ModuloSendgridSchema } from './cliente';

export const EmailDataBaseSchema = z.object({
  sid: z.string(),
  subject: z.string().optional(),
});
export type IEmailDataBase = z.infer<typeof EmailDataBaseSchema>;

export const EmailGenericoSchema = EmailDataBaseSchema.catchall(
  z.string().optional(),
);
export type IEmailGenerico = z.infer<typeof EmailGenericoSchema>;

export const EmailResetPasswordSchema = EmailDataBaseSchema.extend({
  token: z.string(),
});
export type IEmailResetPassword = z.infer<typeof EmailResetPasswordSchema>;

export const EmailNuevoUsuarioSchema = EmailDataBaseSchema.extend({
  usuario: z.string(),
  password: z.string(),
});
export type IEmailNuevoUsuario = z.infer<typeof EmailNuevoUsuarioSchema>;

export const EmailCambioPasswordSchema = EmailDataBaseSchema.extend({
  codigo: z.string(),
});
export type IEmailCambioPassword = z.infer<typeof EmailCambioPasswordSchema>;

export const EmailTwilioSchema = z.object({
  email: z.string().optional(),
  datos: z
    .union([
      EmailGenericoSchema,
      EmailResetPasswordSchema,
      EmailNuevoUsuarioSchema,
      EmailCambioPasswordSchema,
    ])
    .optional(),
  idCliente: z.string().optional(),
  usuario: z.string().optional(),
  twilio: ModuloSendgridSchema.optional(),
  extra: z.record(z.string(), z.any()).optional(),
});
export type IEmailTwilio = z.infer<typeof EmailTwilioSchema>;
