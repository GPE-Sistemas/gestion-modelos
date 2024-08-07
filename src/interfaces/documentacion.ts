import { ICliente } from "./cliente";
import { IUsuario } from "./usuario";
import { IVehiculo } from "./vehiculo";

export type TipoDocumentacion = "Licencia" | "Seguro";

export interface IDocumentacion {
  _id?: string;
  tipo?: TipoDocumentacion;
  vencimiento?: string;
  fechaCreacion?: string;
  emision?: string;
  descripcion?: string;
  imagenes?: string[];
  idCliente?: string;
  idChofer?: string;
  idVehiculo?: string;
  // Populate
  cliente?: ICliente;
  chofer?: IUsuario;
  vehiculo?: IVehiculo;
}

type OmitirCreate = "_id" | "chofer" | "vehiculo" | "Cliente";

export interface ICreateDocumentacion
  extends Omit<Partial<IDocumentacion>, OmitirCreate> {}

type OmitirUpdate = "_id" | "chofer" | "vehiculo" | "Cliente";

export interface IUpdateDocumentacion
  extends Omit<Partial<IDocumentacion>, OmitirUpdate> {}
