import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";

export interface IReporteLuminaria {
  // TODO: Definir los tipos de las propiedades cuando sean conocidos
  [key: string]: any;
}

export interface IReporteDispositivo {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  idDispositivoLorawan?: string;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];
  // Datos especificos de acuerdo al tipo de dispositivo
  valores?: IReporteLuminaria;

  // Virtuals
  cliente?: ICliente;
  // dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = "_id" | "fechaCreacion" | "cliente";

export interface ICreateReporteDispositivo
  extends Omit<Partial<IReporteDispositivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateReporteDispositivo
  extends Omit<Partial<IReporteDispositivo>, OmitirUpdate> {}
