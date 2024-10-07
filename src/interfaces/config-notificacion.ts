import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IFlota } from "./flota";
import { IUsuario } from "./usuario";
import { IVehiculo } from "./vehiculo";

export type TipoEnvio = "SMS" | "WhatsApp" | "Llamada" | "Notificacion Push";

export type Agrupacion = "Flota" | "Entidad";

export type TipoEntidad = "Activo" | "Vehiculo";

export interface CondicionNotificacion {
  activo?: {
    ubicacion?: {
      idUbicacion: string;
      dentro?: boolean;
      fuera?: boolean;
    };
  };
  vehiculo?: {
    ubicacion?: {
      idUbicacion: string;
      dentro?: boolean;
      fuera?: boolean;
    };
    velocidad?: {
      "superior a": number;
    };
  };
}

export interface IConfigNotificacion {
  _id?: string;
  // Tipo de envio de la notificacion
  tipoEnvio?: TipoEnvio;
  // Tipo de dispositivo
  tipoEntidad?: TipoEntidad;
  // Configuracion de la condicion para enviar la notificacion
  condicion?: CondicionNotificacion;
  // Agrupacion para buscar las entidades
  agrupacion?: Agrupacion;
  // Sobre que entidades se reciben las notificaciones
  idCliente?: string;
  idFlota?: string;
  idsEntidades?: string[];
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];

  // Virtual
  usuarios?: IUsuario[];
  cliente?: ICliente;
  flota?: IFlota;
  // Entidades
  activos?: IActivo[];
  vehiculos?: IVehiculo[];
}

type OmitirCreate =
  | "_id"
  | "usuarios"
  | "cliente"
  | "flota"
  | "activos"
  | "vehiculos";
export interface ICreateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "usuarios"
  | "cliente"
  | "flota"
  | "activos"
  | "vehiculos";
export interface IUpdateConfigNotificacion
  extends Omit<Partial<IConfigNotificacion>, OmitirUpdate> {}
