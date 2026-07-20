import { z } from 'zod';
import type { IActivo } from './activo';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  ICliente,
  IConfigHorario,
} from './cliente';
import { CategoriaEventoSchema, ICategoriaEvento } from './categoria-evento';
import type { IGrupo } from './grupo';
import type { IUbicacion } from './ubicacion';
import type { IUsuario } from './usuario';
import type { IDispositivoAlarma } from './dispositivo-alarma';
import type { ITracker } from './tracker';
import { IListadoCategoria, ListadoCategoriaSchema } from './listado-categoria';
import { GeoJSONPointSchema, IGeoJSONPoint } from '../auxiliares';
import type { ILuminaria } from './luminaria';

export const ConfigZonaSchema = z.object({
  particion: z.number().optional(),
  zona: z.number().optional(),
});
export type IConfigZona = z.infer<typeof ConfigZonaSchema>;

export const TipoEnvioSchema = z.enum([
  'SMS',
  'WhatsApp',
  'Llamada',
  'Notificacion Push',
]);
export type TipoEnvio = z.infer<typeof TipoEnvioSchema>;

export const AgrupacionSchema = z.enum(['Grupo', 'Entidad', 'Global']);
export type Agrupacion = z.infer<typeof AgrupacionSchema>;

export const TipoEntidadSchema = z.enum([
  'Activo',
  'Vehiculo',
  'Alarma',
  'Usuario',
  'Luminaria',
]);
export type TipoEntidad = z.infer<typeof TipoEntidadSchema>;

export const FrecuenciaSchema = z.enum([
  'Unica',
  'Continua',
  'Unica en un periodo',
  'Continua en un periodo',
  'Cronograma',
]);
export type Frecuencia = z.infer<typeof FrecuenciaSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const CondicionNotificacionSchema = z.object({
  activo: z
    .object({
      velocidad: z
        .object({
          'superior a': z.number(),
        })
        .optional(),
      // Exceso de velocidad según el límite legal de la calle/ruta (no un umbral fijo).
      // El límite se resuelve por backend (TomTom/OSM, ver feature exceso de velocidad).
      excesoVelocidadCalle: z
        .object({
          tolerancia: z.number().optional(), // ej. 0.1 (+10%) sobre el límite antes de generar; default 0.1
          umbralFallback: z.number().optional(), // km/h a usar si la vía no tiene dato de límite
        })
        .optional(),
      estacionado: z
        .object({
          ubicacionEstacionado: GeoJSONPointSchema.optional(),
          distanciaDeAviso: z.number().optional(),
        })
        .optional(),
      ubicacion: z
        .object({
          idUbicacion: z.string(),
          dentro: z.boolean().optional(),
          fuera: z.boolean().optional(),
          /**
           * Comprueba que el activo esté asignado a una emergencia medica para generar el evento
           */
          soloEnEmergencias: z.boolean().optional(),
          // Virtual
          ubicacion: z.custom<IUbicacion>().optional(),
        })
        .optional(),
      detenido: z
        .object({
          'mas de': z.number(),
        })
        .optional(),
      recorridos: z
        .object({
          distancia: z.number().optional(), // METROS
          dentro: z.boolean().optional(),
          fuera: z.boolean().optional(),
        })
        .optional(),
      divergenciaGPS: z.boolean().optional(),
    })
    .optional(),

  alarma: z
    .object({
      // se le asigna el codigo reportado, y notifica si llega ese evento dentro del periodo o cronograma
      'llega evento': z.array(z.string()).optional(),
      // se le asigna el codigo reportado, y notifica si no llega ese evento dentro del periodo o cronograma
      'no llega evento': z.array(z.string()).optional(),
    })
    .optional(),
  luminaria: z
    .object({
      potencia: z
        .object({
          'superior a': z.number().optional(),
          'inferior a': z.number().optional(),
        })
        .optional(),
      voltaje: z
        .object({
          'superior a': z.number().optional(),
          'inferior a': z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  usuario: z
    .object({
      llegoEn: z.object({
        idUsuario: z.string(),
        tiempo: z.number(),
      }),
    })
    .optional(),
});

/**
 * Interface hand-written (misma forma que el schema): referencia IUbicacion
 * (entidad del SCC), así que no usa z.infer para no disparar TS2589/TS7056.
 */
export interface CondicionNotificacion {
  activo?: {
    velocidad?: {
      'superior a': number;
    };
    // Exceso de velocidad según el límite legal de la calle/ruta (no un umbral fijo).
    // El límite se resuelve por backend (TomTom/OSM, ver feature exceso de velocidad).
    excesoVelocidadCalle?: {
      tolerancia?: number; // ej. 0.1 (+10%) sobre el límite antes de generar; default 0.1
      umbralFallback?: number; // km/h a usar si la vía no tiene dato de límite
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

  alarma?: {
    // se le asigna el codigo reportado, y notifica si llega ese evento dentro del periodo o cronograma
    'llega evento'?: string[];
    // se le asigna el codigo reportado, y notifica si no llega ese evento dentro del periodo o cronograma
    'no llega evento'?: string[];
  };
  luminaria?: {
    potencia?: {
      'superior a'?: number;
      'inferior a'?: number;
    };
    voltaje?: {
      'superior a'?: number;
      'inferior a'?: number;
    };
  };
  usuario?: {
    llegoEn: {
      idUsuario: string;
      tiempo: number;
    };
  };
}

export const CondicionNotificacionCacheSchema = z.object({
  activo: z
    .object({
      velocidad: z
        .object({
          'superior a': z.number(),
        })
        .optional(),
      excesoVelocidadCalle: z
        .object({
          tolerancia: z.number().optional(),
          umbralFallback: z.number().optional(),
        })
        .optional(),
      estacionado: z
        .object({
          ubicacionEstacionado: GeoJSONPointSchema.optional(),
          distanciaDeAviso: z.number().optional(),
        })
        .optional(),
      ubicacion: z
        .object({
          idUbicacion: z.string(),
          dentro: z.boolean().optional(),
          fuera: z.boolean().optional(),
        })
        .optional(),
      detenido: z
        .object({
          'mas de': z.number(),
        })
        .optional(),
      recorridos: z
        .object({
          distancia: z.number().optional(), // METROS
          dentro: z.boolean().optional(),
          fuera: z.boolean().optional(),
        })
        .optional(),
      divergenciaGPS: z.boolean().optional(),
    })
    .optional(),

  alarma: z
    .object({
      // se le asigna el codigo reportado, y notifica si llega ese evento dentro del periodo o cronograma
      'llega evento': z.array(z.string()).optional(),
      // se le asigna el codigo reportado, y notifica si no llega ese evento dentro del periodo o cronograma
      'no llega evento': z.array(z.string()).optional(),
    })
    .optional(),
  luminaria: z
    .object({
      potencia: z
        .object({
          'superior a': z.number().optional(),
          'inferior a': z.number().optional(),
        })
        .optional(),
      voltaje: z
        .object({
          'superior a': z.number().optional(),
          'inferior a': z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  usuario: z
    .object({
      llegoEn: z.object({
        idUsuario: z.string(),
        tiempo: z.number(),
      }),
    })
    .optional(),
});

export interface CondicionNotificacionCache {
  activo?: {
    velocidad?: {
      'superior a': number;
    };
    excesoVelocidadCalle?: {
      tolerancia?: number;
      umbralFallback?: number;
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

  alarma?: {
    // se le asigna el codigo reportado, y notifica si llega ese evento dentro del periodo o cronograma
    'llega evento'?: string[];
    // se le asigna el codigo reportado, y notifica si no llega ese evento dentro del periodo o cronograma
    'no llega evento'?: string[];
  };
  luminaria?: {
    potencia?: {
      'superior a'?: number;
      'inferior a'?: number;
    };
    voltaje?: {
      'superior a'?: number;
      'inferior a'?: number;
    };
  };
  usuario?: {
    llegoEn: {
      idUsuario: string;
      tiempo: number;
    };
  };
}

export const DiaSchema = z.enum([
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
]);
export type Dia = z.infer<typeof DiaSchema>;

export const ConfigEventoUsuarioSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  // Para eventos de una sola vez, al cumplirse se desactiva
  activa: z.boolean().optional(),
  // Agrupaciones temporales
  frecuencia: FrecuenciaSchema.optional(),
  // Fechas de vigencia para generar los eventos
  validaDesde: z.string().optional(),
  validaHasta: z.string().optional(),
  // Frecuencia de generacion de eventos
  generarSoloUnaVez: z.boolean().optional(),
  // Si pasa el periodo y sigue activa se genera el evento
  generarSiNoSeCumple: z.boolean().optional(),
  // Dentro del cronograma
  dias: z.array(DiaSchema).optional(),
  horaInicio: z.string().optional(),
  horaFin: z.string().optional(),
  // Minutos que se agregan a los periodos de vigencia
  minutosDeGracia: z.number().optional(),

  // Notificar al usuario
  notificar: z.boolean().optional(),
  // Atender el evento
  atender: z.boolean().optional(),
  // Si es true solo el propio cliente lo puede ver/atender
  noDerivar: z.boolean().optional(),
  // Marca configs autogeneradas por el sistema (p.ej. "Seguimiento ambulancia").
  // Backend la setea al autocrear. Cliente filtra esDelSistema: { $ne: true } para ocultarlas del usuario.
  esDelSistema: z.boolean().optional(),
  // Tipo de envio de la notificacion
  tipoEnvio: TipoEnvioSchema.optional(),
  // Tipo de dispositivo
  tipoEntidad: TipoEntidadSchema.optional(),
  // Configuracion de la condicion para enviar la notificacion
  condicion: CondicionNotificacionSchema.optional(),
  // Agrupacion para buscar las entidades
  agrupacion: AgrupacionSchema.optional(),
  // Sobre que entidades se reciben las notificaciones
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idGrupo: z.string().optional(),
  idEntidad: z.string().optional(),
  // Los usuarios que van a recibir las notificaciones
  idsUsuarios: z.array(z.string()).optional(),
  // Los clientes que pueden atender el evento
  idsClientesQuePuedenAtender: z.array(z.string()).optional(),
  configHorariosAtencion: z.array(ConfigHorarioSchema).optional(),
  idCategoriaEvento: z.string().optional(),
  codigoReportado: z.string().optional(),
  idListadoCategoria: z.string().optional(),
  configZona: ConfigZonaSchema.optional(),

  // Virtual
  usuarios: z.array(z.custom<IUsuario>()).optional(),
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  grupo: z.custom<IGrupo>().optional(),
  activo: z.custom<IActivo>().optional(),
  luminaria: z.custom<ILuminaria>().optional(),
  alarma: z.custom<IDispositivoAlarma>().optional(),
  clientesQuePuedenAtender: z.array(ClienteSchema).optional(),
  categoriaEvento: CategoriaEventoSchema.optional(),
  tracker: z.custom<ITracker>().optional(),
  listadoCategoria: ListadoCategoriaSchema.optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
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
  // Marca configs autogeneradas por el sistema (p.ej. "Seguimiento ambulancia").
  // Backend la setea al autocrear. Cliente filtra esDelSistema: { $ne: true } para ocultarlas del usuario.
  esDelSistema?: boolean;
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
  configHorariosAtencion?: IConfigHorario[];
  idCategoriaEvento?: string;
  codigoReportado?: string;
  idListadoCategoria?: string;
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
  listadoCategoria?: IListadoCategoria;
}

export const CreateConfigEventoUsuarioSchema = ConfigEventoUsuarioSchema.omit({
  _id: true,
  usuarios: true,
  cliente: true,
  grupo: true,
  activo: true,
  luminaria: true,
  alarma: true,
  clientesQuePuedenAtender: true,
  categoriaEvento: true,
  tracker: true,
  listadoCategoria: true,
});

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
  | 'listadoCategoria';
export interface ICreateConfigEventoUsuario
  extends Omit<Partial<IConfigEventoUsuario>, OmitirCreate> {}

export const UpdateConfigEventoUsuarioSchema = ConfigEventoUsuarioSchema.omit({
  _id: true,
  usuarios: true,
  cliente: true,
  grupo: true,
  activo: true,
  luminaria: true,
  alarma: true,
  clientesQuePuedenAtender: true,
  categoriaEvento: true,
  tracker: true,
  listadoCategoria: true,
});

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
  | 'listadoCategoria';
export interface IUpdateConfigEventoUsuario
  extends Omit<Partial<IConfigEventoUsuario>, OmitirUpdate> {}

export const ConfigEventoUsuarioCacheSchema = ConfigEventoUsuarioSchema.omit({
  usuarios: true,
  cliente: true,
  ancestros: true,
  grupo: true,
  activo: true,
  luminaria: true,
  alarma: true,
  clientesQuePuedenAtender: true,
  categoriaEvento: true,
  tracker: true,
  listadoCategoria: true,
  condicion: true,
}).extend({
  condicion: CondicionNotificacionCacheSchema.optional(),
});

export interface IConfigEventoUsuarioCache
  extends Omit<
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
    | 'listadoCategoria'
    | 'condicion'
  > {
  condicion?: CondicionNotificacionCache;
}
