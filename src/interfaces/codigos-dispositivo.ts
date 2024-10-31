import { ICliente } from "./cliente";
import { ITipoEvento } from "./tipo-evento";

export interface codigoDispositivo {
  codigo?: string;
  descripcion?: string;
  idTipoEvento?: string;
  // Populate
  tipoEvento?: ITipoEvento;
}

export type TipoDispositivo = "Tracker" | "Alarma" | "Comunicador";

export interface ICodigosDispositivo {
  _id?: string;
  //
  nombre?: string;
  tipo?: TipoDispositivo;
  eventos?: codigoDispositivo[];
  idCliente?: string;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateCodigosDispositivo
  extends Omit<Partial<ICodigosDispositivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateCodigosDispositivo
  extends Omit<Partial<ICodigosDispositivo>, OmitirUpdate> {}
