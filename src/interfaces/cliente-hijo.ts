export interface IClienteHijo {
  _id?: string;
  idCliente?: string;
  idHijo?: string;
  nivel?: number;
}

type OmitirCreate = "_id";

export interface ICreateClienteHijo
  extends Omit<Partial<IClienteHijo>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateClienteHijo
  extends Omit<Partial<IClienteHijo>, OmitirUpdate> {}
