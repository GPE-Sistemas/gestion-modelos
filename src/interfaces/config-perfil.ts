import { ICliente } from "./cliente";
import {
  IConfigDispositivoGPEPayload,
  IDimmerCalendarioConfig,
} from "./dispositivo-lorawan";

export type TipoValoresConfigPerfil =
  | "Luminaria GPE Config"
  | "Luminaria GPE Dimmer Calendario";

export type TipoEntidadConfigPerfil =
  | "Luminaria"
  | "Colectivo"
  | "Activo"
  | "Tracker"
  | "Vehiculo";

//Estos perfiles son para definir valores por defecto de configuraciones que tienen que tener ciertas entidades.
//Ej: en luminarias, definen configuraciones que se envían mediante comandos

export interface IConfigPerfil {
  _id?: string;
  fechaCreacion?: string;
  nombre?: string;
  // Tenant
  idCliente?: string;
  idsAncestros?: string[];

  // Tipo y datos
  tipoEntidad?: TipoEntidadConfigPerfil;
  tipoConfig?: TipoValoresConfigPerfil;
  valores?: IConfigDispositivoGPEPayload | IDimmerCalendarioConfig;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type Omitir =
  | "_id"
  | "idsAncestros"
  // Virtuals
  | "cliente"
  | "ancestros";

export interface ICreateConfigPerfil
  extends Omit<Partial<IConfigPerfil>, Omitir> {}
export interface IUpdateConfigPerfil
  extends Omit<Partial<IConfigPerfil>, Omitir> {}
