import { z } from 'zod';
import { FuncionActivoSchema, TipoVehiculoSchema } from './activo';
import { ClienteSchema } from './cliente';

export const VistaMarkerSchema = z.object({
  tipoVehiculo: TipoVehiculoSchema.optional(),
  funcionVehiculo: FuncionActivoSchema.optional(),

  // Icono para el marker - En el front el usuario elige si ver por tipo o funcion
  //
  vehicleTypeIcon: z.string().optional(), // url imagen PNG - Idealemnente con fondo transparente para ver el color de la flota
  vehiculeTypeIconColor: z.string().optional(), // color HEX para el icono por tipo
  vehicleFunctionIcon: z.string().optional(), // url imagen PNG - Idealemnente con fondo transparente para ver el color de la flota
  vehicleFunctionIconColor: z.string().optional(), // color HEX para el icono por funcion

  // Color icon
  useOriginalIconColor: z.boolean().optional(), // Si es true, usa el color original del icono, no aplica vehicleFunctionIcon vehicleFunctionIconColor groupColorIcon groupColorBackground

  // Color segun el grupo
  //
  groupColorIcon: z.boolean().optional(), // Si es true, el icono toma el color del grupo
  groupColorBackground: z.boolean().optional(), // Si es true, el fondo del marker toma el color del grupo

  // Estado | Aro al rededor del icono
  //
  offColor: z.string().optional(), // color HEX / Color cuando el vehiculo esta apagado
  stopColor: z.string().optional(), // color HEX / Color cuando el vehiculo esta encendido y detenido
  movingColor: z.string().optional(), // color HEX / Color cuando el vehiculo esta encendido y en movimiento
  movingDegraded: z.boolean().optional(), // Si es true, el color moving se cambia de acuerdo a la velocidad de verde a rojo
});
export type IVistaMarker = z.infer<typeof VistaMarkerSchema>;

export const ConfigMarkerSchema = z.object({
  _id: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),

  // Define quien puede usar este marker
  //
  global: z.boolean().optional(), // Si es global, puede ser usado por cualquiera
  idCliente: z.string().optional(), // IdCliente que lo creó
  idsAncestros: z.array(z.string()).optional(), // IdsAncestros del cliente que lo creó
  idUsuario: z.string().optional(), // Si tiene idUsuario, solo lo puede usar ese usuario

  // Sobre que aplica este marker
  //
  idClienteVer: z.string().optional(), // idCliente del grupo o activo a ver; o repetido el idRef si scope es cliente ya que idRef es idCliente
  scope: z.enum(['cliente', 'grupo', 'activo']),
  idRef: z.string(), // idCliente, idGrupo o idActivo

  vistas: z.array(VistaMarkerSchema).optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  clienteVer: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IConfigMarker = z.infer<typeof ConfigMarkerSchema>;

// El original era Omit<Partial<IConfigMarker>, Omitir>: acá el Partial NO era
// no-op (scope e idRef son requeridos en la base), por eso se agrega .partial().
export const CreateConfigMarkerSchema = ConfigMarkerSchema.omit({
  _id: true,
  idsAncestros: true,
  // Virtuals
  cliente: true,
  ancestros: true,
}).partial();
export type ICreateConfigMarker = z.infer<typeof CreateConfigMarkerSchema>;

export const UpdateConfigMarkerSchema = ConfigMarkerSchema.omit({
  _id: true,
  idsAncestros: true,
  // Virtuals
  cliente: true,
  ancestros: true,
}).partial();
export type IUpdateConfigMarker = z.infer<typeof UpdateConfigMarkerSchema>;
