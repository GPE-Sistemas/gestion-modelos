import { IServicioContratado } from './servicio-contratado';

export interface IImagenesCliente {
  icono?: string;
  banner?: string;
}

export interface ITemaCliente {
  primaryColor?: string;
  accentColor?: string;
  warnColor?: string;
  backgroundColor?: string;
  typography?: string;
}

export interface IConfigCliente {
  imagenes?: IImagenesCliente;
  tema?: ITemaCliente;
  moduloColectivos?: IModuloColectivos;
  moduloAlarmasDomiciliarias?: IModuloAlarmasDomiciliarias;
  moduloActivos?: IModuloActivos;
}

export type ITipoCliente = 'Mayorista' | 'Minorista' | 'Final';

export type EstadoCuenta = 'Activo' | 'Suspendido' | 'Moroso';

export interface IModuloColectivos {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  compartirFlota?: boolean;
}

export interface IModuloAlarmasDomiciliarias {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  compartirAlarmas?: boolean;
}

export interface IModuloActivos {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  compartirActivos?: boolean;
}

export interface ICliente {
  _id?: string;
  idPadre?: string;
  activo?: boolean;
  nombre?: string;
  fechaCreacion?: string;
  nivel?: number;
  config?: IConfigCliente;
  tipoCliente?: ITipoCliente;
  estadoDeCuenta?: EstadoCuenta;
  idServiciosContratados?: string[];
  numeroCliente?: string;
  // Populate
  padre?: ICliente;
  serviciosContratados?: IServicioContratado[];
}

type OmitirCreate = '_id' | 'padre' | 'serviciosContratados';

export interface ICreateCliente extends Omit<Partial<ICliente>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'nivel' | 'tipoCliente' | 'fechaCreacion' | 'padre';

export interface IUpdateCliente extends Omit<Partial<ICliente>, OmitirUpdate> {}
