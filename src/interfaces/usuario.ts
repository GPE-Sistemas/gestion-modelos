import { ICliente } from './cliente';
import { IPermiso } from './permiso';

export type Rol =
  | 'Administrador'
  | 'Operador'
  | 'Conductor'
  | 'Chofer Colectivo'
  | 'Consultor'
  | 'Técnico'
  | 'Final'
  | 'Administrador Emergencias' //Puede crear/editar emergencias, hospitales, choferes, solicitantes, centros de atención, destinatarios asistencia, personal de salud.
  // Puede ver todas las solapas del módulo de emergencias.
  | 'Registrador Emergencias' //Puede crear/editar emergencias y solicitantes
  //Puede ver todas las solapas del módulo emergencias, menos el dashboard con estadísticas
  | 'Móvil Emergencias'; //Usuario de la aplicación móvil, puede editar los eventos de emergencias (seguimiento)
//Puede ver todo lo que está en el módulo de emergencias de la aplicación móvil.

export interface IModulos {
  moduloColectivos?: boolean;
  moduloAlarmasDomiciliarias?: boolean;
  moduloCamaras?: boolean;
  moduloLuminarias?: boolean;
  moduloEmergenciasMedicas?: boolean;
  moduloEmergenciasBomberos?: boolean;
  moduloActivos?: boolean;
  moduloAdministracion?: boolean;
  moduloEventosTecnicos?: boolean;
  moduloVehiculos?: boolean;
  moduloLogs?: boolean;
  moduloIntegraciones?: boolean;
  moduloSirenas?: boolean;
  moduloAlertasSeguridad?: boolean;
}

export interface IDatosPersonales {
  nombre?: string;
  dni?: string;
  sexo?: boolean;
  email?: string;
  direccion?: string;
  pais?: string;
  telefono?: string;
  fechaNacimiento?: string;
  foto?: string;
}

export interface IConfigUsuario {
  notasEnPrimerPlano?: boolean;
  cantMapasVehiculos?: number;
  noMostrarGuardarClaveAlarma?: boolean;
  clavesAlarma?: IClaveUsuarioAlarma[];
}

export interface IClaveUsuarioAlarma {
  idAlarma?: string;
  clave?: string;
}

export interface IUsuario {
  _id?: string;
  identificacionInterna?: string;
  idCliente?: string;
  idsAncestros?: string[];
  //
  idExterno?: string;
  fechaCreacion?: string;
  usuario?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  config?: IConfigUsuario;
  // Populate / Virtual
  cliente?: ICliente;
  ancestros?: ICliente[];
  // Permisos del usuario. Ya no es un array embebido: es un virtual poblado
  // desde la colección Permiso por match de nombreUsuario (Permiso.nombreUsuario === Usuario.usuario).
  permisos?: IPermiso[];
}

type OmitirCreate = '_id' | 'cliente' | 'fechaCreacion';

export interface ICreateUsuario extends Omit<Partial<IUsuario>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'fechaCreacion';

export interface IUpdateUsuario extends Omit<Partial<IUsuario>, OmitirUpdate> {}
