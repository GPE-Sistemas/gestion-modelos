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

export const ServicioSchema = z.object({
  _id: z.string().optional(),
  tipo: TipoServicioSchema.optional(),
  categoria: CategoriaServicioSchema.optional(),
  subcategoria: SubcategoriaServicioSchema.optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idActivo: z.string().optional(),
  fechaRealizacion: z.string().optional(),
  fechaCreacion: z.string().optional(),
  nombreChofer: z.string().optional(),
  detalles: z.string().optional(),
  kmDelMantenimiento: z.number().optional(),
  costo: z.number().optional(),
  litrosCargados: z.number().optional(),
  idProveedor: z.string().optional(),
  fotos: z.array(z.string()).optional(),
  idUsuario: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  proveedor: ProveedorSchema.optional(),
  activo: ActivoSchema.optional(),
  usuario: UsuarioSchema.optional(),
});
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
