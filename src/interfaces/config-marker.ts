import { ICliente } from './cliente';

export interface IConfigMarker {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  //
  scope: 'cliente' | 'grupo' | 'activo';
  idRef: string; // idCliente, idGrupo o idActivo

  // Icono para el marker - En el front el usuario elige si ver por tipo o funcion
  //
  vehicleTypeIcon?: string; // url imagen PNG - Idealemnente con fondo transparente para ver el color de la flota
  vehiculeTypeIconColor?: string; // color HEX para el icono por tipo
  vehicleFunctionIcon?: string; // url imagen PNG - Idealemnente con fondo transparente para ver el color de la flota
  vehicleFunctionIconColor?: string; // color HEX para el icono por funcion

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

  // Populate
  cliente?: ICliente;
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
