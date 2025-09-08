import { IGeoJSON } from "../auxiliares";
import { ICliente } from "./cliente";

export type ICategoriaUbicacion =
  | "Normal"
  | "Terminal"
  | "Domicilio"
  | "Activos"
  | "Centro de Atención"
  | "Hospital";

export interface IUbicacion {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  identificacion?: string;
  fechaCreacion?: string;
  categoria?: ICategoriaUbicacion;
  direccion?: string;
  geojson?: IGeoJSON;
  fotos?: string[];
  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id" | "cliente";
export interface ICreateUbicacion
  extends Omit<Partial<IUbicacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";
export interface IUpdateUbicacion
  extends Omit<Partial<IUbicacion>, OmitirUpdate> {}
