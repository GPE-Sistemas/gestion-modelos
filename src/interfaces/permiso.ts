import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IGrupo } from './grupo';
import { ILuminaria } from './luminaria';
import { IRol } from './rol';
import { IModulos, IUsuario, Rol } from './usuario';

export type Nivel = 'Cliente' | 'Grupo' | 'Entidad';
export type TipoEntidadPermiso =
  | 'Activo'
  | 'Vehículo'
  | 'Colectivo'
  | 'Luminaria'
  | 'Alarma'
  | 'Cámara';

export interface IVencimientoPermisoUsuario {
  // Venicimiento de un permiso con sus respectivas opciones
  fechaVencimiento?: string;
  eliminarPermiso?: boolean;
  desactivarUsuario?: boolean;
  eliminarUsuario?: boolean;
}

export interface ICredencialesSeguridad {
  usuario?: string;
  claveEncriptada?: string;
}

//Par actualizar credenciales de seguridad vía PUT /:id/credencialesSeguridad, se recibe este DTO con los datos en texto plano
// (la gestion-api-gestion se encarga de cifrar la clave antes de persistir)
export interface IUpdateCredencialesSeguridad {
  idCliente: string;
  usuario: string;
  clave: string;
  // _id del permiso al que aplicar las credenciales (antes era el índice en el array de Usuario)
  idPermiso?: string;
}

export interface IPermiso {
  _id?: string;
  // Vínculo con el usuario: nombre de usuario normalizado (lowercase/trim).
  // El permiso puede existir aunque el usuario todavía no esté registrado.
  nombreUsuario?: string;
  fechaCreacion?: string;
  //
  nivel?: Nivel;
  // Para nivel Cliente
  idCliente?: string;
  includeChildren?: boolean;
  idsAncestros?: string[];
  // Para nivel Grupo
  idsGrupos?: string[];
  // Para nivel Entidad
  tipoEntidad?: TipoEntidadPermiso;
  idsEntidades?: string[];
  //
  activo?: boolean; // Si el permiso está activo o no
  vencimiento?: IVencimientoPermisoUsuario;
  modulos?: IModulos;

  /**
   * @deprecated El campo 'roles' está en desuso. Se eliminará en futuras versiones. Los reemplaza "idsRoles" y el virtual "Rols"
   */
  roles?: Rol[];

  idsRoles?: string[]; // IDs de los roles asignados al permiso

  credencialesSeguridad?: ICredencialesSeguridad; // Credenciales del sistema de seguridad (AES encriptadas)
  tieneCredencialesSeguridad?: boolean; // Virtual: true si el permiso tiene credenciales configuradas

  // Virtual
  usuario?: IUsuario; // Usuario vinculado, populado por nombreUsuario
  cliente?: ICliente;
  ancestros?: ICliente[];
  grupos?: IGrupo[];
  activos?: IActivo[]; // Entidades pobladas según el tipoEntidad
  luminarias?: ILuminaria[]; // Entidades pobladas según el tipoEntidad
  alarmas?: IDispositivoAlarma[]; // Entidades pobladas según el tipoEntidad
  rols?: IRol[]; // Roles poblados según idsRoles
}

type OmitirVirtuals =
  | 'usuario'
  | 'cliente'
  | 'ancestros'
  | 'grupos'
  | 'activos'
  | 'luminarias'
  | 'alarmas'
  | 'rols'
  | 'tieneCredencialesSeguridad';

type OmitirCreate = '_id' | 'fechaCreacion' | OmitirVirtuals;

export interface ICreatePermiso
  extends Omit<Partial<IPermiso>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'fechaCreacion' | OmitirVirtuals;

export interface IUpdatePermiso
  extends Omit<Partial<IPermiso>, OmitirUpdate> {}
