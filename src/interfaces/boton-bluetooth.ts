import { ICliente } from "./cliente";

export interface IBotonBluetooth {
  _id?: string;
  idCliente?: string;
  mac?: string;
  serialNumber?: string;

  //Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateBotonBluetooth
  extends Omit<Partial<IBotonBluetooth>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateBotonBluetooth
  extends Omit<Partial<IBotonBluetooth>, OmitirUpdate> {}
