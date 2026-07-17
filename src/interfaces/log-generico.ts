import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';

export const TipoEntidadLogSchema = z.enum([
  'Luminaria',
  'Colectivo',
  'Activo',
  'Tracker',
  'Vehiculo',
]);
export type TipoEntidadLog = z.infer<typeof TipoEntidadLogSchema>;

/* ────────────────────────────────────────────────
 *  REPORTES POR TIPO
 * ────────────────────────────────────────────────*/

export const LogMensajeSchema = z.object({
  mensaje: z.string().optional(),
  protocolo: z.enum(['UDP', 'TCP']).optional(),
  origen: z.string().optional(),
  puerto: z.number().optional(),
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
  tipoEntidad?: TipoEntidadLog;
  tipoReporte?: T;
  valores?: MapaValoresLog[T];
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

export const LogGenericoSchema = z.object({
  _id: z.string(),
  fechaCreacion: z.string().optional(),
  idCliente: z.string().optional(),
  expireAt: z.string().optional(),
  //
  idsAncestros: z.array(z.string()).optional(),
  tipoEntidad: TipoEntidadLogSchema.optional(),
  tipoReporte: TipoLogsSchema.optional(),
  valores: LogMensajeSchema.optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type ILogGenerico = z.infer<typeof LogGenericoSchema>;

////// CREATE
export const CreateLogGenericoSchema = LogGenericoSchema.omit({
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
});
export type ICreateLogGenerico = z.infer<typeof CreateLogGenericoSchema>;

////// UPDATE
export const UpdateLogGenericoSchema = LogGenericoSchema.omit({
  _id: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
});
export type IUpdateLogGenerico = z.infer<typeof UpdateLogGenericoSchema>;
