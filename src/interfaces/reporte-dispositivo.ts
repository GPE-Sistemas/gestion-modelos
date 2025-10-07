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
