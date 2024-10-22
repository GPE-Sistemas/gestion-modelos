import { ICliente } from "./cliente";

export type Rol = "Administrador" | "Operador" | "Chofer" | "Consultor";

export interface IPermiso {
  moduloColectivos?: boolean;
  moduloAlarmasDomiciliarias?: boolean;
  moduloActivos?: boolean;
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

export interface IUsuario {
  _id?: string;
  identificacionInterna?: string;
  idCliente?: string;
  activo?: boolean;
  fechaCreacion?: string;
  roles?: Rol[];
  permisos?: IPermiso;
  usuario?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateUsuario extends Omit<Partial<IUsuario>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateUsuario extends Omit<Partial<IUsuario>, OmitirUpdate> {}
