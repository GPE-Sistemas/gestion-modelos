import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import type { IDispositivoLorawan } from './dispositivo-lorawan';
import type { ITracker } from './tracker';
import type { IUsuario } from './usuario';

export const EstadoComandoSchema = z.enum([
  'Enviado',
  'Recibido',
  'No Recibido',
  'Ejecutado',
  'En Cola',
  'No Ejecutado',
  'Descartado',
]);
export type IEstadoComando = z.infer<typeof EstadoComandoSchema>;

/**
 * Nivel/objetivo desde el que se origina un comando o downlink.
 *
 * Eje de PROCEDENCIA (qué entidad/acción originó el comando), ortogonal al `origen` (`OrigenDownlinkJob`, que es el eje de POLÍTICA: cómo se trata el
 * downlink).
 */
export const NivelObjetivoSchema = z.enum([
  'luminaria',
  'grupo',
  'puesta',
  'grupoPuesta',
]);
export type NivelObjetivo = z.infer<typeof NivelObjetivoSchema>;

export const ObjetivoComandoSchema = z.object({
  nivel: NivelObjetivoSchema,
  id: z.string(), // _id del objetivo (luminaria / grupo de luminarias/ puesta / grupo de puestas)
  nombre: z.string().optional(), // Denormalizado para que la UI muestre sin populate
});
export type IObjetivoComando = z.infer<typeof ObjetivoComandoSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const ComandoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idUsuario: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  fechaCreacion: z.string().optional(),
  payload: z.string().optional(),
  datosExtra: z.record(z.string(), z.any()).optional(),
  // Tracker
  idTracker: z.string().optional(),
  respuesta: z.string().optional(),
  // lorawan
  // Downlink
  deveui: z.string().optional(),
  puerto: z.number().optional(),
  //
  fechaActualizacion: z.string().optional(),
  estado: EstadoComandoSchema.optional(), // Default: Enviado
  fallos: z.number().optional(),
  fCnt: z.string().optional(),
  idChirpstack: z.string().optional(),
  objetivo: ObjetivoComandoSchema.optional(), // Procedencia: desde qué nivel/entidad se originó (luminaria/grupo/puesta/punto-alim)

  // Virtuals
  tracker: z.custom<ITracker>().optional(),
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  usuario: z.custom<IUsuario>().optional(),
  dispositivo: z.custom<IDispositivoLorawan>().optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
export interface IComando {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  nombre?: string;
  descripcion?: string;
  fechaCreacion?: string;
  payload?: string;
  datosExtra?: Record<string, any>;
  // Tracker
  idTracker?: string;
  respuesta?: string;
  // lorawan
  // Downlink
  deveui?: string;
  puerto?: number;
  //
  fechaActualizacion?: string;
  estado?: IEstadoComando; // Default: Enviado
  fallos?: number;
  fCnt?: string;
  idChirpstack?: string;
  objetivo?: IObjetivoComando; // Procedencia: desde qué nivel/entidad se originó (luminaria/grupo/puesta/punto-alim)

  // Virtuals
  tracker?: ITracker;
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  dispositivo?: IDispositivoLorawan;
}

export const CreateComandoSchema = ComandoSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
  ancestros: true,
  usuario: true,
  tracker: true,
  dispositivo: true,
});

type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'cliente'
  | 'ancestros'
  | 'usuario'
  | 'tracker'
  | 'dispositivo';
export interface ICreateComando extends Omit<Partial<IComando>, OmitirCreate> {}

export const UpdateComandoSchema = ComandoSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
  usuario: true,
  ancestros: true,
  tracker: true,
  dispositivo: true,
});

type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'cliente'
  | 'usuario'
  | 'ancestros'
  | 'tracker'
  | 'dispositivo';
export interface IUpdateComando extends Omit<Partial<IComando>, OmitirUpdate> {}
