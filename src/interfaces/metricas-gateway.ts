import { ICliente } from './cliente';
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
  /** Cliente dueño del dispositivo que generó el uplink (para filtro cross-tenant) */
  idClienteDispositivo?: string;
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

  // Virtuals
  gateway?: IGateway;
  clienteDispositivo?: ICliente;
}

type OmitirCreate = '_id';

export interface ICreateMetricasGateway
  extends Omit<Partial<IMetricasGateway>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'gatewayEui' | 'idClienteDispositivo' | 'fecha' | 'periodo' | 'canal';

export interface IUpdateMetricasGateway
  extends Omit<Partial<IMetricasGateway>, OmitirUpdate> {}
