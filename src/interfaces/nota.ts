import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IDispositivoAlarma } from "./dispositivo-alarma";

export type TipoNota = "Contacto" | "Nota";

export interface IInformacionNota {
  nota?: string;
}

export interface IInformacionContacto {
  contacto?: string;
  telefono?: string;
  email?: string;

  // Solo cuando es contacto de alarma
  palabraSeguridadNormal?: string;
  palabraSeguridadEmergencia?: string;
  numeroUsuarioAlarma?: number;
}

export type IInformacion = IInformacionNota & IInformacionContacto;
export interface INota {
  _id?: string;
  idCliente?: string;
  idAsignado?: string;
  permanente?: boolean;
  vigenciaDesde?: string;
  vigenciaHasta?: string;
  tipo?: TipoNota;
  informacion?: IInformacion;
  orden: number;
  // Populate
  cliente?: ICliente;
  activo?: IActivo;
  alarma?: IDispositivoAlarma;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateNota extends Omit<Partial<INota>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateNota extends Omit<Partial<INota>, OmitirUpdate> {}
