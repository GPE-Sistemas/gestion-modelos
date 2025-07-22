import { ICliente } from "./cliente";

export type Rol =
  | "Administrador"
  | "Operador"
  | "Conductor"
  | "Chofer Colectivo"
  | "Consultor"
  | "Técnico"
  | "Final"
  | "Coordinador Emergencias Médicas"
  | "Registrador Emergencias Médicas";

export interface IModulos {
  moduloColectivos?: boolean;
  moduloAlarmasDomiciliarias?: boolean;
  moduloLuminarias?: boolean;
  moduloEmergenciasMedicas?: boolean;
  moduloEmergenciasBomberos?: boolean;
  moduloActivos?: boolean;
  moduloAdministracion?: boolean;
  moduloEventosTecnicos?: boolean;
  moduloVehiculos?: boolean;
  moduloHerramientas?: boolean;
}

export interface IDatosPersonales {
  nombre?: string;
  dni?: string;
  sexo?: boolean;
  email?: string;
  direccion?: string;
  pais?: string;
  telefono?: string;
  fechaNacimiento?: string;
  foto?: string;
}

export interface IConfigUsuario {
  notasEnPrimerPlano?: boolean;
  cantMapasVehiculos?: number;
  noMostrarGuardarClaveAlarma?: boolean;
  clavesAlarma?: IClaveUsuarioAlarma[];
}

export interface IClaveUsuarioAlarma {
  idAlarma?: string;
  clave?: string;
}

export interface IPermiso {
  idCliente?: string;
  idsEntidades?: string[];
  roles?: Rol[];
  modulos?: IModulos;
  activo?: boolean;
  // Virtual
  cliente?: ICliente;
}

export interface IUsuario {
  _id?: string;
  identificacionInterna?: string;
  idCliente?: string;
  permisos?: IPermiso[];
  //
  idExterno?: string;
  fechaCreacion?: string;
  usuario?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  config?: IConfigUsuario;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente" | "fechaCreacion";

export interface ICreateUsuario extends Omit<Partial<IUsuario>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "fechaCreacion";

export interface IUpdateUsuario extends Omit<Partial<IUsuario>, OmitirUpdate> {}
