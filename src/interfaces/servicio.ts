import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { ProveedorSchema } from './proveedor';
import { UsuarioSchema } from './usuario';

export const TipoServicioSchema = z.enum([
  'Gasto',
  'Mantenimiento',
  'Combustible',
]);
export type TipoServicio = z.infer<typeof TipoServicioSchema>;

export const CategoriaServicioSchema = z.enum(['Colectivo', 'Vehiculo']);
export type CategoriaServicio = z.infer<typeof CategoriaServicioSchema>;

export const SubcategoriaServicioSchema = z.enum([
  'Cambio de aceite y filtro',
  'Cambio de aceite de caja',
  'Cambio de líquido refrigerante',
  'Cambio de filtro de combustible',
  'Cambio de filtro de aire',
  'Cambio de filtro de habitáculo',
  'Cambio de batería',
  'Cambio de cubiertas',
  'Cambio de luces',
  'Cambio de líquido de frenos',
  'Cambio de pastillas de freno',
  'Cambio de bujías',
  'Otro',
]);
export type SubcategoriaServicio = z.infer<typeof SubcategoriaServicioSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const ServicioSchema = z
  .object({
    _id: z.string().optional(),
    tipo: TipoServicioSchema.optional(),
    categoria: CategoriaServicioSchema.optional(),
    subcategoria: SubcategoriaServicioSchema.optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idActivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
    fechaRealizacion: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    nombreChofer: z.string().optional(),
    detalles: z.string().optional(),
    kmDelMantenimiento: z.number().optional(),
    costo: z.number().optional(),
    litrosCargados: z.number().optional(),
    idProveedor: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ProveedorSchema' }),
    fotos: z.array(z.string()).optional(),
    // @Prop() pelado (String en Mongoose, NO ObjectId — docs/MIGRACION.md):
    // sin x-bson. El virtual "usuario" igual popula matcheando contra
    // usuarios._id.
    idUsuario: z.string().optional(),
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
    proveedor: ProveedorSchema.optional().meta({
      'x-populate': {
        ref: 'ProveedorSchema',
        localField: 'idProveedor',
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
    usuario: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idUsuario',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'servicios' });
export type IServicio = z.infer<typeof ServicioSchema>;

export const CreateServicioSchema = ServicioSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  proveedor: true,
  usuario: true,
});
export type ICreateServicio = z.infer<typeof CreateServicioSchema>;

export const UpdateServicioSchema = ServicioSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  proveedor: true,
  usuario: true,
});
export type IUpdateServicio = z.infer<typeof UpdateServicioSchema>;
