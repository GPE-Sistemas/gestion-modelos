import { ICoordenadaOL, ICoordenadas, IGeoJSONPoint } from "../auxiliares";
import { ICliente } from "./cliente";
import { IFlota } from "./flota";
import { IRecorrido } from "./recorrido";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";
import { IVehiculo } from "./vehiculo";

export interface IReporte {
  _id?: string;
  //
  idCliente?: string;
  idFlota?: string;
  idTracker?: string;
  idVehiculo?: string;
  idRecorrido?: string;
  idChofer?: string;
  // Datos de traccar
  traccarUniqueId?: string;
  fechaDevice?: string;
  fechaServer?: string;
  fechaCreacion?: string;
  geojson?: IGeoJSONPoint;
  velocidad?: number;
  reporteTraccar?: Record<string, any>;
  // Populate
  cliente?: ICliente;
  flota?: IFlota;
  tracker?: ITracker;
  vehiculo?: IVehiculo;
  recorrido?: IRecorrido;
  chofer?: IUsuario;
  ubicacion?: ICoordenadas;
  ubicacionOl?: ICoordenadaOL;
}

type OmitirCreate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "tracker"
  | "vehiculo"
  | "recorrido"
  | "flota"
  | "chofer"
  | "ubicacion"
  | "ubicacionOl";

export interface ICreateReporte extends Omit<Partial<IReporte>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "fechaCreacion"
  | "cliente"
  | "tracker"
  | "vehiculo"
  | "recorrido"
  | "flota"
  | "chofer"
  | "ubicacion"
  | "ubicacionOl";

export interface IUpdateReporte extends Omit<Partial<IReporte>, OmitirUpdate> {}
