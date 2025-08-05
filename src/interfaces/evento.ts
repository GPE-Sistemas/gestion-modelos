import { ICliente } from './cliente';
import { ITracker } from './tracker';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IReporte } from './reporte';
import { IActivo } from './activo';
import { IConfigEventoUsuario } from './config-evento-usuario';
import { SonidoEvento } from './categoria-evento';
import { IUsuario } from './usuario';
import { ILuminaria } from './luminaria';
import { IBotonBluetooth } from './boton-bluetooth';

export interface IContactID {
  numeroCuenta?: string;
  tipoMensaje?: string;
  calificadorDeEvento?: string;
  codigoDeEvento?: string;
  numeroDeParticion?: string;
  numeroDeZona?: string;
  checksum?: string;
}

export type estadoEvento =
  | 'Sin Tratamiento'
  | 'Pendiente'
  | 'En Atención'
  | 'En Espera'
  | 'Liberada'
  | 'Finalizada';

export type tipoEvento =
  | 'Colectivo'
  | 'Activo'
  | 'Tracker'
  | 'Vehiculo'
  | 'Alarma'
  | 'Luminaria'
  | 'BotonBLE';
export interface IValoresEvento {
  titulo?: string;
  mensaje?: string;
  color?: string;
  sonido?: SonidoEvento;
  // Solo para eventos de tracker
  codigoTracker?: string;
  // Solo para eventos de alarma
  contactId?: IContactID;
  codigoAlarma?: string;
  codigoComunicador?: string;
  tiposEvento?: ('Armado' | 'Desarmado' | 'Detonación' | 'Test')[]; // Armado, Desarmado, detonacion, etc
  // Otros campos
  [key: string]: any;
}

export interface IEvento {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  //

  notificar?: boolean;
  atender?: boolean;
  noDerivar?: boolean;
  fechaCreacion?: string;
  posponerHasta?: string;
  estado?: estadoEvento;
  valores?: IValoresEvento;
  codigoEvento?: string;
  prioridad?: number;
  repetido?: number;
  fechaUltimoRepetido?: string;
  //
  //ids Asignados
  idTracker?: string;
  idAlarma?: string;
  idUsuario?: string;
  idLuminaria?: string;
  tipo?: tipoEvento;
  idsClientesQuePuedenAtender?: string[];
  idsClientesAtendiendo?: string[];
  idsUsuariosAtendiendo?: string[];
  idReporte?: string;
  idActivo?: string;
  idBotonBluetooth?: string;
  idConfigEventoUsuario?: string;

  // Populate
  tracker?: ITracker;
  alarma?: IDispositivoAlarma;
  luminaria?: ILuminaria;
  usuario?: IUsuario;
  cliente?: ICliente;
  ancestros?: ICliente[];
  reporte?: IReporte;
  activo?: IActivo;
  configEventoUsuario?: IConfigEventoUsuario;
  botonBluetooth?: IBotonBluetooth;
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'tracker'
  | 'alarma'
  | 'reporte'
  | 'activo'
  | 'botonBluetooth'
  | 'configEventoUsuario';

export interface ICreateEvento extends Omit<Partial<IEvento>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'tracker'
  | 'alarma'
  | 'reporte'
  | 'activo'
  | 'botonBluetooth'
  | 'configEventoUsuario';

export interface IUpdateEvento extends Omit<Partial<IEvento>, OmitirUpdate> {}
