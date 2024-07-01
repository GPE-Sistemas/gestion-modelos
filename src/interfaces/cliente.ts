export interface IImagenesCliente {
  icono?: string;
  banner?: string;
}

export interface ITemaCliente {
  primaryColor?: string;
  accentColor?: string;
  warnColor?: string;
  typography?: string;
}

export interface IConfigCliente {
  imagenes?: IImagenesCliente;
  tema?: ITemaCliente;
  moduloFlota?: IModuloFlota;
  moduloAlarmasDomiciliarias?: IModuloAlarmasDomiciliarias;
}

export type ITipoCliente = 'Mayorista' | 'Minorista' | 'Final';

export interface IModuloFlota {
  crearDispositivos?: boolean;
  compartirFlota?: boolean;
}

export interface IModuloAlarmasDomiciliarias {
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
}

export interface ICliente {
  _id?: string;
  activo?: boolean;
  nombre?: string;
  fechaCreacion?: string;
  nivel?: number;
  config?: IConfigCliente;
  tipoCliente?: ITipoCliente;
}

type OmitirCreate = '_id';

export interface ICreateCliente extends Omit<Partial<ICliente>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'nivel' | 'tipoCliente' | 'fechaCreacion';

export interface IUpdateCliente extends Omit<Partial<ICliente>, OmitirUpdate> {}
