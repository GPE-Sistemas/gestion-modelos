import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { UsuarioSchema } from './usuario';

export const TipoDocumentacionSchema = z.enum(['Licencia', 'Seguro']);
export type TipoDocumentacion = z.infer<typeof TipoDocumentacionSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const DocumentacionSchema = z
  .object({
    _id: z.string().optional(),
    tipo: TipoDocumentacionSchema.optional(),
    vencimiento: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    emision: z.string().optional().meta({ 'x-bson': 'date' }),
    descripcion: z.string().optional(),
    imagenes: z.array(z.string()).optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idChofer: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    idActivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
      },
    }),
    chofer: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idChofer',
        foreignField: '_id',
        justOne: true,
      },
    }),
    activo: ActivoSchema.optional().meta({
      'x-populate': {
        ref: 'ActivoSchema',
        localField: 'idActivo',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'documentacions' });
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
