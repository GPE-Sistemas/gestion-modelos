import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IGrupo } from "./grupo";
import { IParada, IRecorrido } from "./recorrido";

export interface ITrackeo {
  _id?: string;
  //
  idCliente?: string;
  idFlota?: string;
  idRecorrido?: string;
  idActivo?: string;

  fecha?: string;
  idParada?: string;
  fechaProximaParada?: string;
  idProximaParada?: string;

  // Populate
  cliente?: ICliente;
  flota?: IGrupo;
  activo?: IActivo;
  recorrido?: IRecorrido;
  parada?: IParada;
  proximaParada?: IParada;
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "flota"
  | "activo"
  | "recorrido"
  | "parada"
  | "proximaParada";

export interface ICreateTrackeo extends Omit<Partial<ITrackeo>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "flota"
  | "activo"
  | "recorrido"
  | "parada"
  | "proximaParada";

export interface IUpdateTrackeo extends Omit<Partial<ITrackeo>, OmitirUpdate> {}
