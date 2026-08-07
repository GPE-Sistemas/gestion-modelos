import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { GrupoSchema } from './grupo';
import { ParadaSchema, RecorridoSchema } from './recorrido';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts. Mismo shape que TrackeoSchema (ver
// trackeo.ts), salvo que acá NO existe el populate/virtual "ancestros": el
// legacy (ultimo-trackeo/schema.ts) nunca lo declaró, así que el meta.go de
// ultimotrackeos no tiene esa clave en Virtuals — fiel al legacy, no un error.
export const UltimoTrackeoSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idGrupo: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'GrupoSchema' }),
  idRecorrido: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'RecorridoSchema' }),
  idActivo: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),

  fecha: z.string().optional().meta({ 'x-bson': 'date' }),
  idParada: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId' }),
  indiceParada: z.number().optional(),
  fechaProximaParada: z.string().optional().meta({ 'x-bson': 'date' }),
  // Contraintuitivo pero fiel al legacy: @Prop({ref: Recorrido.name}) en
  // idProximaParada (schema.ts), replicado tal cual en Virtuals.idProximaParada.
  idProximaParada: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'RecorridoSchema' }),

  // Populate
  cliente: ClienteSchema.optional().meta({
    'x-populate': {
      ref: 'ClienteSchema',
      localField: 'idCliente',
      foreignField: '_id',
      justOne: true,
    },
  }),
  // Rareza del schema legacy: grupo matchea idGrupo contra traccar.uniqueId
  // del grupo, no contra su _id.
  grupo: GrupoSchema.optional().meta({
    'x-populate': {
      ref: 'GrupoSchema',
      localField: 'idGrupo',
      foreignField: 'traccar.uniqueId',
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
  recorrido: RecorridoSchema.optional().meta({
    'x-populate': {
      ref: 'RecorridoSchema',
      localField: 'idRecorrido',
      foreignField: '_id',
      justOne: true,
    },
  }),
  // parada es subdocumento de recorrido: el populate devuelve el RECORRIDO
  // contenedor (foreignField paradas._id), no un documento "Parada" suelto.
  parada: ParadaSchema.optional().meta({
    'x-populate': {
      ref: 'RecorridoSchema',
      localField: 'idParada',
      foreignField: 'paradas._id',
      justOne: true,
    },
  }),
  proximaParada: ParadaSchema.optional().meta({
    'x-populate': {
      ref: 'ParadaSchema',
      localField: 'idProximaParada',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'ultimotrackeos' });
export type IUltimoTrackeo = z.infer<typeof UltimoTrackeoSchema>;

export const CreateUltimoTrackeoSchema = UltimoTrackeoSchema.omit({
  _id: true,
  cliente: true,
  grupo: true,
  activo: true,
  recorrido: true,
  parada: true,
  proximaParada: true,
});
export type ICreateUltimoTrackeo = z.infer<typeof CreateUltimoTrackeoSchema>;

export const UpdateUltimoTrackeoSchema = UltimoTrackeoSchema.omit({
  _id: true,
  cliente: true,
  grupo: true,
  activo: true,
  recorrido: true,
  parada: true,
  proximaParada: true,
});
export type IUpdateUltimoTrackeo = z.infer<typeof UpdateUltimoTrackeoSchema>;
