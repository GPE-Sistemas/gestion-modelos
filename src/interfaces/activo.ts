import { z } from 'zod';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  ICliente,
  IConfigHorario,
} from './cliente';
import type { IModoDesactivado } from './dispositivo-alarma';
import type { estadoCuenta } from './estado-entidad';
import type { IGrupo } from './grupo';
import type { IRecorrido } from './recorrido';
import type { ITracker } from './tracker';
import type { IUsuario } from './usuario';

export const TipoVehiculoSchema = z.enum([
  'Auto',
  'Camion',
  'Camioneta',
  'Colectivo',
  'Grua',
  'Moto',
  'Otro',
]);
export type TipoVehiculo = z.infer<typeof TipoVehiculoSchema>;

export const FuncionActivoSchema = z.enum([
  'Ambulancia',
  'Bomberos',
  'Mantenimiento',
  'Particular',
  'Policia',
  'Seguridad Privada',
  'Servicio Técnico',
  'Transporte',
  'Otro',
]);
export type FuncionActivo = z.infer<typeof FuncionActivoSchema>;

export const EstadoVehiculoSchema = z.enum([
  'Operativo',
  'En mantenimiento',
  'Fuera de servicio',
]);
export type EstadoVehiculo = z.infer<typeof EstadoVehiculoSchema>;

export const CategoriaActivoSchema = z.enum([
  'Normal',
  'Vehículo',
  'Colectivo',
]);
export type ICategoriaActivo = z.infer<typeof CategoriaActivoSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const VehiculoSchema = z.object({
  tipo: TipoVehiculoSchema.optional(),
  patente: z.string().optional(),
  estado: EstadoVehiculoSchema.optional(),
  modelo: z.string().optional(),
  marca: z.string().optional(),
  anio: z.string().optional(),
  consumoRuta: z.number().optional(), // litros cada 100 km
  consumoCiudad: z.number().optional(), // litros cada 100 km
  capacidadCombustible: z.number().optional(), // litros
  //
  idChofer: z.string().optional(),
  idRecorrido: z.string().optional(),
  idsRecorridos: z.array(z.string()).optional(),
  dentroDelRecorrido: z.boolean().optional(), // Para seguir el estado de los eventos
  ignicion: z.boolean().optional(),
  //
  idExterno: z.string().optional(),
  // Populate
  chofer: z.custom<IUsuario>().optional(),
  recorrido: z.custom<IRecorrido>().optional(),
  recorridos: z.array(z.custom<IRecorrido>()).optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IVehiculo {
  tipo?: TipoVehiculo;
  patente?: string;
  estado?: EstadoVehiculo;
  modelo?: string;
  marca?: string;
  anio?: string;
  consumoRuta?: number; // litros cada 100 km
  consumoCiudad?: number; // litros cada 100 km
  capacidadCombustible?: number; // litros
  //
  idChofer?: string;
  idRecorrido?: string;
  idsRecorridos?: string[];
  dentroDelRecorrido?: boolean; // Para seguir el estado de los eventos
  ignicion?: boolean;
  //
  idExterno?: string;
  // Populate
  chofer?: IUsuario;
  recorrido?: IRecorrido;
  recorridos?: IRecorrido[];
}

export const VehiculoCacheSchema = VehiculoSchema.omit({
  chofer: true,
  recorrido: true,
  recorridos: true,
});
export interface IVehiculoCache extends Omit<
  IVehiculo,
  'chofer' | 'recorrido' | 'recorridos'
> {}

export const ActivoSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idGrupo: z.string().optional(),
  idTracker: z.string().optional(),
  ///alta de activo
  fechaAlta: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
  // es la imagen en la posición 0 de imagenes, pero reducida para usarla en el mapa
  imagenMiniatura: z.string().optional(),
  identificacion: z.string().optional(),
  categoria: CategoriaActivoSchema.optional(),
  funcion: FuncionActivoSchema.optional(),
  vehiculo: VehiculoSchema.optional(),
  idsClientesQuePuedenAtender: z.array(z.string()).optional(),
  idsClientesQuePuedenAtenderEventosTecnicos: z.array(z.string()).optional(),
  puedeSolicitarServicioTecnico: z.boolean().optional(),
  configHorariosAtencion: z.array(ConfigHorarioSchema).optional(),
  configHorariosAtencionTecnica: z.array(ConfigHorarioSchema).optional(),
  modoDesactivado: z.custom<IModoDesactivado>().optional(),

  estadoCuenta: z.custom<estadoCuenta>().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  tracker: z.custom<ITracker>().optional(),
  grupo: z.custom<IGrupo>().optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IActivo {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  idGrupo?: string;
  idTracker?: string;
  ///alta de activo
  fechaAlta?: string;
  imagenes?: string[];
  // es la imagen en la posición 0 de imagenes, pero reducida para usarla en el mapa
  imagenMiniatura?: string;
  identificacion?: string;
  categoria?: ICategoriaActivo;
  funcion?: FuncionActivo;
  vehiculo?: IVehiculo;
  idsClientesQuePuedenAtender?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  puedeSolicitarServicioTecnico?: boolean;
  configHorariosAtencion?: IConfigHorario[];
  configHorariosAtencionTecnica?: IConfigHorario[];
  modoDesactivado?: IModoDesactivado;

  estadoCuenta?: estadoCuenta;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  tracker?: ITracker;
  grupo?: IGrupo;
}

type OmitirCreate = '_id' | 'cliente' | 'tracker';

export const CreateActivoSchema = ActivoSchema.omit({
  _id: true,
  cliente: true,
  tracker: true,
});
export interface ICreateActivo extends Omit<Partial<IActivo>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'tracker';

export const UpdateActivoSchema = ActivoSchema.omit({
  _id: true,
  cliente: true,
  tracker: true,
});
export interface IUpdateActivo extends Omit<Partial<IActivo>, OmitirUpdate> {}

export const ActivoCacheSchema = ActivoSchema.omit({
  cliente: true,
  ancestros: true,
  tracker: true,
  grupo: true,
  vehiculo: true,
}).extend({
  vehiculo: VehiculoCacheSchema.optional(),
});
export interface IActivoCache extends Omit<
  IActivo,
  'cliente' | 'ancestros' | 'tracker' | 'grupo' | 'vehiculo'
> {
  vehiculo?: IVehiculoCache;
}
