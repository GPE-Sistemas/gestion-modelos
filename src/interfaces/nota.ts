import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { ILuminaria } from './luminaria';

export type TipoNota = 'Contacto' | 'Nota';

export interface IInformacionNota {
  nota?: string;
}

export interface IInformacionContacto {
  contacto?: string;
  telefono?: string;
  interno?: string;
  email?: string;

  // Solo cuando es contacto de alarma
  palabraSeguridadNormal?: string;
  palabraSeguridadEmergencia?: string;
  numeroUsuarioAlarma?: number;
  particion: number;
}

export type IInformacion = IInformacionNota & IInformacionContacto;
export interface INota {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idAsignado?: string;
  permanente?: boolean;
  vigenciaDesde?: string;
  vigenciaHasta?: string;
  tipo?: TipoNota;
  informacion?: IInformacion;
  orden?: number;
  particion?: number;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  activo?: IActivo;
  alarma?: IDispositivoAlarma;
  luminaria?: ILuminaria;
}

type OmitirCreate = '_id' | 'cliente';

export interface ICreateNota extends Omit<Partial<INota>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateNota extends Omit<Partial<INota>, OmitirUpdate> {}

export interface INotaCache
  extends Omit<
    INota,
    'cliente' | 'ancestros' | 'activo' | 'alarma' | 'luminaria'
  > {}
