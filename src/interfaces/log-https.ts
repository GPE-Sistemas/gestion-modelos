import { z } from 'zod';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const LogHttpSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  expireAt: z.string().optional().meta({ 'x-bson': 'date' }),
  method: z.string().optional(),
  url: z.string().optional(),
  path: z.string().optional(),
  body: z.string().optional(),
  headers: z.string().optional(),
  query: z.string().optional(),
  params: z.string().optional(),
}).meta({ 'x-collection': 'loghttps' });
export type ILogHttp = z.infer<typeof LogHttpSchema>;

export const CreateLogHttpSchema = LogHttpSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type ICreateLogHttp = z.infer<typeof CreateLogHttpSchema>;

export const UpdateLogHttpSchema = LogHttpSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type IUpdateLogHttp = z.infer<typeof UpdateLogHttpSchema>;
