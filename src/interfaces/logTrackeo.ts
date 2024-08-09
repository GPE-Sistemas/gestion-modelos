import { ICliente } from "./cliente";
import { IVehiculo } from "./vehiculo";

export interface ILogTrackeo {
  _id?: string;
  //
  idCliente?: string;
  idVehiculo?: string;
  fecha?: string;
  nuevaParada?: boolean;
  indexUltimaParada?: number;
  indexParadaActual?: number;
  ultimaParada?: string;
  paradaActual?: string;
  totalParadas?: number;
  motivo?: string;

  // Populate
  cliente?: ICliente;
  vehiculo?: IVehiculo;
}

type OmitirCreate = "_id" | "cliente" | "vehiculo";

export interface ICreateLogTrackeo
  extends Omit<Partial<ILogTrackeo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "vehiculo";

export interface IUpdateLogTrackeo
  extends Omit<Partial<ILogTrackeo>, OmitirUpdate> {}
