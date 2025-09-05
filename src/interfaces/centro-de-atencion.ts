import { DireccionV2, ICoordenadas } from "../auxiliares";
import { ICliente } from "./cliente";
import { TipoEmergencia } from "./emergencias";
import { IUbicacion } from "./ubicacion";

export interface ICentroDeAtencion {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  fechaCreacion?: string;
  nombre?: string;
  tipoEmergencia?: TipoEmergencia;
  telefono?: string; // Teléfono de contacto
  email?: string; // Email institucional
  activo?: boolean; // Si está operativo
  idUbicacion?: string;
  circuloArea?: {
    center?: number[];
    radius?: number;
  }; //círculo del centro de atención

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  ubicacion?: IUbicacion;
}

type OmitirCreate = "_id";

export interface ICreateCentroDeAtencion
  extends Omit<Partial<ICentroDeAtencion>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateCentroDeAtencion
  extends Omit<Partial<ICentroDeAtencion>, OmitirUpdate> {}
