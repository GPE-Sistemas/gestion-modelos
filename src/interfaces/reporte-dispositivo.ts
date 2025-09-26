import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";

export type ModoForzado =
  | "No Forzado"
  | "Forzado Encendido"
  | "Forzado Apagado";

export type IModoLuminaria =
  | "Indeterminado"
  | "Fotocélula"
  | "Calendario"
  | "Manual"
  | "GPS";

export interface IReporteLuminaria {
  // TODO: Definir los tipos de las propiedades cuando sean conocidos
  [key: string]: any;
}
export interface IReporteLuminariaGPE {
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  modo?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  potencia?: number;
  voltaje: number;
  dimmingValue?: number;
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

export interface IReporteDispositivo {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idDispositivoLorawan?: string;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IReporteLuminaria;
  esDeDia?: boolean; // Indica si el reporte es de día o de noche
  horaAmanecer?: string; // Hora de amanecer del día del reporte
  horaAtardecer?: string; // Hora de atardecer del día del reporte
  fCnt?: number;

  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = "_id" | "fechaCreacion" | "cliente";

export interface ICreateReporteDispositivo
  extends Omit<Partial<IReporteDispositivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateReporteDispositivo
  extends Omit<Partial<IReporteDispositivo>, OmitirUpdate> {}
