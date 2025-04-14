import { ICoordenadaOL, ICoordenadas, IGeoJSONPoint } from "../auxiliares";
import { IActivo, TipoVehiculo } from "./activo";
import { ICliente } from "./cliente";
import { IGrupo } from "./grupo";
import { IRecorrido } from "./recorrido";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export interface IReporte {
  _id?: string;
  //
  idCliente?: string;
  idGrupo?: string;
  idTracker?: string;
  idActivo?: string;
  idRecorrido?: string;
  idChofer?: string;
  fechaCreacion?: string;
  tipo?: "Colectivo" | "Activo" | "Tracker" | "Vehiculo";
  geojson?: IGeoJSONPoint;
  fechaDevice?: string;
  // fechaServer?: string;
  // Datos de traccar
  traccarUniqueId?: string;
  velocidad?: number;
  orientacion?: number;
  odometro?: number;
  // reporteTraccar?: Record<string, any>;
  // Datos de Qualcomm
  serialNumber?: string;
  locationTechType?: string;
  radioAccessTechnology?: string;
  horizontalUncertainity?: number;
  // deviceReportId?: number;
  // fechaLectura?: string;
  // reporteQualcomm?: Record<string, any>;

  //Datos t1000b
  devEui?: string;

  //Qualcom y t100b
  bateria?: number;

  // Populate
  cliente?: ICliente;
  grupo?: IGrupo;
  tracker?: ITracker;
  activo?: IActivo;
  recorrido?: IRecorrido;
  chofer?: IUsuario;
  ubicacion?: ICoordenadas;
  ubicacionOl?: ICoordenadaOL;
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "tracker"
  | "activo"
  | "recorrido"
  | "grupo"
  | "chofer"
  | "ubicacion"
  | "ubicacionOl";

export interface ICreateReporte extends Omit<Partial<IReporte>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "tracker"
  | "activo"
  | "recorrido"
  | "grupo"
  | "chofer"
  | "ubicacion"
  | "ubicacionOl";

export interface IUpdateReporte extends Omit<Partial<IReporte>, OmitirUpdate> {}
