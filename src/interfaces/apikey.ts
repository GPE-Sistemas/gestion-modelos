import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const ModuloSchema = z.enum(['flotas', 'alarmas']);
export type Modulo = z.infer<typeof ModuloSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const ApikeySchema = z.object({
  _id: z.string().optional(),
  //
  identificacion: z.string().optional(),
  key: z.string().optional(),
  // Permisos
  global: z.boolean().optional(), // Si es global, no se le asignan clientes
  idCreador: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }), // Si es global. Es lo que puede ver ese cliente.
  idClientes: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }), // Si no es global, se le asignan clientes
  modulos: z.array(ModuloSchema).optional(), // Flotas - Alarmas - etc

  // Populate
  cliente: ClienteSchema.optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idCreador',
      foreignField: '_id',
      justOne: true,
    },
  }),
  // ancestros: sin `.meta()` a propósito — hallazgo (tarea 7, docs/MIGRACION.md
  // §7): el schema.ts legacy (apikeys/schema.ts) SOLO declara los virtuals
  // `cliente` (localField idCreador) y `clientes` (localField idClientes);
  // "ancestros" no existe ahí ni en apikeys/meta.go (Virtuals no tiene esa
  // clave). No es un @Prop ni un schema.virtual() real: no se popula nunca.
  // No se anota un x-populate que mentiría sobre el comportamiento real, y no
  // se borra el campo (cambiaría z.infer, §3 de CLAUDE.md). Exento puntual en
  // `arraysQueNoSonArrays["Apikey"]["ancestros"]` de gestion-datos-go.
  ancestros: z.array(ClienteSchema).optional(), // Este sería el creador
  clientes: z.array(ClienteSchema).optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idClientes',
      foreignField: '_id',
      justOne: false,
    },
  }), // Estos son los elegidos para ver
}).meta({ 'x-collection': 'apikeys' });
export type IApikey = z.infer<typeof ApikeySchema>;

export const CreateApikeySchema = ApikeySchema.omit({
  _id: true,
  clientes: true,
});
export type ICreateApikey = z.infer<typeof CreateApikeySchema>;

export const UpdateApikeySchema = ApikeySchema.omit({
  _id: true,
  clientes: true,
});
export type IUpdateApikey = z.infer<typeof UpdateApikeySchema>;
