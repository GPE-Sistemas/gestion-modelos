import { ICliente } from './cliente';
import { IEventoGenerico } from './evento-generico';
import { IUsuario } from './usuario';

export type TipoMaterialServicioTecnico = 'usado' | 'pedido';

export type EstadoPedidoMaterial =
  | 'Pendiente'
  | 'Derivado'
  | 'Entregado'
  | 'Anulado';

export interface IMaterialServicioTecnico {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  /** Servicio técnico (evento genérico con filtrador 'Servicio Técnico') originario */
  idEventoGenerico?: string;
  /** Usuario que registró el material usado o solicitó el pedido */
  idUsuario?: string;
  tipo?: TipoMaterialServicioTecnico;
  descripcion?: string;
  cantidad?: number;
  imagenes?: string[];
  /** Solo para tipo 'pedido' */
  estado?: EstadoPedidoMaterial;
  /** Reservado para stock futuro: vínculo a artículo de inventario. No usar aún. */
  idArticulo?: string;
  fechaCreacion?: string;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  evento?: IEventoGenerico;
  usuario?: IUsuario;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'ancestros'
  | 'evento'
  | 'usuario'
  | 'fechaCreacion';

export interface ICreateMaterialServicioTecnico
  extends Omit<Partial<IMaterialServicioTecnico>, OmitirCreate> {}

type OmitirUpdate = OmitirCreate;

export interface IUpdateMaterialServicioTecnico
  extends Omit<Partial<IMaterialServicioTecnico>, OmitirUpdate> {}
