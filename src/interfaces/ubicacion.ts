import { IGeoJSONCircle, IGeoJSONPolygon } from "../auxiliares";
import { ICliente } from "./cliente";

export type ITipoUbicacion = "Punto" | "Poligono";

export interface IUbicacion {
  _id?: string;
  //
  idCliente?: string;
  identificacion?: string;
  fechaCreacion?: string;
  tipo?: ITipoUbicacion;
  direccion?: string;
  circleGeoJSON?: IGeoJSONCircle;
  polygonGeoJSON?: IGeoJSONPolygon;

  // Virtuals
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";
export interface ICreateUbicacion
  extends Omit<Partial<IUbicacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";
export interface IUpdateUbicacion
  extends Omit<Partial<IUbicacion>, OmitirUpdate> {}
