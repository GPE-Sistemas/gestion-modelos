import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const TipoDocumentacionSchema = z.enum(['Licencia', 'Seguro']);
export type TipoDocumentacion = z.infer<typeof TipoDocumentacionSchema>;

export const DocumentacionSchema = z.object({
  _id: z.string().optional(),
  tipo: TipoDocumentacionSchema.optional(),
  vencimiento: z.string().optional(),
  fechaCreacion: z.string().optional(),
  emision: z.string().optional(),
  descripcion: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idChofer: z.string().optional(),
  idActivo: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  chofer: UsuarioSchema.optional(),
  activo: ActivoSchema.optional(),
});
export type IDocumentacion = z.infer<typeof DocumentacionSchema>;

// El omit original incluía la clave 'Cliente' (con mayúscula), que no existe en
// IDocumentacion y por lo tanto era un no-op; se descarta.
export const CreateDocumentacionSchema = DocumentacionSchema.omit({
  _id: true,
  chofer: true,
  activo: true,
});
export type ICreateDocumentacion = z.infer<typeof CreateDocumentacionSchema>;

export const UpdateDocumentacionSchema = DocumentacionSchema.omit({
  _id: true,
  chofer: true,
  activo: true,
});
export type IUpdateDocumentacion = z.infer<typeof UpdateDocumentacionSchema>;
