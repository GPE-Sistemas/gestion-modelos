import { z } from 'zod';
import { CoordenadasSchema } from '../auxiliares';
import { ClienteSchema } from './cliente';

export const TipoProveedorSchema = z.enum(['Mecanico', 'Combustible', 'Otro']);
export type TipoProveedor = z.infer<typeof TipoProveedorSchema>;

export const CategoriaProveedorSchema = z.enum(['Colectivo', 'Vehiculo']);
export type CategoriaProveedor = z.infer<typeof CategoriaProveedorSchema>;

// SPIKE etapa 1 (roadmap de gestion-datos-go, §4): metadata de persistencia
// por `.meta()`. Es ADITIVA — los tipos TS inferidos no cambian, los
// consumidores ignoran las claves desconocidas — y es lo que el bundle JSON
// Schema necesita para que un emisor Go arme el meta.go de la entidad:
//
//   x-collection  colección Mongo (Mongoose pluraliza el nombre de la clase)
//   x-bson        tipo real en la base: el casteo de filtros y writes
//   x-ref         @Prop({ref}): Mongoose popula el path del id EN SU LUGAR
//   x-populate    schema.virtual(): populate bajo el nombre del virtual
//   x-setter      setter de Mongoose (uppercase/lowercase)
//
// `x-ref` y `x-populate` existen separados porque son las DOS formas distintas
// en que un path es populable, y las dos se usan desde el front.
export const ProveedorSchema = z.object({
  _id: z.string().optional(),
  categoria: CategoriaProveedorSchema.optional(),
  tipos: z.array(TipoProveedorSchema).optional(),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  nombre: z.string().optional(),
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  ubicacion: CoordenadasSchema.optional().meta({ 'x-bson': 'mixed' }),
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
}).meta({ 'x-collection': 'proveedors' });
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
