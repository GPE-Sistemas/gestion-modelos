import { FuncionActivo, TipoVehiculo } from './activo';
import { ICliente } from './cliente';

export interface IVistaMarker {
  tipoVehiculo?: TipoVehiculo;
  funcionVehiculo?: FuncionActivo;

  // Icono para el marker - En el front el usuario elige si ver por tipo o funcion
  //
  vehicleTypeIcon?: string; // url imagen PNG - Idealemnente con fondo transparente para ver el color de la flota
  vehiculeTypeIconColor?: string; // color HEX para el icono por tipo
  vehicleFunctionIcon?: string; // url imagen PNG - Idealemnente con fondo transparente para ver el color de la flota
  vehicleFunctionIconColor?: string; // color HEX para el icono por funcion

  // Color icon
  useOriginalIconColor?: boolean; // Si es true, usa el color original del icono, no aplica vehicleFunctionIcon vehicleFunctionIconColor groupColorIcon groupColorBackground

  // Color segun el grupo
  //
  groupColorIcon?: boolean; // Si es true, el icono toma el color del grupo
  groupColorBackground?: boolean; // Si es true, el fondo del marker toma el color del grupo

  // Estado | Aro al rededor del icono
  //
  offColor?: string; // color HEX / Color cuando el vehiculo esta apagado
  stopColor?: string; // color HEX / Color cuando el vehiculo esta encendido y detenido
  movingColor?: string; // color HEX / Color cuando el vehiculo esta encendido y en movimiento
  movingDegraded?: boolean; // Si es true, el color moving se cambia de acuerdo a la velocidad de verde a rojo
}

export interface IConfigMarker {
  _id?: string;
  //
  fechaCreacion?: string;

  // Define quien puede usar este marker
  //
  global?: boolean; // Si es global, puede ser usado por cualquiera
  idCliente?: string; // IdCliente que lo creó
  idsAncestros?: string[]; // IdsAncestros del cliente que lo creó
  idUsuario?: string; // Si tiene idUsuario, solo lo puede usar ese usuario

  // Sobre que aplica este marker
  //
  idClienteVer?: string; // idCliente del grupo o activo a ver; o repetido el idRef si scope es cliente ya que idRef es idCliente
  scope: 'cliente' | 'grupo' | 'activo';
  idRef: string; // idCliente, idGrupo o idActivo

  vistas?: IVistaMarker[];

  // Populate
  cliente?: ICliente;
  clienteVer?: ICliente;
  ancestros?: ICliente[];
}

type Omitir =
  | '_id'
  | 'idsAncestros'
  // Virtuals
  | 'cliente'
  | 'ancestros';

export interface ICreateConfigMarker
  extends Omit<Partial<IConfigMarker>, Omitir> {}
export interface IUpdateConfigMarker
  extends Omit<Partial<IConfigMarker>, Omitir> {}
