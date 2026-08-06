import { z } from 'zod';
import { ClienteSchema } from './cliente';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const LogDespachoSchema = z
  .object({
    _id: z.string(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    expireAt: z.string().optional().meta({ 'x-bson': 'date' }),
    idExternoVehiculo: z.string().optional(),
    idExternoRecorrido: z.string().optional(),
    idExternoChofer: z.string().optional(),
    // SIN x-bson: divergencia encontrada, no corregida acá (docs/MIGRACION.md
    // §7). meta.go de logdespachos castea "fecha" como TypeDate, pero el
    // @Prop legacy es `@Prop() fecha?: string;` sin `type: Date` — Mongoose
    // infiere String por reflexión de TS, y legacy-schemas.json lo confirma
    // (tipo:"" en vez de "Date"). Anotar acá 'x-bson':'date' silenciaría el
    // hallazgo en vez de exponerlo: se documenta y no se toca ninguno de los
    // dos lados.
    fecha: z.string().optional(),
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
  })
  .meta({ 'x-collection': 'logdespachos' });
export type ILogDespacho = z.infer<typeof LogDespachoSchema>;

////// CREATE
export const CreateLogDespachoSchema = LogDespachoSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type ICreateLogDespacho = z.infer<typeof CreateLogDespachoSchema>;

////// UPDATE
export const UpdateLogDespachoSchema = LogDespachoSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type IUpdateLogDespacho = z.infer<typeof UpdateLogDespachoSchema>;
