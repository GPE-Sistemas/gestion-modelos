import { ICliente, ITipoCliente } from './cliente';

export type MonedaFacturacion = 'ARS' | 'USD';

export interface IFacturacionCliente {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  activa?: boolean;
  /**
   * Si true, el cliente no se cobra: su costo se descuenta del cliente
   * facturable padre (línea de bonificación). Si false/undefined y el
   * cliente no es nivel 1, se considera raíz independiente de facturación.
   */
  bonificado?: boolean;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'cliente' | 'ancestros';
export interface ICreateFacturacionCliente extends Omit<
  Partial<IFacturacionCliente>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente' | 'ancestros';
export interface IUpdateFacturacionCliente extends Omit<
  Partial<IFacturacionCliente>,
  OmitirUpdate
> {}

/* ────────────────────────────────────────────────
 *  FACTURACIÓN EN CURSO (estimado vs real del mes)
 * ────────────────────────────────────────────────*/

/**
 * Detalle por categoría de la facturación en curso (solo cantidades).
 * - total: dispositivos totales del cliente.
 * - activos: los que cuentan (trackers/alarmas con reporte en el mes;
 *   cámaras = total).
 */
export interface ICategoriaFacturacionEnCurso {
  total: number;
  activos: number;
}

export interface IFacturacionEnCurso {
  idCliente: string;
  periodoInicio: string; // ISO, inicio del mes en curso
  // Categorías y totales = NETO (lo que efectivamente paga el cliente).
  trackers: ICategoriaFacturacionEnCurso;
  alarmas: ICategoriaFacturacionEnCurso;
  camaras: ICategoriaFacturacionEnCurso;
  totalEstimado: number;
  totalReal: number;
  /** Descuento por clientes hijos bonificados (bruto = neto + bonificación). */
  bonificacion: { totalEstimado: number; totalReal: number };
  /**
   * Costo real del mes pasado por categoría (del resumen ya creado para el
   * cliente; puede no existir → 0), para comparar contra el estimado actual.
   */
  mesPasado: {
    trackers: number;
    alarmas: number;
    camaras: number;
    total: number;
    /** Cantidades facturadas del mes anterior (del resumen), por categoría. */
    cantidades?: {
      trackers: number;
      alarmas: number;
      camaras: number;
    };
  };
  /** Aporte de cada hijo directo (no bonificado, no raíz independiente). */
  hijos: IDetalleClienteFacturacion[];
  /** Detalle de cada cliente bonificado (descontado del total). */
  bonificados: IDetalleClienteFacturacion[];
}

/** Aporte/descuento de un cliente al total del cliente facturable. */
export interface IDetalleClienteFacturacion {
  idCliente: string;
  nombre?: string;
  tipoCliente?: ITipoCliente;
  costoEstimado: number;
  costoReal: number;
  /** Total del resumen del mes pasado de ese cliente (puede no existir → 0). */
  costoPasado?: number;
  /** Cantidades de dispositivos del cliente (activos = consolidados). */
  cantidades?: {
    trackers: { total: number; activos: number };
    alarmas: { total: number; activos: number };
    camaras: { total: number };
  };
  /**
   * Desglose del mes pasado por categoría (del resumen guardado del
   * facturable; puede no existir en resúmenes viejos).
   */
  pasado?: {
    trackers?: { cantidad?: number; subtotal?: number };
    alarmas?: { cantidad?: number; subtotal?: number };
    camaras?: { cantidad?: number; subtotal?: number };
  };
}
