import { ICliente } from './cliente';
import { ITracker } from './tracker';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IActivo } from './activo';

export type estadoEvento =
  | 'Pendiente'
  | 'Asignado'
  | 'En Atención'
  | 'Pendiente de Aprobación'
  | 'Finalizado';

export interface IEventoTecnico {
  _id?: string;
  //
  fechaCreacion?: string;
  estado?: estadoEvento;
  descripcion?: string;
  //
  idTracker?: string;
  idAlarma?: string;
  idActivo?: string;
  idCliente?: string;
  //
  idsClientesQuePuedenAtender?: string[];
  idsClientesAtendiendo?: string[];
  idTecnicoAsignado?: string;
  // Populate
  tracker?: ITracker;
  alarma?: IDispositivoAlarma;
  activo?: IActivo;
  cliente?: ICliente;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'tracker'
  | 'alarma'
  | 'reporte'
  | 'activo';

export interface ICreateEventoTecnico
  extends Omit<Partial<IEventoTecnico>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'tracker'
  | 'alarma'
  | 'reporte'
  | 'activo';

export interface IUpdateEventoTecnico
  extends Omit<Partial<IEventoTecnico>, OmitirUpdate> {}
