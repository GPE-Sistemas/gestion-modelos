import { IDispositivoLorawan } from "./dispositivo-lorawan";
import { ILuminaria } from "./luminaria";

export interface IAlertaBotonBLE {
  _id?: string;
  idCliente?: string;
  fechaCreacion?: string;
  idDispositivoLorawan?: string;
  idLuminaria?: string;
  mac?: string;

  //Populate
  dispositivoLorawan?: IDispositivoLorawan;
  luminaria?: ILuminaria;
}

type OmitirCreate = "_id" | "fechaCreacion";

export interface ICreateAlertaBotonBLE
  extends Omit<Partial<IAlertaBotonBLE>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion" | "cliente";

export interface IUpdateAlertaBotonBLE
  extends Omit<Partial<IAlertaBotonBLE>, OmitirUpdate> {}
