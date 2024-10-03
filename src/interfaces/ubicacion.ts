import {
  ICoordenadaOL,
  ICoordenadas,
  IGeoJSONPoint,
  IGeoJSONPolygon,
} from "../auxiliares";
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
  punto?: IGeoJSONPoint;
  radio?: number;
  poligono?: IGeoJSONPolygon;

  // Virtuals
  cliente?: ICliente;
  ubicacion?: ICoordenadas;
  ubicacionOl?: ICoordenadaOL;
}

type OmitirCreate = "_id" | "cliente" | "ubicacion" | "ubicacionOl";
export interface ICreateUbicacion
  extends Omit<Partial<IUbicacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "ubicacion" | "ubicacionOl";
export interface IUpdateUbicacion
  extends Omit<Partial<IUbicacion>, OmitirUpdate> {}
