import { ICliente } from "./cliente";
import { IModeloDispositivo } from "./modelo-dispositivo";

export interface IBotonBluetooth {
  _id?: string;
  idModeloDispositivo?: string;

  fechaCreacion?: string;
  idCliente?: string;
  mac?: string;
  serialNumber?: string;

  //Populate
  cliente?: ICliente;
  modeloDispositivo?: IModeloDispositivo;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateBotonBluetooth
  extends Omit<Partial<IBotonBluetooth>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateBotonBluetooth
  extends Omit<Partial<IBotonBluetooth>, OmitirUpdate> {}
