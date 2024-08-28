import { ICliente } from './cliente';
import { ITerminal } from './terminal';

export interface ICronograma {
  _id?: string;
  //
  idCliente?: string;
  idTerminal?: string;
  //
  fechaCreacion?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: TipoDeCronograma;
  periodos?: Periodo[];
  //
  configuracion?: ConfigCronograma; // Colores, el nombre de de lo que se está mostrando, etc
  // Populate
  cliente?: ICliente;
  terminal?: ITerminal;
}

type OmitirCreate = '_id' | 'cliente' | 'terminal';

export interface ICreateCronograma
  extends Omit<Partial<ICronograma>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'terminal';

export interface IUpdateCronograma
  extends Omit<Partial<ICronograma>, OmitirUpdate> {}

export type TipoDeCronograma = 'despacho' | 'turnos';

export interface Periodo {
  desde?: string; // Sale
  hasta?: string; // Llega
  datos?: Record<string, any>; // Datos extras para el periodo, como el chofer, el vehículo, el usuario, etc
}

export interface ConfigCronograma {
  color?: string;
  nombreParaMostrar?: string;
}
