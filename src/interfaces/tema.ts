import { ICliente } from './cliente';

export type IMotorEfectoFullscreen = 'particulas';

export interface IRangoNumerico {
  min: number;
  max: number;
}

export interface IDiaMes {
  mes: number; // 0-11
  dia: number; // 1-31
}

export interface IRangoRecurrenteAnual {
  inicio: IDiaMes;
  fin: IDiaMes;
}

export interface IDecal {
  urlAsset: string;
  tamañoPct?: number; // 0-100
}

export interface IEfectoFullscreen {
  motor: IMotorEfectoFullscreen;
  spriteUrl: string;
  cantidad: number; // 1-128
  velocidad: IRangoNumerico; // segundos por ciclo
  tamano: IRangoNumerico; // pixeles
  drift: number; // pixeles laterales (0 = caída recta)
  paleta?: string[]; // hex tints opcionales
}

export interface ITemaPayload {
  decalAvatar?: IDecal;
  decalLogoLogin?: IDecal;
  decalTopbar?: IDecal;
  decalLogin?: IDecal;
  efectoFullscreen?: IEfectoFullscreen;
}

export interface ITema {
  _id?: string;
  //
  nombre?: string;
  descripcion?: string;
  activa?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  diasRecurrentes?: IRangoRecurrenteAnual;
  prioridad?: number; // 0-100
  global?: boolean;
  idCliente?: string;
  idsAncestros?: string[];
  payload?: ITemaPayload;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'cliente' | 'ancestros' | 'fechaCreacion' | 'fechaActualizacion';

export interface ICreateTema extends Omit<
  Partial<ITema>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente' | 'ancestros' | 'fechaCreacion' | 'fechaActualizacion';

export interface IUpdateTema extends Omit<
  Partial<ITema>,
  OmitirUpdate
> {}

export interface ITemaCache extends Omit<
  ITema,
  'cliente' | 'ancestros'
> {}

export interface ITemaPublico extends Omit<
  ITema,
  'cliente' | 'ancestros' | 'idCliente' | 'idsAncestros' | 'fechaCreacion' | 'fechaActualizacion'
> {}
