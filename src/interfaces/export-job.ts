import { z } from 'zod';

export const EstadoExportJobSchema = z.enum([
  'pendiente',
  'procesando',
  'completado',
  'error',
]);
export type EstadoExportJob = z.infer<typeof EstadoExportJobSchema>;

export const TipoExportJobSchema = z.enum([
  'recorrido',
  'vehiculosPorZona',
  'reportesVehiculo',
  'reportesCliente',
]);
export type TipoExportJob = z.infer<typeof TipoExportJobSchema>;

// Cola de exports asíncronos (export-job.model.ts, 17 @Prop). El controller
// legacy NO expone CRUD estándar: solo 3 endpoints custom (crear / obtener /
// adjuntar paradas) — ver gestion-datos-go/internal/entidades/exportacionjobs.
// El worker que procesa los jobs pollea { estado: 'pendiente' } ordenado por
// fechaCreacion (índice compuesto del legacy, no modelado acá: es infra de
// Mongo, no forma del dato).
//
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts. `idCliente`/`idUsuario` son
// `@Prop({type: String})` en el legacy — String plano, SIN `ref` — por eso
// van sin `x-bson`/`x-ref` acá, a diferencia de la mayoría de los
// `idCliente` del resto del repo (verificado contra el legacy real,
// docs/MIGRACION.md §7 item 28). Solo `tipo` y `query` son
// `required: true`; el resto tiene a lo sumo un `default` (no bloquea el
// save si falta), así que solo esos dos quedan sin `.optional()`.
export const ExportJobSchema = z
  .object({
    _id: z.string().optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaInicio: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaFin: z.string().optional().meta({ 'x-bson': 'date' }),
    estado: EstadoExportJobSchema.optional(), // default 'pendiente'
    tipo: TipoExportJobSchema,
    // @Prop({type: Object, required: true}) en el legacy: Mixed, sin casteo
    // adentro. Lo que el generador necesita: { vehiculoId, rango, opciones,
    // vehiculoNombre, clienteNombre }.
    query: z.record(z.string(), z.unknown()).meta({ 'x-bson': 'mixed' }),
    // @Prop({type: [Object], default: []}) en el legacy: array real de
    // Mixed (paradas de tripero que gestion resuelve en background y
    // adjunta acá).
    paradas: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .meta({ 'x-bson': 'mixed' }),
    listoParaProcesar: z.boolean().optional(), // default true
    idCliente: z.string().optional(),
    idUsuario: z.string().optional(),
    nombreArchivo: z.string().optional(),
    objetoStorage: z.string().optional(),
    urlDescarga: z.string().optional(),
    progreso: z.number().optional(), // default 0
    cantidad: z.number().optional(),
    error: z.string().optional(),
    intentos: z.number().optional(), // default 0
  })
  .meta({ 'x-collection': 'exportjobs' });
export type IExportJob = z.infer<typeof ExportJobSchema>;

// Espejo de CreateDownlinkJobSchema: se omite `fechaCreacion` porque la pone
// el propio servicio al crear (default Date.now / nowUTC() en el handler
// Go), nunca el cliente.
export const CreateExportJobSchema = ExportJobSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type ICreateExportJob = z.infer<typeof CreateExportJobSchema>;

// La base tiene un campo required (`tipo`; `query` también lo es pero ambos
// sobreviven al omit), así que el `.partial()` acá NO es no-op — mismo
// motivo que UpdateDownlinkJobSchema.
export const UpdateExportJobSchema = ExportJobSchema.omit({
  _id: true,
  fechaCreacion: true,
}).partial();
export type IUpdateExportJob = z.infer<typeof UpdateExportJobSchema>;
