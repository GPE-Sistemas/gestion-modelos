import { ICliente } from './cliente';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IUbicacion } from './ubicacion';

export interface ISim {
  iccid?: string;
  numero?: string;
  operador?: Operador;
  apn?: string;
  usuario?: string;
  password?: string;
}

export type Operador = 'Personal' | 'Claro' | 'Movistar' | 'Tuenti' | 'Otro';
export interface IDispositivoAlarma {
  _id?: string;
  //
  idComunicador?: string;
  idUnicoComunicador?: string;
  passwordComunicador?: string;
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  nombre?: string;
  numeroAbonado?: string;
  sim1?: ISim;
  sim2?: ISim;
  idsClientesQuePuedenAtender?: string[];
  // Populate
  domicilio?: IUbicacion;
  modelo?: IModeloDispositivo;
  cliente?: ICliente;
  comunicador?: IModeloDispositivo;
}

type OmitirCreate = '_id' | 'cliente' | 'modelo' | 'domicilio' | 'comunicador';

export interface ICreateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'modelo' | 'domicilio' | 'comunicador';

export interface IUpdateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirUpdate> {}
