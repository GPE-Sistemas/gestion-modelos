import { z } from 'zod';
import { ClientSchema } from './client';
import { UsuarioSchema } from './usuario';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts. `client`/`user` NO son populate: el
// legacy los declara `@Prop({type: Object})` (Mixed) — una copia embebida,
// no un ObjectId con ref — así que van sin virtual en tokens/meta.go.
export const TokenSchema = z.object({
  _id: z.string().optional(),
  accessToken: z.string().optional(),
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  client: ClientSchema.optional().meta({ 'x-bson': 'mixed' }),
  user: UsuarioSchema.optional().meta({ 'x-bson': 'mixed' }),
}).meta({ 'x-collection': 'tokens' });
export type IToken = z.infer<typeof TokenSchema>;

export const CreateTokenSchema = TokenSchema.omit({
  _id: true,
});
export type ICreateToken = z.infer<typeof CreateTokenSchema>;

export const UpdateTokenSchema = TokenSchema.omit({
  _id: true,
});
export type IUpdateToken = z.infer<typeof UpdateTokenSchema>;
