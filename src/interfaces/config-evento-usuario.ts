import { IActivo } from './activo';
import { ICliente } from './cliente';
import { ICategoriaEvento } from './categoria-evento';
import { IGrupo } from './grupo';
import { IUbicacion } from './ubicacion';
import { IUsuario } from './usuario';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { ITracker } from './tracker';
import { ITipoEvento } from './tipo-evento';
import { IGeoJSONPoint } from '../auxiliares';
import { ILuminaria } from './luminaria';

export interface IConfigZona {
  particion?: number;
  zona?: number;
}

export type TipoEnvio = 'SMS' | 'WhatsApp' | 'Llamada' | 'Notificacion Push';

export type Agrupacion = 'Grupo' | 'Entidad' | 'Global';

export type TipoEntidad =
  | 'Activo'
  | 'Vehiculo'
  | 'Alarma'
  | 'Usuario'
  | 'Luminaria';

export type Frecuencia =
  | 'Unica'
  | 'Continua'
  | 'Unica en un periodo'
  | 'Continua en un periodo'
  | 'Cronograma';

export interface CondicionNotificacion {
  activo?: {
    velocidad?: {
      'superior a': number;
    };
    estacionado?: {
      ubicacionEstacionado?: IGeoJSONPoint;
      distanciaDeAviso?: number;
    };
    ubicacion?: {
      idUbicacion: string;
      dentro?: boolean;
      fuera?: boolean;
      /**
       * Comprueba que el activo esté asignado a una emergencia medica para generar el evento
       */
      soloEnEmergencias?: boolean;
      // Virtual
      ubicacion?: IUbicacion;
    };
    detenido?: {
      'mas de': number;
    };
    recorridos?: {
      distancia?: number; // METROS
      dentro?: boolean;
      fuera?: boolean;
    };
    divergenciaGPS?: boolean;
  };

  luminaria?: {
    potencia?: {
      'superior a': number;
      'inferior a': number;
    };
    voltaje?: {
      'superior a': number;
      'inferior a': number;
    };
  };

  alarma?: {
    // se le asigna el codigo reportado, y notifica si llega ese evento dentro del periodo o cronograma
    'llega evento'?: string[];
    // se le asigna el codigo reportado, y notifica si no llega ese evento dentro del periodo o cronograma
    'no llega evento'?: string[];
  };
  usuario?: {
    llegoEn: {
      idUsuario: string;
      tiempo: number;
    };
  };
}

export interface CondicionNotificacionCache {
  activo?: {
    velocidad?: {
      'superior a': number;
    };
    estacionado?: {
      ubicacionEstacionado?: IGeoJSONPoint;
      distanciaDeAviso?: number;
    };
    ubicacion?: {
      idUbicacion: string;
      dentro?: boolean;
      fuera?: boolean;
    };
    detenido?: {
      'mas de': number;
    };
    recorridos?: {
      distancia?: number; // METROS
      dentro?: boolean;
      fuera?: boolean;
    };
    divergenciaGPS?: boolean;
  };

  luminaria?: {
    potencia?: {
      'superior a': number;
      'inferior a': number;
    };
    voltaje?: {
      'superior a': number;
      'inferior a': number;
    };
  };

  alarma?: {
    // se le asigna el codigo reportado, y notifica si llega ese evento dentro del periodo o cronograma
    'llega evento'?: string[];
    // se le asigna el codigo reportado, y notifica si no llega ese evento dentro del periodo o cronograma
    'no llega evento'?: string[];
  };
  usuario?: {
    llegoEn: {
      idUsuario: string;
      tiempo: number;
    };
  };
}

export type Dia =
  | 'Lunes'
  | 'Martes'
  | 'Miercoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sabado'
  | 'Domingo';

export interface IConfigEventoUsuario {
  _id?: string;
  fechaCreacion?: string;
  // Para eventos de una sola vez, al cumplirse se desactiva
  activa?: boolean;
  // Agrupaciones temporales
  frecuencia?: Frecuencia;
  // Fechas de vigencia para generar los eventos
  validaDesde?: string;
  validaHasta?: string;
  // Frecuencia de generacion de eventos
  generarSoloUnaVez?: boolean;
  // Si pasa el periodo y sigue activa se genera el evento
  generarSiNoSeCumple?: boolean;
  // Dentro del cronograma
  dias?: Dia[];
  horaInicio?: string;
  horaFin?: string;
  // Minutos que se agregan a los periodos de vigencia
  minutosDeGracia?: number;

  // Notificar al usuario
  notificar?: boolean;
  // Atender el evento
  atender?: boolean;
  // Si es true solo el propio cliente lo puede ver/atender
  noDerivar?: boolean;
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
  idsAncestros?: string[];
  idGrupo?: string;
  idEntidad?: string;
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];
  // Los clientes que pueden atender el evento
  idsClientesQuePuedenAtender?: string[];
  idCategoriaEvento?: string;
  codigoReportado?: string;
  idTipoEvento?: string;
  configZona?: IConfigZona;

  // Virtual
  usuarios?: IUsuario[];
  cliente?: ICliente;
  ancestros?: ICliente[];
  grupo?: IGrupo;
  activo?: IActivo;
  luminaria?: ILuminaria;
  alarma?: IDispositivoAlarma;
  clientesQuePuedenAtender?: ICliente[];
  categoriaEvento?: ICategoriaEvento;
  tracker?: ITracker;
  tipoEvento?: ITipoEvento;
}

type OmitirCreate =
  | '_id'
  | 'usuarios'
  | 'cliente'
  | 'grupo'
  | 'activo'
  | 'luminaria'
  | 'alarma'
  | 'clientesQuePuedenAtender'
  | 'categoriaEvento'
  | 'tracker'
  | 'tipoEvento';
export interface ICreateConfigEventoUsuario extends Omit<
  Partial<IConfigEventoUsuario>,
  OmitirCreate
> {}

type OmitirUpdate =
  | '_id'
  | 'usuarios'
  | 'cliente'
  | 'grupo'
  | 'activo'
  | 'luminaria'
  | 'alarma'
  | 'clientesQuePuedenAtender'
  | 'categoriaEvento'
  | 'tracker'
  | 'tipoEvento';
export interface IUpdateConfigEventoUsuario extends Omit<
  Partial<IConfigEventoUsuario>,
  OmitirUpdate
> {}

export interface IConfigEventoUsuarioCache extends Omit<
  IConfigEventoUsuario,
  | 'usuarios'
  | 'cliente'
  | 'ancestros'
  | 'grupo'
  | 'activo'
  | 'luminaria'
  | 'alarma'
  | 'clientesQuePuedenAtender'
  | 'categoriaEvento'
  | 'tracker'
  | 'tipoEvento'
  | 'condicion'
> {
  condicion?: CondicionNotificacionCache;
}
