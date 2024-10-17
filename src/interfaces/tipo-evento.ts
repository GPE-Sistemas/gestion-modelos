export interface ITipoEvento {
  _id?: string;
  //
  nombre?: string;
  color?: string;
  notificar?: boolean;
  atender?: boolean;
}

type OmitirCreate = "_id";

export interface ICreateTipoEvento
  extends Omit<Partial<ITipoEvento>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateTipoEvento
  extends Omit<Partial<ITipoEvento>, OmitirUpdate> {}
