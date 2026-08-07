import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import type { IDispositivoAlarma } from './dispositivo-alarma';
import type { ITracker } from './tracker';
import type { IUsuario } from './usuario';

// Nota: no se llama EstadoCuentaSchema porque cliente.ts ya exporta ese nombre
// (para el type EstadoCuenta) y el barrel `export *` daría TS2308.
export const EstadoCuentaEntidadSchema = z.enum(['Habilitado', 'Suspendido']);
export type estadoCuenta = z.infer<typeof EstadoCuentaEntidadSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo tracker↔activo↔usuario↔permiso↔alarma
// y revienta la serialización de declarations (TS7056) en este paquete y en
// los consumidores NestJS (compilan este fuente con declaration: true).
export const EstadoEntidadSchema = z
  .object({
    _id: z.string().optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    estado: EstadoCuentaEntidadSchema.optional(),
    idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }), /// POR DISPOSITIVO
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
    nota: z.string().optional(),
    motivos: z.array(z.string()).optional(),
    vigencia: z.string().optional().meta({ 'x-bson': 'date' }), // Desde cuando se aplica el estado
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
    usuario: z.custom<IUsuario>().optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idUsuario',
        foreignField: '_id',
        justOne: true,
      },
    }),
    alarma: z.custom<IDispositivoAlarma>().optional().meta({
      'x-populate': {
        ref: 'DispositivoAlarmaSchema',
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
  })
  .meta({ 'x-collection': 'estadoentidads' });

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
export interface IEstadoEntidad {
  _id?: string;
  fechaCreacion?: string;
  estado?: estadoCuenta;
  idEntidad?: string; /// POR DISPOSITIVO
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  nota?: string;
  motivos?: string[];
  vigencia?: string; // Desde cuando se aplica el estado
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  alarma?: IDispositivoAlarma;
  tracker?: ITracker;
}

type Omitir = '_id' | 'cliente' | 'usuario' | 'alarma' | 'tracker';

export const CreateEstadoEntidadSchema = EstadoEntidadSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  alarma: true,
  tracker: true,
});
export interface ICreateEstadoEntidad
  extends Omit<Partial<IEstadoEntidad>, Omitir> {}

export const UpdateEstadoEntidadSchema = EstadoEntidadSchema.omit({
  _id: true,
  cliente: true,
  usuario: true,
  alarma: true,
  tracker: true,
});
export interface IUpdateEstadoEntidad
  extends Omit<Partial<IEstadoEntidad>, Omitir> {}
