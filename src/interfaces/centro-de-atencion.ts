import { DireccionV2, ICoordenadas } from "../auxiliares";
import { ICliente } from "./cliente";
import { TipoEmergencia } from "./emergencias";

export interface ICentroDeAtencion {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  fechaCreacion?: string;
  nombre?: string;
  tipoEmergencia?: TipoEmergencia;
  direccion?: DireccionV2;
  telefono?: string; // Teléfono de contacto
  email?: string; // Email institucional
  activo?: boolean; // Si está operativo
  circuloArea?: {
    center?: number[];
    radius?: number;
  }; //círculo del centro de atención

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id";

export interface ICreateCentroDeAtencion
  extends Omit<Partial<ICentroDeAtencion>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateCentroDeAtencion
  extends Omit<Partial<ICentroDeAtencion>, OmitirUpdate> {}
