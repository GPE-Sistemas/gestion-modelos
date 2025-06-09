export interface IImagenesCliente {
  icono?: string;
  banner?: string;
  bannerModoOscuro?: string;
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
  moduloDispositivosLorawan?: IModuloDispositivosLorawan;
  moduloActivos?: IModuloActivos;
  moduloAdministracion?: IModuloAdministracion;
  moduloEventosTecnicos?: IModuloEventosTecnicos;
  moduloVehiculos?: IModuloVehiculos;
  moduloLuminarias?: IModuloLuminarias;
  moduloEmergenciasMedicas?: IModuloEmergenciasMedicas;
  modulosIntegraciones?: IModulosIntegraciones;
  moduloHerramientas?: IModuloHerramientas;
  idsClientesQuePuedenAtenderEventos?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
}

export type ITipoCliente = "Mayorista" | "Minorista" | "Final";

export type EstadoCuenta = "Activo" | "Suspendido" | "Moroso";
export interface IModulosIntegraciones {
  activo?: boolean;
  moduloBotonDePanico?: IModuloBotonDePanico;
}

export interface IModuloBotonDePanico {
  appkey?: string;
  activo?: boolean;
}

export interface IModuloLuminarias {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirLuminarias?: boolean;
}

export interface IModuloEmergenciasMedicas {
  activo?: boolean;
  crearEmergenciasMedicas?: boolean;
}

export interface IModuloColectivos {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirFlota?: boolean;
}

export interface IModuloAlarmasDomiciliarias {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirAlarmas?: boolean;
}

export interface IModuloDispositivosLorawan {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirDispositivosLorawan?: boolean;
}

export interface IModuloActivos {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirActivos?: boolean;
}

export interface IModuloAdministracion {
  activo?: boolean;
  crearUsuarios?: boolean;
  crearServicios?: boolean;
  crearApikeys?: boolean;
  crearDispositivosLorawan?: boolean;
}

export interface IModuloVehiculos {
  activo?: boolean;
  crearVehiculos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirVehiculos?: boolean;
}

export interface IModuloEventosTecnicos {
  activo?: boolean;
}

export interface IModuloHerramientas {
  activo?: boolean;
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
  numeroCliente?: string;
  habilitado?: boolean;
  // Populate
  padre?: ICliente;
}

type OmitirCreate = "_id" | "padre";

export interface ICreateCliente extends Omit<Partial<ICliente>, OmitirCreate> {}

type OmitirUpdate = "_id" | "nivel" | "tipoCliente" | "fechaCreacion" | "padre";

export interface IUpdateCliente extends Omit<Partial<ICliente>, OmitirUpdate> {}
