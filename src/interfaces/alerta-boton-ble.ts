import { ICliente } from "./cliente";
import { IDispositivoLorawan } from "./dispositivo-lorawan";
import { ILuminaria } from "./luminaria";

export interface IAlertaBotonBLE {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  idDispositivoLorawan?: string;
  idLuminaria?: string;
  mac?: string;

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
  luminaria?: ILuminaria;
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id" | "fechaCreacion";

export interface ICreateAlertaBotonBLE
  extends Omit<Partial<IAlertaBotonBLE>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateAlertaBotonBLE
  extends Omit<Partial<IAlertaBotonBLE>, OmitirUpdate> {}
