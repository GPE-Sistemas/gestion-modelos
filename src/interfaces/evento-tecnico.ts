import { ICliente } from './cliente';
import { ITracker } from './tracker';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IActivo } from './activo';
import { IUsuario } from './usuario';
import { CategoriaTecnica, EstadoEventoTecnico } from './evento-generico';

export interface IEventoTecnico {
  _id?: string;
  //
  fechaCreacion?: string;
  estado?: EstadoEventoTecnico;
  titulo?: string;
  descripcion?: string;
  categoria?: CategoriaTecnica;
  //
  idTracker?: string;
  idAlarma?: string;
  idActivo?: string;
  idLuminaria?: string;
  idCliente?: string;
  idsAncestros?: string[];
  //
  idsClientesQuePuedenAtender?: string[];
  idsClientesAtendiendo?: string[];
  idTecnicoAsignado?: string;
  idUsuario?: string;
  // Populate
  tracker?: ITracker;
  alarma?: IDispositivoAlarma;
  activo?: IActivo;
  luminaria?: IActivo;
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  tecnico?: IUsuario;
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
