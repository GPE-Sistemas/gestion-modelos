import { ICliente } from "./cliente";

export interface IBotonBlueTooth {
  _id?: string;
  idCliente?: string;
  mac?: string;
  serialNumber?: string;

  //Populate
  cliente?: ICliente;
}
