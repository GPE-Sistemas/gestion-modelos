import { IGeoJSONPoint } from '../auxiliares';
import { ICliente } from './cliente';
import { IConfigPerfil } from './config-perfil';
import { IDispositivoLorawan } from './dispositivo-lorawan';
import { IGrupo } from './grupo';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IReporteBase } from './reporte-generico';

export type EstadoLuminaria = 'Operativa' | 'Mantenimiento';

export type MapaValoresReportePeriodico = {
  'Luminaria GPE': IReporteBase<'Luminaria GPE Periódico'>;
  'Luminaria ACTIS FING': IReporteBase<'Luminaria ACTIS FING Estado'>;
};
export type MapaValoresReporteEnergia = {
  'Luminaria GPE': IReporteBase<'Luminaria GPE Energía'>;
  'Luminaria ACTIS FING': IReporteBase<'Luminaria ACTIS FING Energía'>;
};

export type TipoDispositivoLuminaria = keyof MapaValoresReportePeriodico;

export type ILuminaria =
  | ILuminariaGenerica<'Luminaria GPE'>
  | ILuminariaGenerica<'Luminaria ACTIS FING'>;

export interface ILuminariaGenerica<T extends TipoDispositivoLuminaria> {
  _id?: string;
  fechaCreacion?: string; // Default: Date.now
  idCliente?: string;
  idsAncestros?: string[];
  deveui?: string; // Deveui del dispositivo lorawan
  identificacion?: string;
  ubicacion?: IGeoJSONPoint; // GeoJSON de la ubicacion de la luminaria
  direccion?: string; // Direccion de la luminaria
  idModeloDispositivo?: string; // ID del modelo de dispositivo
  idsGrupos?: string[];
  tiempoEncendida?: number; // En horas
  tipoDispositivo?: T; // Tipo de dispositivo (Luminaria GPE, Luminaria ACTIS FING, etc)
  ultimoReportePeriodico?: MapaValoresReportePeriodico[T]; // Ultimo reporte periodico recibido
  ultimoReporteEnergia?: MapaValoresReporteEnergia[T]; // Ultimo reporte energia recibido
  fechaUltimaComunicacion?: string; // Fecha del ultima comunicacion recibida por el dispositivo
  idPerfilDimming?: string; // Valores por defecto para el comando de dimming
  idPerfilConfig?: string; // Valores por defecto para el comando de configuracion

  // Estado actual de la luminaria
  estado?: EstadoLuminaria;

  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
  dispositivo?: IDispositivoLorawan;
  modeloDispositivo?: IModeloDispositivo;
  grupos?: IGrupo[];
  perfilDimming?: IConfigPerfil;
  perfilConfig?: IConfigPerfil;
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'cliente'
  | 'ancestros'
  | 'dispositivo'
  | 'modeloDispositivo'
  | 'grupos'
  | 'perfilDimming'
  | 'perfilConfig';

export type ICreateLuminaria =
  | Omit<ILuminariaGenerica<'Luminaria GPE'>, OmitirCreate>
  | Omit<ILuminariaGenerica<'Luminaria ACTIS FING'>, OmitirCreate>;

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'cliente'
  | 'ancestros'
  | 'dispositivo'
  | 'modeloDispositivo'
  | 'grupos'
  | 'perfilDimming'
  | 'perfilConfig';

export type IUpdateLuminaria =
  | Omit<ILuminariaGenerica<'Luminaria GPE'>, OmitirUpdate>
  | Omit<ILuminariaGenerica<'Luminaria ACTIS FING'>, OmitirUpdate>;

/**
 * Representa la ubicación de una luminaria con corte de energía
 */
export interface IUbicacionCorteEnergia {
  idLuminaria?: string;
  deveui?: string;
  identificacion?: string;
  coordenadas?: IGeoJSONPoint;
  direccion?: string;
  cantidadCortes?: number;
  primerCorte?: string; // ISO Date string
  ultimoCorte?: string; // ISO Date string
}

/**
 * Representa un día con luminarias que tuvieron cortes de energía
 */
export interface IDiaCorteEnergia {
  dia?: string; // Formato: YYYY-MM-DD
  diaSemana?: number; // 1=Domingo, 2=Lunes, 3=Martes, 4=Miércoles, 5=Jueves, 6=Viernes, 7=Sábado
  nombreDia?: string; // "Lunes", "Martes", "Miércoles", etc.
  luminariasConCorte?: number;
  ubicaciones?: IUbicacionCorteEnergia[];
}

/**
 * Resumen de cortes de energía por semana
 */
export interface IResumenCortesEnergiaSemana {
  dias?: IDiaCorteEnergia[];
  totalLuminariasAfectadas?: number; // Cantidad única de luminarias afectadas en toda la semana
}
