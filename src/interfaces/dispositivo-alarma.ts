import { z } from 'zod';
import { CamaraSchema, ICamara } from './camara';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  CredencialesAlarmaSchema,
  ICliente,
  IConfigHorario,
  ICredencialesAlarma,
} from './cliente';
import type { Dia } from './config-evento-usuario';
import type { estadoCuenta } from './estado-entidad';
import {
  IModeloDispositivo,
  ModeloDispositivoSchema,
} from './modelo-dispositivo';
import {
  IServicioContratado,
  ServicioContratadoSchema,
} from './servicio-contratado';
import type { IUbicacion } from './ubicacion';

/// Lepra ( interfaces para las respuestas de HSI )
export const TipoEmergenciaAlarmaSchema = z.enum([
  'Pánico',
  'Médica',
  'Incendio',
]);
export type TipoEmergenciaAlarma = z.infer<typeof TipoEmergenciaAlarmaSchema>;

export const TiposDeArmadoSchema = z.enum(['T', 'D', 'p1']);
export type TiposDeArmado = z.infer<typeof TiposDeArmadoSchema>;
/// T es away(ausente ) p1 (stay (casa) D es desarmado
////

export const CodigoTipoSensorSchema = z.enum([
  'PIR',
  'DRV',
  'MMG',
  'BIR',
  'PAS',
  'PPC',
  'TAM',
  'OCR',
  'HUM',
  'PFU',
  'ELE',
  'BUM',
  'CEM',
  'VOL',
  'DTS',
  'SIS',
  'AMK',
]);
export type CodigoTipoSensor = z.infer<typeof CodigoTipoSensorSchema>;

export const ModoSensorSchema = z.enum([
  'Seguidor',
  'Demorado',
  'Instantaneo',
]);
export type ModoSensor = z.infer<typeof ModoSensorSchema>;

export const OperadorSchema = z.enum([
  'Personal',
  'Claro',
  'Movistar',
  'Tuenti',
  'Otro',
]);
export type Operador = z.infer<typeof OperadorSchema>;

export const SimSchema = z.object({
  iccid: z.string().optional(),
  numero: z.string().optional(),
  operador: OperadorSchema.optional(),
  apn: z.string().optional(),
  usuario: z.string().optional(),
  password: z.string().optional(),
});
export type ISim = z.infer<typeof SimSchema>;

export const UltimaConexionSchema = z.object({
  lastIp: z.string().optional(),
  lastPort: z.string().optional(),
  sequence: z.number(),
});
export type IUltimaConexion = z.infer<typeof UltimaConexionSchema>;

export const CamaraAlarmaSchema = z.object({
  idCamara: z.string().optional(),
  canal: z.string().optional(),
  particion: z.number().optional(),
  zona: z.number().optional(),
});
export type ICamaraAlarma = z.infer<typeof CamaraAlarmaSchema>;

export const ModoDesactivadoSchema = z.object({
  dispositivoDesactivado: z.boolean().optional(),
  permanente: z.boolean().optional(),
  desde: z.string().optional(),
  hasta: z.string().optional(),
  codigos: z.array(z.string()).optional(),
  alarma: z
    .object({
      particiones: z.array(z.string()).optional(),
      zonas: z
        .array(
          z.object({
            particion: z.string(),
            zona: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
});
export type IModoDesactivado = z.infer<typeof ModoDesactivadoSchema>;

export const SensorPorZonaSchema = z.object({
  marca: z.string().optional(),
  tipo: CodigoTipoSensorSchema.optional(),
  modelo: z.string().optional(),
  // UNICOM (sensores RF inalámbricos). El panel guarda por sensor el código RF
  // (3 bytes) + un atributo que codifica el modo de zona (attr = 0x10 + code).
  codigoRf: z.string().optional(), // 6 hex (3 bytes), ej. "AABBCC"
  modoRf: z.string().optional(), // modo de zona UNICOM "R###" (Interior, Entrada/Salida, Perimetral, ...)
  attrRf: z.number().optional(), // byte de atributo (0x10 + code del modo)
});
export type ISensorPorZona = z.infer<typeof SensorPorZonaSchema>;

export const ParticionZonaSchema = z.object({
  nombre: z.string().optional(),
  particion: z.number().optional(),
  zona: z.number().optional(),
  sensores: z.array(SensorPorZonaSchema).optional(),
  modo: ModoSensorSchema.optional(),
});
export type IParticionZona = z.infer<typeof ParticionZonaSchema>;

export const TipoControlHorarioSchema = z.enum(['Apertura', 'Cierre']);
export type ITipoControlHorario = z.infer<typeof TipoControlHorarioSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const ControlHorarioDetallesSchema = z.object({
  // abre los lunes a viernes  a las 8:30 con tolerancia de 30 minutos
  tipo: TipoControlHorarioSchema,
  dias: z.array(z.custom<Dia>()),
  hora: z.string(),
  toleranciaAntes: z.number(),
  toleranciaDespues: z.number(),
  particion: z.number(),
});
export type IControlHorarioDetalles = z.infer<
  typeof ControlHorarioDetallesSchema
>;

export const ControlHorarioSchema = z.object({
  activo: z.boolean().optional(),
  ignorarArmadosFueraDeHorario: z.boolean().optional(),
  ignorarDesarmadosFueraDeHorario: z.boolean().optional(),
  horarios: z.array(ControlHorarioDetallesSchema).optional(),
});
export type IControlHorario = z.infer<typeof ControlHorarioSchema>;

/// UNICOM "WiFi DUO" ──────────────────────────────────────────────
/// Comunicador WiFi (no SIM) que opera por MQTT contra el broker propio
/// de IRIX. Modos de armado del panel (selectivo = total excluyendo zonas).
export const ModoArmadoUnicomSchema = z.enum([
  'Total',
  'Perimetral',
  'Selectivo',
  'Desarmado',
]);
export type ModoArmadoUnicom = z.infer<typeof ModoArmadoUnicomSchema>;

export const EstadoArmadoUnicomSchema = z.object({
  modo: ModoArmadoUnicomSchema.optional(),
  zonasExcluidas: z.array(z.number()).optional(), // solo para 'Selectivo' (zonas excluidas del armado)
  actualizado: z.string().optional(), // fecha ISO del último cambio de estado conocido
});
export type IEstadoArmadoUnicom = z.infer<typeof EstadoArmadoUnicomSchema>;

/// Último estado de energía/panel del UNICOM, decodificado del bitmask `sts` que el equipo
/// reporta por MQTT. Lo persiste el gateway (gestion-api-alarmas) en el doc para que el resto
/// del sistema (p.ej. consultarEstado → indicadores batería/220V) lo lea sin depender del broker.
export const UltimoEstadoUnicomSchema = z.object({
  hay220v: z.boolean().optional(), // false = falta de energía (corte 220V)
  bateriaBaja: z.boolean().optional(),
  armadoTotal: z.boolean().optional(),
  perimetral: z.boolean().optional(),
  disparo: z.boolean().optional(),
  sirena: z.boolean().optional(),
  fecha: z.string().optional(), // ISO del último sts procesado
});
export type IUltimoEstadoUnicom = z.infer<typeof UltimoEstadoUnicomSchema>;

/// Config por dispositivo del comunicador UNICOM. La identidad es el devid
/// (= idUnicoComunicador, "uw"+MAC). El broker/credenciales son de flota y
/// viven a nivel backend (env), NO por dispositivo en DB. Los topics se
/// derivan del devid (cmd/<devid>, dev/uw/0001/<devid>).
export const ConfigComunicadorUnicomSchema = z.object({
  devid: z.string().optional(), // "uw"+MAC (redundante con idUnicoComunicador, por claridad)
  canal: z.string().optional(), // "chan" del firmware (ej. "dev")
  topicCmd: z.string().optional(), // override opcional del topic de comandos
  topicDev: z.string().optional(), // override opcional del topic de eventos
  tls: z.boolean().optional(), // reservado: hoy plaintext, TLS es mejora futura
});
export type IConfigComunicadorUnicom = z.infer<
  typeof ConfigComunicadorUnicomSchema
>;

export const DispositivoAlarmaSchema = z.object({
  _id: z.string().optional(),
  //
  fechaCreacion: z.string().optional(),
  fechaAlta: z.string().optional(),
  fechaUltimaComunicacion: z.string().optional(),
  idComunicador: z.string().optional(),
  idUnicoComunicador: z.string().optional(),
  passwordComunicador: z.string().optional(),
  idModelo: z.string().optional(),
  idDomicilio: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  nombre: z.string().optional(),
  numeroAbonado: z.string().optional(),
  sim1: SimSchema.optional(),
  sim2: SimSchema.optional(),
  idsClientesQuePuedenAtender: z.array(z.string()).optional(),
  idsClientesQuePuedenAtenderEventosTecnicos: z.array(z.string()).optional(),
  puedeSolicitarServicioTecnico: z.boolean().optional(),
  configHorariosAtencion: z.array(ConfigHorarioSchema).optional(),
  configHorariosAtencionTecnica: z.array(ConfigHorarioSchema).optional(),
  camarasPorZona: z.array(CamaraAlarmaSchema).optional(),
  idsCamaras: z.array(z.string()).optional(),
  armado: z.array(z.boolean()).optional(),
  armadoPor: z.array(z.union([z.string(), z.null()])).optional(),
  // UNICOM: estado de armado con semántica propia (total/perimetral/selectivo).
  // Additive — NO reemplaza `armado`/`TiposDeArmado` (uso productivo de otras alarmas).
  estadoArmadoUnicom: EstadoArmadoUnicomSchema.optional(),
  configUnicom: ConfigComunicadorUnicomSchema.optional(),
  // UNICOM: último estado de energía/panel decodificado del `sts` (persistido por el gateway).
  ultimoEstadoUnicom: UltimoEstadoUnicomSchema.optional(),
  imagenes: z.array(z.string()).optional(),
  ultimaConexion: UltimaConexionSchema.optional(),
  modoDesactivado: ModoDesactivadoSchema.optional(),
  infoZonas: z.array(ParticionZonaSchema).optional(),
  controlHorario: ControlHorarioSchema.optional(),
  //
  nroDeSistema: z.string().optional(),
  //
  estadoCuenta: z.custom<estadoCuenta>().optional(),
  frecReporte: z.number().optional(),
  idServiciosContratados: z.array(z.string()).optional(),
  clave: z.string().optional(),
  contraClave: z.string().optional(),
  // undefined = usar credenciales del cliente (config.credencialesAlarmas)
  credencialesAlarma: CredencialesAlarmaSchema.optional(),
  tipoComercio: z.string().optional(),
  tipoCategoria: z.string().optional(),
  // Populate
  domicilio: z.custom<IUbicacion>().optional(),
  modelo: ModeloDispositivoSchema.optional(),
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  comunicador: ModeloDispositivoSchema.optional(),
  camaras: z.array(CamaraSchema).optional(),
  serviciosContratados: z.array(ServicioContratadoSchema).optional(),
});
/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IDispositivoAlarma {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaAlta?: string;
  fechaUltimaComunicacion?: string;
  idComunicador?: string;
  idUnicoComunicador?: string;
  passwordComunicador?: string;
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  idsAncestros?: string[];
  nombre?: string;
  numeroAbonado?: string;
  sim1?: ISim;
  sim2?: ISim;
  idsClientesQuePuedenAtender?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  puedeSolicitarServicioTecnico?: boolean;
  configHorariosAtencion?: IConfigHorario[];
  configHorariosAtencionTecnica?: IConfigHorario[];
  camarasPorZona?: ICamaraAlarma[];
  idsCamaras?: string[];
  armado?: boolean[];
  armadoPor?: (string | null)[];
  // UNICOM: estado de armado con semántica propia (total/perimetral/selectivo).
  // Additive — NO reemplaza `armado`/`TiposDeArmado` (uso productivo de otras alarmas).
  estadoArmadoUnicom?: IEstadoArmadoUnicom;
  configUnicom?: IConfigComunicadorUnicom;
  // UNICOM: último estado de energía/panel decodificado del `sts` (persistido por el gateway).
  ultimoEstadoUnicom?: IUltimoEstadoUnicom;
  imagenes?: string[];
  ultimaConexion?: IUltimaConexion;
  modoDesactivado?: IModoDesactivado;
  infoZonas?: IParticionZona[];
  controlHorario?: IControlHorario;
  //
  nroDeSistema?: string;
  //
  estadoCuenta?: estadoCuenta;
  frecReporte?: number;
  idServiciosContratados?: string[];
  clave?: string;
  contraClave?: string;
  // undefined = usar credenciales del cliente (config.credencialesAlarmas)
  credencialesAlarma?: ICredencialesAlarma;
  tipoComercio?: string;
  tipoCategoria?: string;
  // Populate
  domicilio?: IUbicacion;
  modelo?: IModeloDispositivo;
  cliente?: ICliente;
  ancestros?: ICliente[];
  comunicador?: IModeloDispositivo;
  camaras?: ICamara[];
  serviciosContratados?: IServicioContratado[];
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'modelo'
  | 'domicilio'
  | 'comunicador '
  | 'camaras'
  | 'serviciosContratados';

export const CreateDispositivoAlarmaSchema = DispositivoAlarmaSchema.omit({
  _id: true,
  cliente: true,
  modelo: true,
  domicilio: true,
  comunicador: true, // fix: el original tenía 'comunicador ' con espacio, que no omitía nada
  camaras: true,
  serviciosContratados: true,
});
export interface ICreateDispositivoAlarma extends Omit<
  Partial<IDispositivoAlarma>,
  OmitirCreate
> {}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'modelo'
  | 'domicilio'
  | 'comunicador'
  | 'camaras'
  | 'serviciosContratados';

export const UpdateDispositivoAlarmaSchema = DispositivoAlarmaSchema.omit({
  _id: true,
  cliente: true,
  modelo: true,
  domicilio: true,
  comunicador: true,
  camaras: true,
  serviciosContratados: true,
});
export interface IUpdateDispositivoAlarma extends Omit<
  Partial<IDispositivoAlarma>,
  OmitirUpdate
> {}

export const DispositivoAlarmaCacheSchema = DispositivoAlarmaSchema.omit({
  domicilio: true,
  modelo: true,
  cliente: true,
  ancestros: true,
  comunicador: true,
  camaras: true,
  serviciosContratados: true,
});
export interface IDispositivoAlarmaCache extends Omit<
  IDispositivoAlarma,
  | 'domicilio'
  | 'modelo'
  | 'cliente'
  | 'ancestros'
  | 'comunicador'
  | 'camaras'
  | 'serviciosContratados'
> {}
///////
/////// Cosas de las apis de garnet dahua y eso
//////
/////
export const ConfigAlarmaHSISchema = z.object({
  id: z.string(),
  lastEventReport: z.string(),
  cameraLink: z.object({
    appName: z.string(),
    appPackage: z.string(),
    appStoreUrl: z.string(),
    appPlayStoreUri: z.string(),
    appBundleId: z.string(),
  }),
  userPermissions: z.object({
    atributos: z.object({
      puedeArmar: z.boolean(),
      puedeDesarmar: z.boolean(),
      puedeInhibirZonas: z.boolean(),
      puedeInteractuarConSalidas: z.boolean(),
      puedeInteractuarConSirena: z.boolean(),
      puedeVerCamaras: z.boolean(),
      sharedPartitions: z.record(z.string(), z.boolean()),
    }),
    configuraciones: z.object({
      users: z.boolean(),
      automations: z.boolean(),
      timeZone: z.boolean(),
    }),
    eventos: z.object({
      recibeAlarmas: z.boolean(),
      recibeAperturasYCierres: z.boolean(),
      recibeEventosDeEnergia: z.boolean(),
      recibeEventosDePanico: z.boolean(),
      recibeOtrosEventos: z.boolean(),
      sharedPartitions: z.record(z.string(), z.boolean()),
    }),
    userType: z.number(),
  }),
  subscriptionInfo: z.object({
    planType: z.number(),
    status: z.number(),
    freeUsers: z.array(z.any()),
    freeCards: z.array(z.any()),
    orders: z.array(z.any()),
    planId: z.string(),
    validThru: z.string(),
  }),
  owner: z.object({
    configuraciones: z.object({
      users: z.boolean(),
      automations: z.boolean(),
      timeZone: z.boolean(),
    }),
    atributos: z.object({
      puedeArmar: z.boolean(),
      puedeDesarmar: z.boolean(),
      puedeInhibirZonas: z.boolean(),
      puedeInteractuarConSalidas: z.boolean(),
      puedeInteractuarConSirena: z.boolean(),
      puedeVerCamaras: z.boolean(),
      sharedPartitions: z.record(z.string(), z.boolean()),
    }),
    eventos: z.object({
      recibeAlarmas: z.boolean(),
      recibeAperturasYCierres: z.boolean(),
      recibeEventosDeEnergia: z.boolean(),
      recibeEventosDePanico: z.boolean(),
      recibeOtrosEventos: z.boolean(),
      sharedPartitions: z.record(z.string(), z.boolean()),
    }),
    email: z.string(),
    nombre: z.string(),
    apellido: z.string(),
    avatar: z.number(),
    verified: z.boolean(),
    location: z.boolean(),
    userType: z.number(),
    number: z.number(),
  }),
  users: z.array(
    z.object({
      configuraciones: z.object({
        users: z.boolean(),
        automations: z.boolean(),
        timeZone: z.boolean(),
      }),
      atributos: z.object({
        puedeArmar: z.boolean(),
        puedeDesarmar: z.boolean(),
        puedeInhibirZonas: z.boolean(),
        puedeInteractuarConSalidas: z.boolean(),
        puedeInteractuarConSirena: z.boolean(),
        puedeVerCamaras: z.boolean(),
        sharedPartitions: z.record(z.string(), z.boolean()),
      }),
      eventos: z.object({
        recibeAlarmas: z.boolean(),
        recibeAperturasYCierres: z.boolean(),
        recibeEventosDeEnergia: z.boolean(),
        recibeEventosDePanico: z.boolean(),
        recibeOtrosEventos: z.boolean(),
        sharedPartitions: z.record(z.string(), z.boolean()),
      }),
      email: z.string(),
      nombre: z.string(),
      apellido: z.string(),
      avatar: z.number(),
      verified: z.boolean(),
      location: z.boolean(),
      userType: z.number(),
      number: z.number(),
    }),
  ),
  timeZone: z.string(),
  programation: z.object({
    lastEvent: z.string(),
    data: z.object({
      extraProgrammation: z.object({
        modulesEnabled: z.string(),
        reportsOne: z.string(),
        reportsTwo: z.string(),
        reportsThree: z.string(),
        stageOne: z.string(),
        stageTwo: z.string(),
      }),
      alarmPanel: z.object({
        brand: z.number(),
        isNewVersion: z.boolean(),
        model: z.number(),
        modelName: z.string(),
        version: z.number(),
        versionName: z.string(),
        isYoMonitoreo: z.boolean(),
      }),
      zones: z.array(
        z.object({
          number: z.number(),
          name: z.string(),
          icon: z.string(),
          associatedCamera: z.number(),
          configuration: z.string(),
          attributes: z.string(),
          enabled: z.boolean(),
          isPresentZone: z.boolean(),
        }),
      ),
      outputs: z.array(
        z.object({
          number: z.number(),
          name: z.string(),
          icon: z.string(),
          configuration: z.string(),
          enabled: z.boolean(),
        }),
      ),
      automations: z.array(
        z.object({
          number: z.number(),
          hours: z.number(),
          minutes: z.number(),
          action: z.number(),
          option: z.number(),
          enabled: z.boolean(),
          days: z.array(z.boolean()),
        }),
      ),
      partitions: z.array(
        z.object({
          name: z.string(),
          number: z.number(),
          enabled: z.boolean(),
        }),
      ),
    }),
    lastUpdate: z.string(),
  }),
  programmers: z.array(z.any()),
  nombre: z.string(),
  icono: z.number(),
});
export type IConfigAlarmaHSI = z.infer<typeof ConfigAlarmaHSISchema>;

export const StatusAlarmaGarnetSchema = z.object({
  particion: z.number().optional(),
  problemas1: z
    .object({
      falloSalidaSirena: z.boolean().optional(),
      falloLineaTelefonica: z.boolean().optional(),
      falloAlimentacionAuxiliarPanel: z.boolean().optional(),
      falloAlimentacionAuxiliarDatos: z.boolean().optional(),
      falloEnSupSirena: z.boolean().optional(),
      fuenteAuxiliarBateriaBaja: z.boolean().optional(),
      bateriaBaja: z.boolean().optional(),
      falloDeRed: z.boolean().optional(),
    })
    .optional(),
  problemas2: z
    .object({
      relojNoProgramado: z.boolean().optional(),
      falloLinkInternet: z.boolean().optional(),
      falloLinkGPRS: z.boolean().optional(),
      falloComInternet: z.boolean().optional(),
      falloComSMS: z.boolean().optional(),
      falloComGPRS: z.boolean().optional(),
      falloComTelefono2: z.boolean().optional(),
      falloComTelefono1: z.boolean().optional(),
    })
    .optional(),
  estadosParticiones: z
    .object({
      part4Armada: z.boolean().optional(),
      part3Armada: z.boolean().optional(),
      part2Armada: z.boolean().optional(),
      part1Armada: z.boolean().optional(),
      part4ListaParaArmar: z.boolean().optional(),
      part3ListaParaArmar: z.boolean().optional(),
      part2ListaParaArmar: z.boolean().optional(),
      part1ListaParaArmar: z.boolean().optional(),
    })
    .optional(),
  estadosSalidas: z
    .object({
      pgm4Activada: z.boolean().optional(),
      pgm3Activada: z.boolean().optional(),
      pgm2Activada: z.boolean().optional(),
      pgm1Activada: z.boolean().optional(),
      sirenaActivada: z.boolean().optional(),
    })
    .optional(),
  estadosAlarmas: z
    .object({
      alarma1Activada: z.boolean().optional(),
      alarma2Activada: z.boolean().optional(),
      alarma3Activada: z.boolean().optional(),
      alarma4Activada: z.boolean().optional(),
    })
    .optional(),
  zonasAbiertas: z
    .object({
      zona1Abierta: z.boolean().optional(),
      zona2Abierta: z.boolean().optional(),
      zona3Abierta: z.boolean().optional(),
      zona4Abierta: z.boolean().optional(),
      zona5Abierta: z.boolean().optional(),
      zona6Abierta: z.boolean().optional(),
      zona7Abierta: z.boolean().optional(),
      zona8Abierta: z.boolean().optional(),
      zona9Abierta: z.boolean().optional(),
      zona10Abierta: z.boolean().optional(),
      zona11Abierta: z.boolean().optional(),
      zona12Abierta: z.boolean().optional(),
      zona13Abierta: z.boolean().optional(),
      zona14Abierta: z.boolean().optional(),
      zona15Abierta: z.boolean().optional(),
      zona16Abierta: z.boolean().optional(),
      zona17Abierta: z.boolean().optional(),
      zona18Abierta: z.boolean().optional(),
      zona19Abierta: z.boolean().optional(),
      zona20Abierta: z.boolean().optional(),
      zona21Abierta: z.boolean().optional(),
      zona22Abierta: z.boolean().optional(),
      zona23Abierta: z.boolean().optional(),
      zona24Abierta: z.boolean().optional(),
      zona25Abierta: z.boolean().optional(),
      zona26Abierta: z.boolean().optional(),
      zona27Abierta: z.boolean().optional(),
      zona28Abierta: z.boolean().optional(),
      zona29Abierta: z.boolean().optional(),
      zona30Abierta: z.boolean().optional(),
      zona31Abierta: z.boolean().optional(),
      zona32Abierta: z.boolean().optional(),
    })
    .optional(),
  zonasAlarma: z
    .object({
      zona1Alarma: z.boolean().optional(),
      zona2Alarma: z.boolean().optional(),
      zona3Alarma: z.boolean().optional(),
      zona4Alarma: z.boolean().optional(),
      zona5Alarma: z.boolean().optional(),
      zona6Alarma: z.boolean().optional(),
      zona7Alarma: z.boolean().optional(),
      zona8Alarma: z.boolean().optional(),
      zona9Alarma: z.boolean().optional(),
      zona10Alarma: z.boolean().optional(),
      zona11Alarma: z.boolean().optional(),
      zona12Alarma: z.boolean().optional(),
      zona13Alarma: z.boolean().optional(),
      zona14Alarma: z.boolean().optional(),
      zona15Alarma: z.boolean().optional(),
      zona16Alarma: z.boolean().optional(),
      zona17Alarma: z.boolean().optional(),
      zona18Alarma: z.boolean().optional(),
      zona19Alarma: z.boolean().optional(),
      zona20Alarma: z.boolean().optional(),
      zona21Alarma: z.boolean().optional(),
      zona22Alarma: z.boolean().optional(),
      zona23Alarma: z.boolean().optional(),
      zona24Alarma: z.boolean().optional(),
      zona25Alarma: z.boolean().optional(),
      zona26Alarma: z.boolean().optional(),
      zona27Alarma: z.boolean().optional(),
      zona28Alarma: z.boolean().optional(),
      zona29Alarma: z.boolean().optional(),
      zona30Alarma: z.boolean().optional(),
      zona31Alarma: z.boolean().optional(),
      zona32Alarma: z.boolean().optional(),
    })
    .optional(),
  zonasInhibidas: z
    .object({
      zona1: z.boolean().optional(),
      zona2: z.boolean().optional(),
      zona3: z.boolean().optional(),
      zona4: z.boolean().optional(),
      zona5: z.boolean().optional(),
      zona6: z.boolean().optional(),
      zona7: z.boolean().optional(),
      zona8: z.boolean().optional(),
      zona9: z.boolean().optional(),
      zona10: z.boolean().optional(),
      zona11: z.boolean().optional(),
      zona12: z.boolean().optional(),
      zona13: z.boolean().optional(),
      zona14: z.boolean().optional(),
      zona15: z.boolean().optional(),
      zona16: z.boolean().optional(),
      zona17: z.boolean().optional(),
      zona18: z.boolean().optional(),
      zona19: z.boolean().optional(),
      zona20: z.boolean().optional(),
      zona21: z.boolean().optional(),
      zona22: z.boolean().optional(),
      zona23: z.boolean().optional(),
      zona24: z.boolean().optional(),
      zona25: z.boolean().optional(),
      zona26: z.boolean().optional(),
      zona27: z.boolean().optional(),
      zona28: z.boolean().optional(),
      zona29: z.boolean().optional(),
      zona30: z.boolean().optional(),
      zona31: z.boolean().optional(),
      zona32: z.boolean().optional(),
    })
    .optional(),
  estadosSalidasInalambricas: z
    .object({
      PGMW1: z.boolean().optional(),
      PGMW2: z.boolean().optional(),
      PGMW3: z.boolean().optional(),
      PGMW4: z.boolean().optional(),
    })
    .optional(),
  estadoPanel2: z
    .object({
      armadoPresenteDemoradoPart1: z.boolean().optional(),
      armadoPresenteDemoradoPart2: z.boolean().optional(),
      armadoPresenteDemoradoPart3: z.boolean().optional(),
      armadoPresenteDemoradoPart4: z.boolean().optional(),
      armadoPresenteInstantaneoPart1: z.boolean().optional(),
      armadoPresenteInstantaneoPart2: z.boolean().optional(),
      armadoPresenteInstantaneoPart3: z.boolean().optional(),
      armadoPresenteInstantaneoPart4: z.boolean().optional(),
    })
    .optional(),
  registroDeDemoras: z
    .object({
      demoraPart1: z.boolean().optional(),
      demoraPart2: z.boolean().optional(),
      demoraPart3: z.boolean().optional(),
      demoraPart4: z.boolean().optional(),
    })
    .optional(),
});
export type IStatusAlarmaGarnet = z.infer<typeof StatusAlarmaGarnetSchema>;

export const ArmOptionsSchema = z.object({
  profile: z.string(),
  triggerId: z.string(),
  triggerName: z.string(),
});
export type ArmOptions = z.infer<typeof ArmOptionsSchema>;

export const ArmModeRequestSchema = z.object({
  deviceId: z.string(),
  devCode: z.string(),
  armMode: TiposDeArmadoSchema,
  areaIds: z.array(z.number()),
  armOptions: ArmOptionsSchema,
});
export type IArmModeRequest = z.infer<typeof ArmModeRequestSchema>;

export const DolynkAuthResSchema = z.object({
  appAccessToken: z.string().optional(),
});
export type dolynkAuthRes = z.infer<typeof DolynkAuthResSchema>;

export const DolynkAlarmUserSchema = z.object({
  userId: z.string(), // ejemplo: "42950568110"
  userType: z.string(), // ejemplo: "Keypad"
  group: z.string(), // ejemplo: "Admin"
  name: z.string(), // ejemplo: "admin"
  userCode: z.string(), // puede estar vacío
  duressCode: z.string(), // puede estar vacío
  authorities: z.array(z.string()), // lista de permisos/autoridades
  cards: z.array(z.string()), // UID(s) de tarjetas
  reserved: z.boolean(),
  status: z.string(),
  accessAllowTime: z.string().nullable(), // fecha/hora en ISO o null si no aplica
  areaIds: z.array(z.number()), // ids de áreas permitidas
  memo: z.string().nullable(), // nota opcional
  oneClickArming: z.boolean().nullable(), // modo de armado rápido (o null si no definido)
});
export type dolynkAlarmUser = z.infer<typeof DolynkAlarmUserSchema>;

export const AccessoryInfoSchema = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
  deviceId: z.string().optional(),
});
export type AccessoryInfo = z.infer<typeof AccessoryInfoSchema>;

export const AreaInfoSchema = z.object({
  enable: z.boolean().optional(),
  name: z.string().optional(),
  accessoryInfos: z.array(AccessoryInfoSchema).optional(),
});
export type AreaInfo = z.infer<typeof AreaInfoSchema>;

export const ResponseInformationDataSchema = z.object({
  areaInfos: z.array(AreaInfoSchema).optional(),
});
export type ResponseInformationData = z.infer<
  typeof ResponseInformationDataSchema
>;

export const RespuestaDoLynkSchema = z.object({
  code: z.string().optional(),
  data: z
    .union([
      DolynkAuthResSchema,
      z.array(DolynkAlarmUserSchema),
      ResponseInformationDataSchema,
    ])
    .optional(),
  msg: z.string().optional(),
  success: z.boolean().optional(),
});
export type respuestaDoLynk = z.infer<typeof RespuestaDoLynkSchema>;

export const ArmModesSchema = z.object({
  areaId: z.number(),
  mode: TiposDeArmadoSchema,
});
export type armModes = z.infer<typeof ArmModesSchema>;

// Nota: el original tenía `AccessoryInfo` y `accessoryInfo` (solo difieren en
// mayúscula inicial). El schema de `accessoryInfo` se llama
// AccessoryInfoItemSchema para no colisionar con AccessoryInfoSchema.
export const AccessoryInfoItemSchema = z.object({
  deviceId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  model: z.string().optional(),
  areaId: z.number().optional(),
  bypassMode: z.enum(['Active', 'DisableTamper', 'Bypassed']).optional(),
  mode: TiposDeArmadoSchema.optional(),
});
export type accessoryInfo = z.infer<typeof AccessoryInfoItemSchema>;

export const ResponseStateDataSchema = z.object({
  armModes: z.array(ArmModesSchema).optional(),
});
export type ResponseStateData = z.infer<typeof ResponseStateDataSchema>;

export const ResponseAccessoryInfosSchema = z.object({
  accessoryInfos: z.array(AccessoryInfoItemSchema).optional(),
});
export type ResponseAccessoryInfos = z.infer<
  typeof ResponseAccessoryInfosSchema
>;

/// hikvision ( esta hecho para que coincida con la api de mierda que tienen )

export const EstadoArmadoHikvisionSchema = z.enum(['disarm', 'away', 'stay']);
export type EstadoArmadoHikvision = z.infer<typeof EstadoArmadoHikvisionSchema>;

export const SubSysHikvisionSchema = z.object({
  id: z.number().optional(),
  arming: EstadoArmadoHikvisionSchema.optional(),
  alarm: z.boolean().optional(),
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  delayTime: z.number().optional(),
});
export type ISubSysHikvision = z.infer<typeof SubSysHikvisionSchema>;

export const SubSysItemHikvisionSchema = z.object({
  SubSys: SubSysHikvisionSchema.optional(),
});
export type ISubSysItemHikvision = z.infer<typeof SubSysItemHikvisionSchema>;

export const StatusAlarmaHikvisionSchema = z.object({
  SubSysList: z.array(SubSysItemHikvisionSchema).optional(),
});
export type IStatusAlarmaHikvision = z.infer<
  typeof StatusAlarmaHikvisionSchema
>;

export const EstadoZonaHikvisionSchema = z.enum(['online', 'offline']);
export type EstadoZonaHikvision = z.infer<typeof EstadoZonaHikvisionSchema>;

export const EstadoSensorHikvisionSchema = z.literal('normal');
export type EstadoSensorHikvision = z.infer<typeof EstadoSensorHikvisionSchema>;

export const CargaZonaHikvisionSchema = z.literal('normal');
export type CargaZonaHikvision = z.infer<typeof CargaZonaHikvisionSchema>;

export const TipoDetectorHikvisionSchema = z.literal(
  'passiveInfraredDetector',
);
export type TipoDetectorHikvision = z.infer<typeof TipoDetectorHikvisionSchema>;

export const TipoZonaHikvisionSchema = z.literal('Instant');
export type TipoZonaHikvision = z.infer<typeof TipoZonaHikvisionSchema>;

export const AtributoZonaHikvisionSchema = z.literal('wireless');
export type AtributoZonaHikvision = z.infer<typeof AtributoZonaHikvisionSchema>;

export const ZoneHikvisionSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  status: EstadoZonaHikvisionSchema.optional(),
  sensorStatus: EstadoSensorHikvisionSchema.optional(),
  tamperEvident: z.boolean().optional(),
  shielded: z.boolean().optional(),
  bypassed: z.boolean().optional(),
  armed: z.boolean().optional(),
  isArming: z.boolean().optional(),
  alarm: z.boolean().optional(),
  charge: CargaZonaHikvisionSchema.optional(),
  chargeValue: z.number().optional(),
  signal: z.number().optional(),
  realSignal: z.number().optional(),
  signalType: z.string().optional(),
  temperature: z.number().optional(),
  subSystemNo: z.number().optional(),
  linkageSubSystem: z.array(z.number()).optional(),
  detectorType: TipoDetectorHikvisionSchema.optional(),
  model: z.string().optional(),
  stayAway: z.boolean().optional(),
  zoneType: TipoZonaHikvisionSchema.optional(),
  isViaRepeater: z.boolean().optional(),
  zoneAttrib: AtributoZonaHikvisionSchema.optional(),
  version: z.string().optional(),
  deviceNo: z.number().optional(),
  abnormalOrNot: z.boolean().optional(),
});
export type IZoneHikvision = z.infer<typeof ZoneHikvisionSchema>;

export const ZoneItemHikvisionSchema = z.object({
  Zone: ZoneHikvisionSchema.optional(),
});
export type IZoneItemHikvision = z.infer<typeof ZoneItemHikvisionSchema>;

export const ZoneListHikvisionSchema = z.object({
  ZoneList: z.array(ZoneItemHikvisionSchema).optional(),
});
export type IZoneListHikvision = z.infer<typeof ZoneListHikvisionSchema>;

export const ResponseHikvisionSchema = z.object({
  statusCode: z.number().optional(),
  statusString: z.string().optional(),
  subStatusCode: z.string().optional(),
  errorCode: z.number().optional(),
  errorMsg: z.string().optional(),
});
export type IResponseHikvision = z.infer<typeof ResponseHikvisionSchema>;
