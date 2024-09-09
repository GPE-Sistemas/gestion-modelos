import { ICliente } from "./cliente";
import { ITracker } from "./tracker";

export interface IActivo {
  _id?: string;
  //
  idCliente?: string;
  idTracker?: string;
  identificacion?: string;

  // Populate
  cliente?: ICliente;
  tracker?: ITracker;
}

type OmitirCreate = "_id" | "cliente" | "tracker";

export interface ICreateActivo extends Omit<Partial<IActivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "tracker";

export interface IUpdateActivo extends Omit<Partial<IActivo>, OmitirUpdate> {}
