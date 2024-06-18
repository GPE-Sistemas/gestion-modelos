import { ICliente } from "./cliente";
import { IFlota } from "./flota";
import { IParada, IRecorrido } from "./recorrido";
import { IVehiculo } from "./vehiculo";

export interface ITrackeo {
  _id?: string;
  //
  idCliente?: string;
  idFlota?: string;
  idRecorrido?: string;
  idColectivo?: string;

  fecha?: string;
  idParada?: string;
  fechaProximaParada?: string;
  idProximaParada?: string;

  // Populate
  cliente?: ICliente;
  flota?: IFlota;
  vehiculo?: IVehiculo;
  recorrido?: IRecorrido;
  parada?: IParada;
  proximaParada?: IParada;
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "flota"
  | "vehiculo"
  | "recorrido"
  | "parada"
  | "proximaParada";

export interface ICreateTrackeo extends Omit<Partial<ITrackeo>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "flota"
  | "vehiculo"
  | "recorrido"
  | "parada"
  | "proximaParada";

export interface IUpdateTrackeo extends Omit<Partial<ITrackeo>, OmitirUpdate> {}
