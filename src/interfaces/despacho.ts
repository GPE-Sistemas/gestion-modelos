import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { CronogramaSchema } from './cronograma';
import { RecorridoSchema } from './recorrido';
import { UsuarioSchema } from './usuario';

export const DespachoSchema = z.object({
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
  idUsuario: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  //
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  fecha: z.string().optional(),
  hora: z.string().optional(), // Sale
  salio: z.string().optional(), // Salió
  idCronograma: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'CronogramaSchema' }),
  idActivo: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
  idChofer: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
  idsRecorridos: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'RecorridoSchema' }),
  // No está en el schema Mongoose legacy (drift documentado en meta.go:
  // "Campos que estaban en el schema zod y faltaban acá"). Sin @Prop({ref}),
  // así que solo lleva el casteo, no populate.
  idRecorridoActual: z.string().optional().meta({ 'x-bson': 'objectId' }),
  completado: z.boolean().optional(), /// Que los datos son iguales al cronograma
  cancelado: z.boolean().optional(), /// Que el despacho fue cancelado
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
  usuario: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idUsuario',
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
  chofer: UsuarioSchema.optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'idChofer',
      foreignField: '_id',
      justOne: true,
    },
  }),
  recorridos: z.array(RecorridoSchema).optional().meta({
    'x-populate': {
      ref: 'RecorridoSchema',
      localField: 'idsRecorridos',
      foreignField: '_id',
      justOne: false,
    },
  }),
  cronograma: CronogramaSchema.optional().meta({
    'x-populate': {
      ref: 'CronogramaSchema',
      localField: 'idCronograma',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'despachos' });
export type IDespacho = z.infer<typeof DespachoSchema>;

export const CreateDespachoSchema = DespachoSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  fechaCreacion: true,
  activo: true,
  chofer: true,
  recorridos: true,
  cronograma: true,
});
export type ICreateDespacho = z.infer<typeof CreateDespachoSchema>;

export const UpdateDespachoSchema = DespachoSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  fechaCreacion: true,
  activo: true,
  chofer: true,
  recorridos: true,
  cronograma: true,
});
export type IUpdateDespacho = z.infer<typeof UpdateDespachoSchema>;
