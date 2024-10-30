import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IGrupo } from "./grupo";
import { IUbicacion } from "./ubicacion";
import { IUsuario } from "./usuario";

export type TipoEnvio = "SMS" | "WhatsApp" | "Llamada" | "Notificacion Push";

export type Agrupacion = "Grupo" | "Entidad";

export type TipoEntidad = "Activo" | "Vehiculo" | "Alarma";

export type Frecuencia =
  | "Unica"
  | "Continua"
  | "Unica en un periodo"
  | "Continua en un periodo"
  | "Cronograma";

export interface CondicionNotificacion {
  activo?: {
    velocidad?: {
      "superior a": number;
    };
    ubicacion?: {
      idUbicacion: string;
      dentro?: boolean;
      fuera?: boolean;
      // Virtual
      ubicacion?: IUbicacion;
    };
    detenido?: {
      "mas de": number;
    };
  };
  alarma?: {
    // Notifica si la alarma ES armada dentro del horario
    armada?: boolean;
    // Notifica si la alarma NO ES armada dentro del horario
    "no armada"?: boolean;
    // Notifica si la alarma ES desarmada dentro del horario
    desarmada?: boolean;
    // Notifica si la alarma NO ES desarmada dentro del horario
    "no desarmada"?: boolean;
  };
}

export type Dia =
  | "Lunes"
  | "Martes"
  | "Miercoles"
  | "Jueves"
  | "Viernes"
  | "Sabado"
  | "Domingo";

export interface IConfigEventoUsuario {
  _id?: string;
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
  idGrupo?: string;
  idEntidad?: string;
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios?: string[];

  // Virtual
  usuarios?: IUsuario[];
  cliente?: ICliente;
  grupo?: IGrupo;
  // Entidades
  activo?: IActivo;
}

type OmitirCreate = "_id" | "usuarios" | "cliente" | "grupo" | "activos";
export interface ICreateConfigEventoUsuario
  extends Omit<Partial<IConfigEventoUsuario>, OmitirCreate> {}

type OmitirUpdate = "_id" | "usuarios" | "cliente" | "grupo" | "activos";
export interface IUpdateConfigEventoUsuario
  extends Omit<Partial<IConfigEventoUsuario>, OmitirUpdate> {}
