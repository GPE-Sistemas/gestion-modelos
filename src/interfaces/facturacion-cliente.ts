import { ICliente } from './cliente';

export type MonedaFacturacion = 'ARS' | 'USD';

export interface IFacturacionCliente {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  costoTracker?: number; // costo por unidad de tracker
  costoCamara?: number; // costo por unidad de cámara
  costoAlarma?: number; // costo por unidad de alarma
  moneda?: MonedaFacturacion;
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
 * Detalle por categoría de la facturación en curso.
 * - total: dispositivos totales del cliente.
 * - activos: los que cuentan para la cotización (trackers/alarmas con
 *   reporte en el mes; cámaras = total).
 * - costoEstimado = total * costoUnitario (fantasma).
 * - costoReal = activos * costoUnitario (lo que seguro se factura).
 */
export interface ICategoriaFacturacionEnCurso {
  total: number;
  activos: number;
  costoUnitario: number;
  costoEstimado: number;
  costoReal: number;
}

export interface IFacturacionEnCurso {
  idCliente: string;
  moneda?: MonedaFacturacion;
  periodoInicio: string; // ISO, inicio del mes en curso
  // Categorías y totales = NETO (lo que efectivamente paga el cliente).
  trackers: ICategoriaFacturacionEnCurso;
  alarmas: ICategoriaFacturacionEnCurso;
  camaras: ICategoriaFacturacionEnCurso;
  totalEstimado: number;
  totalReal: number;
  /** Descuento por clientes hijos bonificados (bruto = neto + bonificación). */
  bonificacion: { totalEstimado: number; totalReal: number };
}
