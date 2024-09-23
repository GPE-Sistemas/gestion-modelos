export type codigoAlarma = {
  codigo: string;
  descripcion: string;
};
export interface ICodigosAlarma {
  _id?: string;
  //
  nombre?: string;
  eventos?: codigoAlarma[];
}

type OmitirCreate = "_id";

export interface ICreateCodigosAlarma
  extends Omit<Partial<ICodigosAlarma>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateCodigosAlarma
  extends Omit<Partial<ICodigosAlarma>, OmitirUpdate> {}
