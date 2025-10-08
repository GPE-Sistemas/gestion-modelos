import { IGeoJSONPoint } from "../auxiliares";
import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IGrupo } from "./grupo";
import { ILuminaria } from "./luminaria";
import { IRecorrido } from "./recorrido";
import { TipoTriangulacion } from "./reporte";
import { IModoLuminaria, ModoForzado } from "./reporte-dispositivo";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export type TipoValoresReporte =
  | "Luminaria GPE Periódico"
  | "Luminaria GPE Energía"
  | "Luminaria Wellness"
  | "Tracker 4G"
  | "Tracker T1000B"
  | "Tracker Qualcomm";
export type TipoEntidadReporte =
  | "Luminaria"
  | "Colectivo"
  | "Activo"
  | "Tracker"
  | "Vehiculo";

export interface IReporteLuminariaGPE {
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  modo?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  potencia?: number;
  voltaje?: number;
  dimmingValue?: number;
}
export interface IReporteLuminariaGPEEnergia {
  corriente?: number; // mA
  voltaje?: number; // V
  potencia?: number; // W
  energia?: number; // kWh
  energiaTotal?: number; //kWh acumulado
  factorPotencia?: number; //factor de potencia de la luminaria (dividido por 100)
}
export interface IReporteLuminariaWellness {
  dimmingValue?: number; // %
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  voltage?: number; // V
  current?: number; // A
  activePower?: number; // kWh - acumulada, se resetea cuando el nodo se reinicia
  reactivePower?: number; // kWh - acumulada, se resetea cuando el nodo se reinicia
  activePowerTotal?: number; // kWh - acumulada
  reactivePowerTotal?: number; // kWh - acumulada
  temperature?: number; // Grados Celsius
  lumenes?: number; // Lux
  modo?: IModoLuminaria;
  modoForzado?: ModoForzado;
}
export interface IReporteTracker {
  fechaDevice?: string;
  geojson?: IGeoJSONPoint;
  velocidad?: number;
  orientacion?: number;
}
export interface IReporteTracker4G extends IReporteTracker {
  // Datos de traccar
  traccarUniqueId?: string;
  odometro?: number;
}
export interface IReporteTrackerT1000B extends IReporteTracker {
  //Datos T1000B
  devEui?: string;
  bateria?: number;
  tipoTriangulacion?: TipoTriangulacion;
}
export interface IReporteTrackerQualcomm extends IReporteTracker {
  // Qualcomm
  bateria?: number;
  tipoTriangulacion?: TipoTriangulacion;
}

export interface IReporteGenerico {
  _id?: string;
  fechaCreacion?: string;
  // Tenant
  idCliente?: string;
  idsAncestros?: string[];
  idEntidad?: string; // aca va el id de la entidad que genera el reporte (dispositivoLora o tracker)
  idsAsignados?: string[]; // ids de las cosas asignadas al dispositivo o tracker (activo, recorrido, luminaria, grupos, chofer, etc)

  // Tipo y datos
  tipoEntidad?: TipoEntidadReporte;
  tipoReporte?: TipoValoresReporte;
  valores?: { timestamp?: string } & (
    | IReporteLuminariaGPE
    | IReporteLuminariaGPEEnergia
    | IReporteLuminariaWellness
    | IReporteTracker4G
    | IReporteTrackerT1000B
    | IReporteTrackerQualcomm
  );

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  // De ids asignados
  grupo?: IGrupo[];
  tracker?: ITracker;
  activo?: IActivo;
  recorrido?: IRecorrido;
  chofer?: IUsuario;
  luminaria?: ILuminaria;
}

type Omitir =
  | "_id"
  | "idsAncestros"
  // Virtuals
  | "cliente"
  | "ancestros"
  | "grupo"
  | "tracker"
  | "activo"
  | "recorrido"
  | "chofer"
  | "luminaria";

export interface ICreateReporteGenerico
  extends Omit<Partial<IReporteGenerico>, Omitir> {}
export interface IUpdateReporteGenerico
  extends Omit<Partial<IReporteGenerico>, Omitir> {}
