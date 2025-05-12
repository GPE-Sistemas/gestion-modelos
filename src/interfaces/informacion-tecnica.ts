export interface IInfoEndPoint {
  url?: string;
  ip?: string;
  puerto?: { protocolo: string; info?: string; puerto: string };
}

export interface IInformacionTecnica {
  _id?: string;
  titulo?: string;
  descripcion?: string;
  infoEndPoints?: IInfoEndPoint[];
}

type OmitirCreate = "_id";

export interface ICreateInformacionTecnica
  extends Omit<Partial<IInformacionTecnica>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateInformacionTecnica
  extends Omit<Partial<IInformacionTecnica>, OmitirUpdate> {}
