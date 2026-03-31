import { DireccionV2, IGeoJSONPoint } from '../auxiliares';
import { ICliente } from './cliente';
import { IConfigEventoUsuario } from './config-evento-usuario';
import { IDestinatarioAsistencia } from './destinatario-asistencia';
import { IEventoGenerico } from './evento-generico';
import { IUbicacion } from './ubicacion';

export interface IEmergencia {
  //IDS
  _id?: string;
  idDestinatarioAsistencia?: string;
  idCliente?: string;
  idsAncestros?: string[];

  //DATOS GENERALES DE LA EMERGENCIA
  tipo?: TipoEmergencia;
  prioridadApertura?: PrioridadEmergenciaMedica | PrioridadEmergenciaBombero; //Prioridad de apertura de la emergencia
  prioridadCierre?: PrioridadEmergenciaMedica | PrioridadEmergenciaBombero; //Prioridad asignada por el personal correspondiente
  codigo?: number; // Código único del caso de emergencia médica es incremental
  solicitante?: string; // Nombre del solicitante de la emergencia
  telefono?: string; // Teléfono de contacto del solicitante
  archivosAdjuntos?: IArchivosAdjuntos[];
  observaciones?: string; // Notas adicionales sobre el auxilio

  //FECHAS RELEVANTES DE LA EMERGENCIA
  fechaCreacion?: string;
  fechaPrimeraAsignacion?: string;
  fechaSalida?: string; //La ambulancia puede salir del centro o salir desde otro lugar (este dato debe analizarse junto con el campo salioDelCentro)
  fechaLlegadaDestino?: string;
  fechaFinalizacion?: string;

  //SITUACIÓN DE LA EMERGENCIA
  //Si no es ninguna de estas, es una llamada común que no requiere seguimiento ni auxilio, ni tampoco es una emergencia ya atendida en el hospital.
  esAuxilio?: boolean; //Esto es para indicar si la emergencia requiere un seguimiento extra, es decir, se hace algo más que sólo registrarla
  enSeguimiento?: boolean; //Una emergencia en seguimiento es aquella que no es auxilio y requiere seguimiento. Si está en seguimiento, no se le pueden asignar/reasignar nada. Pueden pasarse en un futuro a auxilio.
  iniciaFinalizada?: boolean; //Indica que la emergencia que se está cargando ya está finalizada (simplemente sirve como registro), si está esta opción, se pueden cargar detalles de la atención recibida.
  importada?: boolean; //Las emergencias importadas sólo sirven para las métricas, no se muestran en el listado

  //DATOS DE UBICACIÓN
  direccion?: string; //Esta es la dirección que el solicitante indica para la emergencia. No tiene nada que ver con las direcciones que puede haber en los seguimientos
  ubicacionDestino?: IGeoJSONPoint; //geojson del lugar de la emergencia
  idUbicacion?: string; //Cuando se crea una emergencia, se genera la entidad IUbicacion para la ubicacion, para luego ejecutar una lógica de negocio junto con la configEventoUsuario.

  //SEGUIMIENTO DE LA EMERGENCIA
  asignada?: boolean; //Indica si a la emergencia se le asignó alguna clase de personal para el seguimiento (vehículos, médicos, choferes, etc)
  ultimaActualizacion?: string;
  ultimoEventoEmergencia?: IEventoGenerico; //Acá se carga el último evento para hacer el seguimiento del auxilio
  salioDelCentro?: boolean; //En caso de que sea un auxilio, se indica si el móvil asignado salió del centro o no para ir al destino.
  centroEnTransito?: boolean; //Indica si la ambulancia pasó por un centro en el camino (sirve para diferenciar el caso en el que la ambulancia sale de un centro o pasa por uno. Esto sirve para determinar el campo salioDelCentro)
  cantidadReasignaciones?: number; //Cuenta la cantidad de reasignaciones que tuvo la emergencia

  //DATOS ESPECÍFICOS DE CADA TIPO DE EMERGENCIA
  emergenciaMedica?: IEmergenciaMedica;
  emergenciaBomberos?: IEmergenciaBomberos;

  //Populate
  destinatarioAsistencia?: IDestinatarioAsistencia; // Información del paciente
  cliente?: ICliente;
  ancestros?: ICliente[];
  ubicacion?: IUbicacion;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type PrioridadEmergenciaMedica = 'Verde' | 'Amarillo' | 'Rojo' | 'Negro';

export type PrioridadEmergenciaBombero =
  | 'Baja'
  | 'Media'
  | 'Alta'
  | 'Crítica'
  | 'Óbito';

export type TipoEmergencia = 'Médica' | 'Bombero';

export interface IArchivosAdjuntos {
  fechaSubida?: string;
  descripcion?: string;
  archivo?: string; //url del archivo
  usuario?: string; //usuario que subió el archivo
  nombreOriginal?: string; //El nombre del archivo que se subió
}

export interface SignosVitales {
  tensionArterial?: number; //miligramos de mercurio (mmHg)
  frecuenciaRespiratoria?: number; //impulsos respiratorios por minuto (irpm)
  frecuenciaCardiaca?: number; //latidos por minuto (lpm)
  saturacionOxigeno?: number; // %
  temperatura?: number; //grados
}
export interface InfoTraslado {
  traslado?: boolean;
  direccion?: string;
  aceptaTraslado?: boolean; //indica si el paciente acepta ser trasladado o se niega
}
export interface IEmergenciaMedica {
  sintomasApertura?: string[]; // Lista de síntomas reportados al inicio
  sintomasCierre?: string[]; // Lista de síntomas reportados al finalizar una emergencia con un diagnóstico
  tratamiento?: string; //Tratamiento realizado
  diagnostico?: string; // Diagnóstico hecho
  medicacion?: string; // Medicación administrada
  irAHospital?: boolean; //Esto se marca una vez que la ambulancia haya llegado a la dirección de auxilio y se dé el ok para ir al hospital (se indica manualmente)
  fechaLlegadaHospital?: string;
  signosVitales?: SignosVitales;
  traslado?: InfoTraslado;
}

export interface IEmergenciaBomberos {
  irCuartel?: string[]; //Acá irán todos los usuarios que confirman ir al cuartel
}

type OmitirCreate = '_id';

export interface ICreateEmergencia extends Omit<
  Partial<IEmergencia>,
  OmitirCreate
> {}

type OmitirUpdate = '_id';

export interface IUpdateEmergencia extends Omit<
  Partial<IEmergencia>,
  OmitirUpdate
> {}
