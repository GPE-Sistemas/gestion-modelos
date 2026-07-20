import { z } from 'zod';
import { CoordenadasSchema } from '../auxiliares';
import { ClienteSchema } from './cliente';

export const TipoProveedorSchema = z.enum(['Mecanico', 'Combustible', 'Otro']);
export type TipoProveedor = z.infer<typeof TipoProveedorSchema>;

export const CategoriaProveedorSchema = z.enum(['Colectivo', 'Vehiculo']);
export type CategoriaProveedor = z.infer<typeof CategoriaProveedorSchema>;

export const ProveedorSchema = z.object({
  _id: z.string().optional(),
  categoria: CategoriaProveedorSchema.optional(),
  tipos: z.array(TipoProveedorSchema).optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  nombre: z.string().optional(),
  ubicacion: CoordenadasSchema.optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IProveedor = z.infer<typeof ProveedorSchema>;

export const CreateProveedorSchema = ProveedorSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateProveedor = z.infer<typeof CreateProveedorSchema>;

export const UpdateProveedorSchema = ProveedorSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateProveedor = z.infer<typeof UpdateProveedorSchema>;
