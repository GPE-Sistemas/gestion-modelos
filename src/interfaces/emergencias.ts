import { z } from 'zod';
import { GeoJSONPointSchema, IGeoJSONPoint } from '../auxiliares';
import { ClienteSchema, ICliente } from './cliente';
import type { IDestinatarioAsistencia } from './destinatario-asistencia';
import type { IEventoGenerico } from './evento-generico';
import type { IUbicacion } from './ubicacion';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const PrioridadEmergenciaMedicaSchema = z.enum([
  'Verde',
  'Amarillo',
  'Rojo',
  'Negro',
  'Celeste',
]);
export type PrioridadEmergenciaMedica = z.infer<
  typeof PrioridadEmergenciaMedicaSchema
>;

export const PrioridadEmergenciaBomberoSchema = z.enum([
  'Baja',
  'Media',
  'Alta',
  'Crítica',
  'Óbito',
]);
export type PrioridadEmergenciaBombero = z.infer<
  typeof PrioridadEmergenciaBomberoSchema
>;

export const TipoEmergenciaSchema = z.enum(['Médica', 'Bombero']);
export type TipoEmergencia = z.infer<typeof TipoEmergenciaSchema>;

export const ArchivosAdjuntosSchema = z.object({
  fechaSubida: z.string().optional(),
  descripcion: z.string().optional(),
  archivo: z.string().optional(), //url del archivo
  usuario: z.string().optional(), //usuario que subió el archivo
  nombreOriginal: z.string().optional(), //El nombre del archivo que se subió
});
export type IArchivosAdjuntos = z.infer<typeof ArchivosAdjuntosSchema>;

export const SignosVitalesSchema = z.object({
  tensionArterial: z.number().optional(), //miligramos de mercurio (mmHg)
  frecuenciaRespiratoria: z.number().optional(), //impulsos respiratorios por minuto (irpm)
  frecuenciaCardiaca: z.number().optional(), //latidos por minuto (lpm)
  saturacionOxigeno: z.number().optional(), // %
  temperatura: z.number().optional(), //grados
});
export type SignosVitales = z.infer<typeof SignosVitalesSchema>;

export const InfoTrasladoSchema = z.object({
  traslado: z.boolean().optional(),
  direccion: z.string().optional(),
  aceptaTraslado: z.boolean().optional(), //indica si el paciente acepta ser trasladado o se niega
});
export type InfoTraslado = z.infer<typeof InfoTrasladoSchema>;

export const EmergenciaMedicaSchema = z.object({
  sintomasApertura: z.array(z.string()).optional(), // Lista de síntomas reportados al inicio
  sintomasCierre: z.array(z.string()).optional(), // Lista de síntomas reportados al finalizar una emergencia con un diagnóstico
  tratamiento: z.string().optional(), //Tratamiento realizado
  diagnostico: z.string().optional(), // Diagnóstico hecho
  medicacion: z.string().optional(), // Medicación administrada
  irAHospital: z.boolean().optional(), //Esto se marca una vez que la ambulancia haya llegado a la dirección de auxilio y se dé el ok para ir al hospital (se indica manualmente)
  fechaLlegadaHospital: z.string().optional(),
  signosVitales: SignosVitalesSchema.optional(),
  traslado: InfoTrasladoSchema.optional(),
});
export type IEmergenciaMedica = z.infer<typeof EmergenciaMedicaSchema>;

export const EmergenciaBomberosSchema = z.object({
  irCuartel: z.array(z.string()).optional(), //Acá irán todos los usuarios que confirman ir al cuartel
});
export type IEmergenciaBomberos = z.infer<typeof EmergenciaBomberosSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const EmergenciaSchema = z.object({
  //IDS
  _id: z.string().optional(),
  idDestinatarioAsistencia: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),

  //DATOS GENERALES DE LA EMERGENCIA
  tipo: TipoEmergenciaSchema.optional(),
  prioridadApertura: z
    .union([PrioridadEmergenciaMedicaSchema, PrioridadEmergenciaBomberoSchema])
    .optional(), //Prioridad de apertura de la emergencia
  prioridadCierre: z
    .union([PrioridadEmergenciaMedicaSchema, PrioridadEmergenciaBomberoSchema])
    .optional(), //Prioridad asignada por el personal correspondiente
  codigo: z.number().optional(), // Código único del caso de emergencia médica es incremental
  solicitante: z.string().optional(), // Nombre del solicitante de la emergencia
  telefono: z.string().optional(), // Teléfono de contacto del solicitante
  archivosAdjuntos: z.array(ArchivosAdjuntosSchema).optional(),
  observaciones: z.string().optional(), // Notas adicionales sobre el auxilio

  //FECHAS RELEVANTES DE LA EMERGENCIA
  fechaCreacion: z.string().optional(),
  fechaPrimeraAsignacion: z.string().optional(),
  fechaSalida: z.string().optional(), //La ambulancia puede salir del centro o salir desde otro lugar (este dato debe analizarse junto con el campo salioDelCentro)
  fechaLlegadaDestino: z.string().optional(),
  fechaFinalizacion: z.string().optional(),

  //SITUACIÓN DE LA EMERGENCIA
  //Si no es ninguna de estas, es una llamada común que no requiere seguimiento ni auxilio, ni tampoco es una emergencia ya atendida en el hospital.
  esAuxilio: z.boolean().optional(), //Esto es para indicar si la emergencia requiere un seguimiento extra, es decir, se hace algo más que sólo registrarla
  enSeguimiento: z.boolean().optional(), //Una emergencia en seguimiento es aquella que no es auxilio y requiere seguimiento. Si está en seguimiento, no se le pueden asignar/reasignar nada. Pueden pasarse en un futuro a auxilio.
  iniciaFinalizada: z.boolean().optional(), //Indica que la emergencia que se está cargando ya está finalizada (simplemente sirve como registro), si está esta opción, se pueden cargar detalles de la atención recibida.
  importada: z.boolean().optional(), //Las emergencias importadas sólo sirven para las métricas, no se muestran en el listado

  //DATOS DE UBICACIÓN
  direccion: z.string().optional(), //Esta es la dirección que el solicitante indica para la emergencia. No tiene nada que ver con las direcciones que puede haber en los seguimientos
  ubicacionDestino: GeoJSONPointSchema.optional(), //geojson del lugar de la emergencia
  idUbicacion: z.string().optional(), //Cuando se crea una emergencia, se genera la entidad IUbicacion para la ubicacion, para luego ejecutar una lógica de negocio junto con la configEventoUsuario.

  //SEGUIMIENTO DE LA EMERGENCIA
  asignada: z.boolean().optional(), //Indica si a la emergencia se le asignó alguna clase de personal para el seguimiento (vehículos, médicos, choferes, etc)
  ultimaActualizacion: z.string().optional(),
  ultimoEventoEmergencia: z.custom<IEventoGenerico>().optional(), //Acá se carga el último evento para hacer el seguimiento del auxilio
  salioDelCentro: z.boolean().optional(), //En caso de que sea un auxilio, se indica si el móvil asignado salió del centro o no para ir al destino.
  centroEnTransito: z.boolean().optional(), //Indica si la ambulancia pasó por un centro en el camino (sirve para diferenciar el caso en el que la ambulancia sale de un centro o pasa por uno. Esto sirve para determinar el campo salioDelCentro)
  cantidadReasignaciones: z.number().optional(), //Cuenta la cantidad de reasignaciones que tuvo la emergencia

  //DATOS ESPECÍFICOS DE CADA TIPO DE EMERGENCIA
  emergenciaMedica: EmergenciaMedicaSchema.optional(),
  emergenciaBomberos: EmergenciaBomberosSchema.optional(),

  //Populate
  destinatarioAsistencia: z.custom<IDestinatarioAsistencia>().optional(), // Información del paciente
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  ubicacion: z.custom<IUbicacion>().optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
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

export const CreateEmergenciaSchema = EmergenciaSchema.omit({
  _id: true,
});

type OmitirCreate = '_id';

export interface ICreateEmergencia
  extends Omit<Partial<IEmergencia>, OmitirCreate> {}

export const UpdateEmergenciaSchema = EmergenciaSchema.omit({
  _id: true,
});

type OmitirUpdate = '_id';

export interface IUpdateEmergencia
  extends Omit<Partial<IEmergencia>, OmitirUpdate> {}
