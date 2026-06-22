import { ICliente } from './cliente';
import { IUsuario } from './usuario';

export interface IGrupoUsuario {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  nombre?: string;
  idAdmin?: string;
  idsMiembros?: string[];
  fechaCreacion?: string;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  admin?: IUsuario;
  miembros?: IUsuario[];
}

type OmitCreate = '_id' | 'cliente' | 'admin' | 'miembros' | 'fechaCreacion';

export interface ICreateGrupoUsuario
  extends Omit<Partial<IGrupoUsuario>, OmitCreate> {}

export interface IUpdateGrupoUsuario
  extends Omit<Partial<IGrupoUsuario>, OmitCreate> {}

export type EstadoSolicitudGrupoUsuario = 'Pendiente' | 'Aceptada' | 'Rechazada';

export interface ISolicitudGrupoUsuario {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idGrupoUsuario?: string;
  idRemitente?: string;
  idDestinatario?: string;
  estado?: EstadoSolicitudGrupoUsuario;
  fechaCreacion?: string;
  fechaRespuesta?: string;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  grupoUsuario?: IGrupoUsuario;
  remitente?: IUsuario;
  destinatario?: IUsuario;
}

type OmitCreateSolicitud =
  | '_id'
  | 'cliente'
  | 'grupoUsuario'
  | 'remitente'
  | 'destinatario'
  | 'fechaCreacion'
  | 'fechaRespuesta';

export interface ICreateSolicitudGrupoUsuario
  extends Omit<Partial<ISolicitudGrupoUsuario>, OmitCreateSolicitud> {}

export interface IUpdateSolicitudGrupoUsuario
  extends Omit<Partial<ISolicitudGrupoUsuario>, OmitCreateSolicitud> {}
