import { IGateway } from './gateway';

export type PeriodoMetrica = 'hora' | 'dia';

/**
 * Métricas agregadas de Time on Air por gateway y canal
 */
export interface IMetricasGateway {
  _id?: string;
  /** Referencia al Gateway en MongoDB */
  idGateway?: string;
  /** EUI del gateway (para queries directas sin join) */
  gatewayEui: string;
  /** Inicio del periodo de agregación (ISO string) */
  fecha: string;
  /** Granularidad de la agregación */
  periodo: PeriodoMetrica;
  /** Frecuencia/canal en Hz (ej: 915400000) */
  canal: number;

  /** Suma total de Time on Air en milisegundos */
  totalToA: number;
  /** Cantidad de uplinks en el periodo */
  cantidadUplinks: number;

  // Virtual
  gateway?: IGateway;
}

type OmitirCreate = '_id';

export interface ICreateMetricasGateway
  extends Omit<Partial<IMetricasGateway>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'gatewayEui' | 'fecha' | 'periodo' | 'canal';

export interface IUpdateMetricasGateway
  extends Omit<Partial<IMetricasGateway>, OmitirUpdate> {}
