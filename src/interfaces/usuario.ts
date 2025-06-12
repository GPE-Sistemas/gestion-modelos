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

export interface IPermiso {
  moduloColectivos?: boolean;
  moduloAlarmasDomiciliarias?: boolean;
  moduloLuminarias?: boolean;
  moduloEmergenciasMedicas?: boolean;
  moduloActivos?: boolean;
  moduloAdministracion?: boolean;
  moduloEventosTecnicos?: boolean;
  moduloVehiculos?: boolean;
  moduloHerramientas?: boolean;
  idsEntidades: string[];
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
}

export interface IUsuario {
  _id?: string;
  identificacionInterna?: string;
  idCliente?: string;
  idsClientes?: string[];
  //
  idExterno?: string;
  activo?: boolean;
  fechaCreacion?: string;
  roles?: Rol[];
  permisos?: IPermiso;
  usuario?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  config?: IConfigUsuario;
  // Populate
  cliente?: ICliente;
  clientes?: ICliente[];
}

type OmitirCreate = "_id" | "cliente" | "fechaCreacion" | "clientes";

export interface ICreateUsuario extends Omit<Partial<IUsuario>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "fechaCreacion" | "clientes";

export interface IUpdateUsuario extends Omit<Partial<IUsuario>, OmitirUpdate> {}
