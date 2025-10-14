import { ICliente } from './cliente';
import { IDispositivoLorawan } from './dispositivo-lorawan';

// ===== REPORTE DE ENERGÍA (Puerto 130) =====
// 3 bytes: voltaje (7 bits), corriente (11 bits), factor de potencia (6 bits)
export interface IReporteEnergiaACTIS {
  voltaje?: number; // Delta desde 230V (-64 a 63)
  voltajeTotal?: number; // 230 + voltaje
  corriente?: number; // mA (0-2047)
  factorPotencia?: number; // 0.37 a 1.0 (calculado desde (1-FP)*100)
  potencia?: number; // W calculada (V * I / 1000)
}

// ===== REPORTE DE ESTADO (Puerto 131) =====
// 1 byte: encendido (1 bit), motivo (2 bits), nivel dimming (5 bits)
export interface IReporteEstadoACTIS {
  encendido?: boolean;
  motivo?: 'Fotocélula' | 'Reloj Astronómico' | 'Manual' | 'Por defecto';
  nivelDimming?: number; // 0-31
}

// ===== REPORTE DE FOTOCÉLULA (Puerto 120) =====
// 1 byte: valor de la fotocélula (0-255)
export interface IReporteFotocelulaACTIS {
  valorFotocelula?: number; // 0-255 (0-3.3V)
}

// ===== REPORTE COMPLETO PARA ALMACENAR =====
// Este reporte puede incluir estado, energía y fotocélula dependiendo del mensaje recibido
export interface IReporteLuminariaACTIS {
  _id?: string;
  fechaCreacion?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idDispositivoLorawan?: string;
  // Ids de otras entidades que tienen asignado el dispositivo
  idsAsignados?: string[];

  // Estado (siempre presente en puerto 131)
  encendido?: boolean;
  motivo?: 'Fotocélula' | 'Reloj Astronómico' | 'Manual' | 'Por defecto';
  nivelDimming?: number;

  // Energía (puerto 130 - opcional)
  voltaje?: number;
  voltajeTotal?: number;
  corriente?: number;
  factorPotencia?: number;
  potencia?: number;

  // Fotocélula (puerto 120 - opcional)
  valorFotocelula?: number; // 0-255

  // Metadata
  fCnt?: number;
  timestamp?: string;

  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
  dispositivoLorawan?: IDispositivoLorawan;
}

type OmitirCreate = '_id' | 'fechaCreacion' | 'cliente';

export interface ICreateReporteLuminariaACTIS
  extends Omit<Partial<IReporteLuminariaACTIS>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente';

export interface IUpdateReporteLuminariaACTIS
  extends Omit<Partial<IReporteLuminariaACTIS>, OmitirUpdate> {}
