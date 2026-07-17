import { z } from 'zod';

export const ClientSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  clientSecret: z.string().optional(),
  grants: z.array(z.string()).optional(),
  redirectUris: z.array(z.string()).optional(),
  accessTokenLifetime: z.number().optional(),
  refreshTokenLifetime: z.number().optional(),
});
export type IClient = z.infer<typeof ClientSchema>;

export const CreateClientSchema = ClientSchema.omit({ _id: true });
export type ICreateClient = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = ClientSchema.omit({ _id: true });
export type IUpdateClient = z.infer<typeof UpdateClientSchema>;
