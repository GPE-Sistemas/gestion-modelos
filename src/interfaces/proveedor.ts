import { ICoordenadas } from "../auxiliares";
import { ICliente } from "./cliente";

export type TipoProveedor = "Mecanico" | "Combustible";

export interface IProveedor {
  _id?: string;
  tipo?: TipoProveedor;
  idCliente?: string;
  nombre?: string;
  ubicacion?: ICoordenadas;
  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateProveedor
  extends Omit<Partial<IProveedor>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateProveedor
  extends Omit<Partial<IProveedor>, OmitirUpdate> {}
