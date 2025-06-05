export interface ILogHttp {
  _id?: string;
  fechaCreacion?: string;
  method?: string;
  url?: string;
  path?: string;
  body?: string;
  headers?: string;
  query?: string;
  params?: string;
}

type OmitirCreate = "_id" | "fechaCreacion";

export interface ICreateLogHttp extends Omit<Partial<ILogHttp>, OmitirCreate> {}

type OmitirUpdate = "_id" | "fechaCreacion";

export interface IUpdateLogHttp extends Omit<Partial<ILogHttp>, OmitirUpdate> {}
