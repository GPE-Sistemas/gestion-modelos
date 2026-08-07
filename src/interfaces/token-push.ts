import { z } from 'zod';

export const PlataformaTokenPushSchema = z.enum(['android', 'ios']);
export type PlataformaTokenPush = z.infer<typeof PlataformaTokenPushSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const TokenPushSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  fechaActualizacion: z.string().optional().meta({ 'x-bson': 'date' }),
  tokenPush: z.string().optional(),
  idUsuario: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  // Identificador estable del dispositivo (Android: ANDROID_ID, iOS:
  // identifierForVendor). Permite 1 fila por (idUsuario, idDispositivo):
  // al rotar el FCM token se reemplaza el de ese device (sin huerfanos) y
  // el logout borra limpio por device.
  idDispositivo: z.string().optional(),
  plataforma: PlataformaTokenPushSchema.optional(),
  // OJO colección: "tokenpushes" (pluralize de push), no "tokenpushs".
}).meta({ 'x-collection': 'tokenpushes' });
export type ITokenPush = z.infer<typeof TokenPushSchema>;

export const CreateTokenPushSchema = TokenPushSchema.omit({
  _id: true,
});
export type ICreateTokenPush = z.infer<typeof CreateTokenPushSchema>;

export const UpdateTokenPushSchema = TokenPushSchema.omit({
  _id: true,
});
export type IUpdateTokenPush = z.infer<typeof UpdateTokenPushSchema>;
