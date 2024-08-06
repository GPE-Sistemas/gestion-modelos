import { IUsuario } from "./usuario";
import { IVehiculo } from "./vehiculo";

export type tipoDocumentacion = "Licencia" | "Seguro";

export interface IDocumentacion {
  _id?: string;
  tipo?: tipoDocumentacion;
  vencimiento?: Date;
  emision?: Date;
  descripcion?: string;
  imagenes?: string[];
  idChofer?: string;
  idVehiculo?: string;
  // Populate
  chofer?: IUsuario;
  vehiculo?: IVehiculo;
}

type OmitirCreate = "_id" | "chofer" | "vehiculo";

export interface ICreateDocumentacion
  extends Omit<Partial<IDocumentacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "chofer" | "vehiculo";

export interface IUpdateDocumentacion
  extends Omit<Partial<IDocumentacion>, OmitirUpdate> {}
