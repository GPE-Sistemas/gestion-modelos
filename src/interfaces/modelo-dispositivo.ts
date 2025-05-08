import { ICliente } from "./cliente";
import { ICodigosDispositivo, TipoDispositivo } from "./codigos-dispositivo";

export interface IDetallesLuminarias {
  horasVida?: string;
  potencia?: string;
}
export interface IModeloDispositivo {
  _id?: string;
  //
  tipo?: TipoDispositivo;
  marca?: string;
  modelo?: string;
  formatoMensaje?: string;
  idCodigos?: string;
  idCliente?: string;

  //Datos técnicos para luminarias
  luminarias?: IDetallesLuminarias;
  // Populate
  cliente?: ICliente;
  codigos?: ICodigosDispositivo;
}

type OmitirCreate = "_id" | "codigos" | "cliente";

export interface ICreateModeloDispositivo
  extends Omit<Partial<IModeloDispositivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "codigos" | "cliente";

export interface IUpdateModeloDispositivo
  extends Omit<Partial<IModeloDispositivo>, OmitirUpdate> {}
