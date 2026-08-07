import { z } from 'zod';
import type { IActivo } from './activo';
import { ClienteSchema } from './cliente';
import type { IDispositivoLorawan } from './dispositivo-lorawan';
import type { IGrupo } from './grupo';
import type { ILuminaria } from './luminaria';
import {
  TipoEntidadReporteSchema,
  TipoValoresReporteSchema,
} from './reporte-generico';
import type { IRecorrido } from './recorrido';
import type { ITracker } from './tracker';
import type { IUsuario } from './usuario';

/**
 * Último reporte por combinación única idCliente+tipoReporte+idEntidad
 * (índice unique del legacy: ultimo-reporte-generico/schema.ts). `valores` es
 * `@Prop({type: Object})` — Mixed de verdad, sin casteo adentro — a
 * diferencia de `ReporteGenerico` no se modela como unión discriminada por
 * variante: acá alcanza con un registro abierto porque ningún consumidor
 * actual de este paquete lee `valores` tipado (grep sin resultados al crear
 * este archivo, 2026-08-06).
 *
 * Metadata de persistencia por `.meta()` — convención documentada arriba de
 * `ProveedorSchema` en proveedor.ts. Populates intra-SCC como z.custom
 * (import type-only): mismo motivo que en reporte-generico.ts.
 */
export const UltimoReporteGenericoSchema = z
  .object({
    _id: z.string().optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    expireAt: z.string().optional().meta({ 'x-bson': 'date' }),

    // Tenant / relaciones
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    // String plano (a diferencia de ReporteGenerico, donde es ObjectId): sin
    // x-bson. Se popula bajo los nombres "dispositivoLora"/"tracker"
    // (virtuals con nombre distinto al path).
    idEntidad: z.string().optional(),
    idsAsignados: z.array(z.string()).optional(),

    // Tipo y datos
    tipoEntidad: TipoEntidadReporteSchema.optional(),
    tipoReporte: TipoValoresReporteSchema.optional(),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    valores: z
      .record(z.string(), z.unknown())
      .optional()
      .meta({ 'x-bson': 'mixed' }),

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
    dispositivoLora: z.custom<IDispositivoLorawan>().optional().meta({
      'x-populate': {
        ref: 'DispositivoLorawanSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    tracker: z.custom<ITracker>().optional().meta({
      'x-populate': {
        ref: 'TrackerSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    grupos: z.array(z.custom<IGrupo>()).optional().meta({
      'x-populate': {
        ref: 'GrupoSchema',
        localField: 'idsAsignados',
        foreignField: '_id',
        justOne: false,
      },
    }),
    // "single" (justOne:false en el schema legacy, colapsado a objeto único
    // por el post-hook cleanNullsFromPopulated — no acá): activo, recorrido,
    // usuario y luminaria populan desde idsAsignados igual que grupos, pero
    // se modelan singulares porque la app siempre los ve colapsados. Mismo
    // criterio que IReporteBase en reporte-generico.ts.
    activo: z.custom<IActivo>().optional().meta({
      'x-populate': {
        ref: 'ActivoSchema',
        localField: 'idsAsignados',
        foreignField: '_id',
        justOne: false,
      },
    }),
    recorrido: z.custom<IRecorrido>().optional().meta({
      'x-populate': {
        ref: 'RecorridoSchema',
        localField: 'idsAsignados',
        foreignField: '_id',
        justOne: false,
      },
    }),
    usuario: z.custom<IUsuario>().optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idsAsignados',
        foreignField: '_id',
        justOne: false,
      },
    }),
    luminaria: z.custom<ILuminaria>().optional().meta({
      'x-populate': {
        ref: 'LuminariaSchema',
        localField: 'idsAsignados',
        foreignField: '_id',
        justOne: false,
      },
    }),
  })
  .meta({ 'x-collection': 'ultimoreportegenericos' });
export type IUltimoReporteGenerico = z.infer<
  typeof UltimoReporteGenericoSchema
>;

export const CreateUltimoReporteGenericoSchema =
  UltimoReporteGenericoSchema.omit({
    _id: true,
    idsAncestros: true,
    cliente: true,
    ancestros: true,
    dispositivoLora: true,
    tracker: true,
    grupos: true,
    activo: true,
    recorrido: true,
    usuario: true,
    luminaria: true,
  });
export type ICreateUltimoReporteGenerico = z.infer<
  typeof CreateUltimoReporteGenericoSchema
>;

export const UpdateUltimoReporteGenericoSchema =
  UltimoReporteGenericoSchema.omit({
    _id: true,
    idsAncestros: true,
    cliente: true,
    ancestros: true,
    dispositivoLora: true,
    tracker: true,
    grupos: true,
    activo: true,
    recorrido: true,
    usuario: true,
    luminaria: true,
  });
export type IUpdateUltimoReporteGenerico = z.infer<
  typeof UpdateUltimoReporteGenericoSchema
>;
