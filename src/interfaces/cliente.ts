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
}

export type IPermisoCliente =
  | "Administrador"
  | "Crear clientes"
  | "Crear trackers"
  | "Cliente final";

export interface ICliente {
  _id?: string;
  activo?: boolean;
  nombre?: string;
  fechaCreacion?: string;
  nivel: number;
  config?: IConfigCliente;
  permisos?: IPermisoCliente[];
}

type OmitirCreate = "_id";

export interface ICreateCliente extends Omit<Partial<ICliente>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateCliente extends Omit<Partial<ICliente>, OmitirUpdate> {}
