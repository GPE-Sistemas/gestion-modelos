import { z } from 'zod';

export const PlataformaTokenPushSchema = z.enum(['android', 'ios']);
export type PlataformaTokenPush = z.infer<typeof PlataformaTokenPushSchema>;

export const TokenPushSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
  tokenPush: z.string().optional(),
  idUsuario: z.string().optional(),
  // Identificador estable del dispositivo (Android: ANDROID_ID, iOS:
  // identifierForVendor). Permite 1 fila por (idUsuario, idDispositivo):
  // al rotar el FCM token se reemplaza el de ese device (sin huerfanos) y
  // el logout borra limpio por device.
  idDispositivo: z.string().optional(),
  plataforma: PlataformaTokenPushSchema.optional(),
});
export type ITokenPush = z.infer<typeof TokenPushSchema>;

export const CreateTokenPushSchema = TokenPushSchema.omit({
  _id: true,
});
export type ICreateTokenPush = z.infer<typeof CreateTokenPushSchema>;

export const UpdateTokenPushSchema = TokenPushSchema.omit({
  _id: true,
});
export type IUpdateTokenPush = z.infer<typeof UpdateTokenPushSchema>;
