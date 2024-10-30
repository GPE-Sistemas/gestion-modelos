import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IDispositivoAlarma } from "./dispositivo-alarma";

// export type TipoEntidad = "Cliente" | "Activo" | "Alarma";

export interface INota {
  _id?: string;
  idCliente?: string;
  // tipoEntidad?: TipoEntidad;
  // Id de: cliente, activo o alarma
  idAsignado?: string;
  nota?: string;
  permante?: boolean;
  vigenciaDesde?: string;
  vigenciaHasta?: string;
  // Populate
  cliente?: ICliente;
  activo?: IActivo;
  alarma?: IDispositivoAlarma;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateNota extends Omit<Partial<INota>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateNota extends Omit<Partial<INota>, OmitirUpdate> {}
