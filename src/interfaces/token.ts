import { z } from 'zod';
import { ClientSchema } from './client';
import { UsuarioSchema } from './usuario';

export const TokenSchema = z.object({
  _id: z.string().optional(),
  accessToken: z.string().optional(),
  accessTokenExpiresAt: z.string().optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  client: ClientSchema.optional(),
  user: UsuarioSchema.optional(),
});
export type IToken = z.infer<typeof TokenSchema>;

export const CreateTokenSchema = TokenSchema.omit({
  _id: true,
});
export type ICreateToken = z.infer<typeof CreateTokenSchema>;

export const UpdateTokenSchema = TokenSchema.omit({
  _id: true,
});
export type IUpdateToken = z.infer<typeof UpdateTokenSchema>;
