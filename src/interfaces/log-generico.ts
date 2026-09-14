import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import {
  DispositivoAlarmaSchema,
  IDispositivoAlarma,
} from './dispositivo-alarma';
import { ITracker, TrackerSchema } from './tracker';

export const TipoEntidadLogSchema = z.enum([
  'Luminaria',
  'Colectivo',
  'Activo',
  'Tracker',
  'Vehiculo',
  'Alarma',
]);
export type TipoEntidadLog = z.infer<typeof TipoEntidadLogSchema>;

export const DireccionLogSchema = z.enum(['Entrada', 'Salida']);
export type DireccionLog = z.infer<typeof DireccionLogSchema>;

export const ResultadoParseoLogSchema = z.enum([
  'OK',
  'Error',
  'No configurado',
]);
export type ResultadoParseoLog = z.infer<typeof ResultadoParseoLogSchema>;

/* ────────────────────────────────────────────────
 *  REPORTES POR TIPO
 * ────────────────────────────────────────────────*/

export const LogMensajeSchema = z.object({
  /** Frame tal cual llegó, interpretado como texto (ASCII). */
  mensaje: z.string().optional(),
  /** El mismo frame en hexadecimal, para los protocolos binarios. */
  hex: z.string().optional(),
  protocolo: z.enum(['UDP', 'TCP']).optional(),
  origen: z.string().optional(),
  puerto: z.number().optional(),
  puertoLocal: z.number().optional(),
  direccion: DireccionLogSchema.optional(),
  idUnico: z.string().optional(),
  nombreProtocolo: z.string().optional(),
  codigo: z.string().optional(),
  parseo: ResultadoParseoLogSchema.optional(),
});
export type ILogMensaje = z.infer<typeof LogMensajeSchema>;

export type MapaValoresLog = {
  'Log Mensaje': ILogMensaje;
};

export const TipoLogsSchema = z.enum(['Log Mensaje']);
export type TipoLogs = z.infer<typeof TipoLogsSchema>;

export interface ILogBase<T extends keyof MapaValoresLog> {
  _id: string;
  fechaCreacion?: string;
  idCliente?: string;
  expireAt?: string;
  //
  idsAncestros?: string[];
  idEntidad?: string;
  tipoEntidad?: TipoEntidadLog;
  tipoReporte?: T;
  valores?: MapaValoresLog[T];
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  tracker?: ITracker;
  dispositivoAlarma?: IDispositivoAlarma;
}

export const LogGenericoSchema = z
  .object({
    _id: z.string(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    expireAt: z.string().optional().meta({ 'x-bson': 'date' }),
    //
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }),
    tipoEntidad: TipoEntidadLogSchema.optional(),
    tipoReporte: TipoLogsSchema.optional(),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    valores: LogMensajeSchema.optional().meta({ 'x-bson': 'mixed' }),
    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z
      .array(ClienteSchema)
      .optional()
      .meta({
        'x-populate': {
          ref: 'ClienteSchema',
          localField: 'idsAncestros',
          foreignField: '_id',
          justOne: false,
        },
      }),
    tracker: TrackerSchema.optional().meta({
      'x-populate': {
        ref: 'TrackerSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    dispositivoAlarma: DispositivoAlarmaSchema.optional().meta({
      'x-populate': {
        ref: 'DispositivoAlarmaSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'loggenericos' });
export type ILogGenerico = z.infer<typeof LogGenericoSchema>;

////// CREATE
export const CreateLogGenericoSchema = LogGenericoSchema.omit({
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
  tracker: true,
  dispositivoAlarma: true,
});
export type ICreateLogGenerico = z.infer<typeof CreateLogGenericoSchema>;

////// UPDATE
export const UpdateLogGenericoSchema = LogGenericoSchema.omit({
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
  tracker: true,
  dispositivoAlarma: true,
});
export type IUpdateLogGenerico = z.infer<typeof UpdateLogGenericoSchema>;
