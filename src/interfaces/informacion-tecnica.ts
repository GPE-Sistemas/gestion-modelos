export interface IInfoTecnica {
  titulo?: string;
  descripcion?: string;
}

export interface IInfoEndPoint {
  titulo?: string;
  descripcion?: string;
  url?: string;
  ip?: string;
  puerto?: { info: string; puerto: string };
}

export interface IInformacionTecnica {
  _id?: string;
  infoTecnica?: IInfoTecnica[];
  infoEndPoints?: IInfoEndPoint[];
}

type OmitirCreate = "_id";

export interface ICreateInformacionTecnica
  extends Omit<Partial<IInformacionTecnica>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateInformacionTecnica
  extends Omit<Partial<IInformacionTecnica>, OmitirUpdate> {}
