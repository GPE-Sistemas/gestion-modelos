import { IGeoJSONPoint } from "../auxiliares";
import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";
import { IGrupo } from "./grupo";
import { IModeloDispositivo } from "./modelo-dispositivo";
import { IReporteDispositivo } from "./reporte-dispositivo";

export type EstadoLuminaria = "Operativa" | "Mantenimiento";

export interface ILuminaria {
  _id?: string;
  fechaCreacion?: string; // Default: Date.now
  idCliente?: string;
  idsAncestros?: string[];
  idUltimoReporte?: string;
  deveui?: string; // Deveui del dispositivo lorawan
  identificacion?: string;
  ubicacion?: IGeoJSONPoint; // GeoJSON de la ubicacion de la luminaria
  direccion?: string; // Direccion de la luminaria
  idModeloDispositivo?: string; // ID del modelo de dispositivo
  idsGrupos?: string[];
  tiempoEncendida?: string; //En horas minutos y segundos
  resetearEncendido?: boolean; // Indica si se debe resetear el contador de tiempo encendida en el proximo reporte

  // Estado actual de la luminaria
  estado?: EstadoLuminaria;

  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
  dispositivo?: IDispositivoLorawan;
  modeloDispositivo?: IModeloDispositivo;
  ultimoReporte?: IReporteDispositivo;
  grupos?: IGrupo[];
}

////// CREATE
type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "dispositivo"
  | "modeloDispositivo";
export interface ICreateLuminaria
  extends Omit<Partial<ILuminaria>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "dispositivo"
  | "modeloDispositivo";
export interface IUpdateLuminaria
  extends Omit<Partial<ILuminaria>, OmitirUpdate> {}
