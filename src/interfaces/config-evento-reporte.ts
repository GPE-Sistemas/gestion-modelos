import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IFlota } from './flota';
import { IUbicacion } from './ubicacion';
import { IUsuario } from './usuario';

export type TipoEnvio = 'SMS' | 'WhatsApp' | 'Llamada' | 'Notificacion Push';

export type Agrupacion = 'Flota' | 'Entidad';

export type TipoEntidad = 'Activo';

export interface CondicionNotificacion {
  activo?: {
    velocidad?: {
      'superior a': number;
    };
    ubicacion?: {
      idUbicacion: string;
      dentro?: boolean;
      fuera?: boolean;
      // Virtual
      ubicacion?: IUbicacion;
    };
  };
}

export interface IConfigEventoUsuario {
  _id?: string;
  // Para eventos de una sola vez, al cumplirse se desactiva
  activa?: boolean;
  // Fechas de vigencia para generar los eventos
  validaDesde?: string;
  validaHasta?: string;
  // Frecuencia de generacion de eventos
  generarSoloUnaVez?: boolean;
  // Si pasa el periodo y sigue activa se genera el evento
  generarSiNoSeCumple?: boolean;
  // Notificar al usuario
  notificar?: boolean;
  // Atender el evento
  atender?: boolean;
  // Tipo de envio de la notificacion
  tipoEnvio?: TipoEnvio;
  // Tipo de dispositivo
  tipoEntidad?: TipoEntidad;
  // Configuracion de la condicion para enviar la notificacion
  condicion?: CondicionNotificacion;
  // Agrupacion para buscar las entidades
  agrupacion?: Agrupacion;
  // Sobre que entidades se reciben las notificaciones
  idCliente?: string;
  idFlota?: string;
  idEntidad?: string;
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];

  // Virtual
  usuarios?: IUsuario[];
  cliente?: ICliente;
  flota?: IFlota;
  // Entidades
  activo?: IActivo;
}

type OmitirCreate = '_id' | 'usuarios' | 'cliente' | 'flota' | 'activos';
export interface ICreateConfigEventoUsuario
  extends Omit<Partial<IConfigEventoUsuario>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'usuarios' | 'cliente' | 'flota' | 'activos';
export interface IUpdateConfigEventoUsuario
  extends Omit<Partial<IConfigEventoUsuario>, OmitirUpdate> {}
