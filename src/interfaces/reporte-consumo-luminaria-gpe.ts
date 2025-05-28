import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";

export interface IConsumoLuminariaGPE {
  corriente: number; // mA
  voltaje: number; // V
  potencia: number; // W
  energia: number; // kWh
  factorPotencia: number; //factor de potencia de la luminaria (dividido por 100)
}

export interface IReporteConsumoLuminariaGPE {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  idDispositivoLorawan?: string;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IConsumoLuminariaGPE;
  esDeDia?: boolean; // Indica si el reporte es de día o de noche

  // Virtuals
  cliente?: ICliente;
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = "_id" | "fechaCreacion" | "cliente";

export interface ICreateReporteConsumoLuminariaGPE
  extends Omit<Partial<IReporteConsumoLuminariaGPE>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateReporteConsumoLuminariaGPE
  extends Omit<Partial<IReporteConsumoLuminariaGPE>, OmitirUpdate> {}
