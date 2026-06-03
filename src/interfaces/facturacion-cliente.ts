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
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'cliente' | 'ancestros';
export interface ICreateFacturacionCliente
  extends Omit<Partial<IFacturacionCliente>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'ancestros';
export interface IUpdateFacturacionCliente
  extends Omit<Partial<IFacturacionCliente>, OmitirUpdate> {}
