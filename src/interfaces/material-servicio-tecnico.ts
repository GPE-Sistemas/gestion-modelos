import { IEntidades } from './asignacion';
import { ICliente } from './cliente';
import { IEventoGenerico } from './evento-generico';
import { IUsuario } from './usuario';

/**
 * - 'usado' / 'pedido': material dentro de un servicio técnico (idEventoGenerico presente). Solo aparecen si se creó un evento técnico, esto lo gestiona el técnico.
 * - 'asignado': material/entidad en el stock (caja) del técnico que el fue asignado, sin evento (idEventoGenerico ausente). Puede ser algo libre (cables, herramientas) o una entidad del sistema referenciada por idEntidad/tipoEntidad (ej: un Dispositivo Lorawan disponible para cambio de nodo de luminaria).
 */
export type TipoMaterialServicioTecnico = 'usado' | 'pedido' | 'asignado';

/**
 * Flujo del pedido: Pendiente (lo pide el técnico) → Aprobado (operador)
 * → Usado (el técnico vuelve, termina el trabajo y lo marca). Anulado en cualquier punto previo a Usado.
 * Para el stock asignado al técnico (tipo 'asignado'): Asignado ↔ Devuelto.
 */
export type EstadoPedidoMaterial =
  | 'Pendiente'
  | 'Aprobado'
  | 'Usado'
  | 'Anulado'
  | 'Asignado'
  | 'Devuelto';

export interface IMaterialServicioTecnico {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  idEventoGenerico?: string; //Ausente cuando el material es stock asignado a la caja del técnico (tipo 'asignado').
  idUsuario?: string; //quien registró/solicitó el material, o a quien está asignado el stock
  tipo?: TipoMaterialServicioTecnico;
  descripcion?: string;
  cantidad?: number;
  imagenes?: string[];
  estado?: EstadoPedidoMaterial;
  idEntidad?: string; //Entidad del sistema referenciada por este material (opcional).
  tipoEntidad?: IEntidades;
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

export interface ICreateMaterialServicioTecnico extends Omit<
  Partial<IMaterialServicioTecnico>,
  OmitirCreate
> {}

type OmitirUpdate = OmitirCreate;

export interface IUpdateMaterialServicioTecnico extends Omit<
  Partial<IMaterialServicioTecnico>,
  OmitirUpdate
> {}
