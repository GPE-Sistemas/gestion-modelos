import { z } from 'zod';
import { IEntidades } from './asignacion';
import { ClienteSchema } from './cliente';
import type { IDispositivoLorawan } from './dispositivo-lorawan';
import type { IEventoGenerico } from './evento-generico';
import { UsuarioSchema } from './usuario';

/**
 * - 'usado' / 'pedido': material dentro de un servicio técnico (idEventoGenerico presente). Solo aparecen si se creó un evento técnico, esto lo gestiona el técnico.
 * - 'asignado': material/entidad en el stock (caja) del técnico que el fue asignado, sin evento (idEventoGenerico ausente). Puede ser algo libre (cables, herramientas) o una entidad del sistema referenciada por idEntidad/tipoEntidad (ej: un Dispositivo Lorawan disponible para cambio de nodo de luminaria).
 */
export const TipoMaterialServicioTecnicoSchema = z.enum([
  'usado',
  'pedido',
  'asignado',
]);
export type TipoMaterialServicioTecnico = z.infer<
  typeof TipoMaterialServicioTecnicoSchema
>;

/**
 * Flujo del pedido: Pendiente (lo pide el técnico) → Aprobado (operador)
 * → Usado (el técnico vuelve, termina el trabajo y lo marca). Anulado en cualquier punto previo a Usado.
 * Para el stock asignado al técnico (tipo 'asignado'): Asignado ↔ Devuelto.
 */
export const EstadoPedidoMaterialSchema = z.enum([
  'Pendiente',
  'Aprobado',
  'Usado',
  'Anulado',
  'Asignado',
  'Devuelto',
]);
export type EstadoPedidoMaterial = z.infer<typeof EstadoPedidoMaterialSchema>;

export const MaterialServicioTecnicoSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idEventoGenerico: z.string().optional(), //Ausente cuando el material es stock asignado a la caja del técnico (tipo 'asignado').
  idUsuario: z.string().optional(), //quien registró/solicitó el material, o a quien está asignado el stock
  tipo: TipoMaterialServicioTecnicoSchema.optional(),
  descripcion: z.string().optional(),
  cantidad: z.number().optional(),
  imagenes: z.array(z.string()).optional(),
  estado: EstadoPedidoMaterialSchema.optional(),
  idEntidad: z.string().optional(), //Entidad del sistema referenciada por este material (opcional).
  tipoEntidad: z.custom<IEntidades>().optional(),
  /** Reservado para stock futuro: vínculo a artículo de inventario. No usar aún. */
  idArticulo: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  evento: z.custom<IEventoGenerico>().optional(),
  usuario: UsuarioSchema.optional(),
  dispositivoLorawan: z.custom<IDispositivoLorawan>().optional(), // populate de idEntidad cuando tipoEntidad === 'Dispositivo Lorawan'
});
export type IMaterialServicioTecnico = z.infer<
  typeof MaterialServicioTecnicoSchema
>;

export const CreateMaterialServicioTecnicoSchema =
  MaterialServicioTecnicoSchema.omit({
    _id: true,
    cliente: true,
    ancestros: true,
    evento: true,
    usuario: true,
    dispositivoLorawan: true,
    fechaCreacion: true,
  });
export type ICreateMaterialServicioTecnico = z.infer<
  typeof CreateMaterialServicioTecnicoSchema
>;

export const UpdateMaterialServicioTecnicoSchema =
  MaterialServicioTecnicoSchema.omit({
    _id: true,
    cliente: true,
    ancestros: true,
    evento: true,
    usuario: true,
    dispositivoLorawan: true,
    fechaCreacion: true,
  });
export type IUpdateMaterialServicioTecnico = z.infer<
  typeof UpdateMaterialServicioTecnicoSchema
>;
