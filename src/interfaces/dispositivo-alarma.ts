import { ICamara } from './camara';
import { ICliente } from './cliente';
import { Dia } from './config-evento-usuario';
import { estadoCuenta } from './estado-entidad';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IServicioContratado } from './servicio-contratado';
import { IUbicacion } from './ubicacion';

/// Lepra ( interfaces para las respuestas de HSI )
export type TipoEmergenciaAlarma = 'Pánico' | 'Médica' | 'Incendio';
export type TiposDeArmado = 'T' | 'D' | 'p1';
/// T es away(ausente ) p1 (stay (casa) D es desarmado
////
export interface ISim {
  iccid?: string;
  numero?: string;
  operador?: Operador;
  apn?: string;
  usuario?: string;
  password?: string;
}

export interface IUltimaConexion {
  lastIp?: string;
  lastPort?: string;
  sequence: number;
}

export interface ICamaraAlarma {
  idCamara?: string;
  canal?: string;
  particion?: number;
  zona?: number;
}

export interface IModoDesactivado {
  dispositivoDesactivado?: boolean;
  permanente?: boolean;
  desde?: string;
  hasta?: string;
  codigos?: string[];
  alarma?: {
    particiones?: string[];
    zonas?: {
      particion: string;
      zona: string;
    }[];
  };
}

export interface IParticionZona {
  nombre?: string;
  particion?: number;
  zona?: number;
  marca?: string;
  tipo?: CodigoTipoSensor;
  modo?: ModoSensor;
}

export type ITipoControlHorario = 'Apertura' | 'Cierre';
export interface IControlHorarioDetalles {
  // abre los lunes a viernes  a las 8:30 con tolerancia de 30 minutos
  tipo: ITipoControlHorario;
  dias: Dia[];
  hora: string;
  toleranciaAntes: number;
  toleranciaDespues: number;
  particion: number;
}
export interface IControlHorario {
  activo?: boolean;
  ignorarArmadosFueraDeHorario?: boolean;
  ignorarDesarmadosFueraDeHorario?: boolean;
  horarios?: IControlHorarioDetalles[];
}

export type CodigoTipoSensor =
  | 'PIR'
  | 'DRV'
  | 'MMG'
  | 'BIR'
  | 'PAS'
  | 'PPC'
  | 'TAM'
  | 'OCR'
  | 'HUM'
  | 'PFU'
  | 'ELE'
  | 'BUM'
  | 'CEM'
  | 'VOL'
  | 'DTS'
  | 'SIS'
  | 'AMK';
export type ModoSensor = 'Seguidor' | 'Demorado' | 'Instantaneo';
export type Operador = 'Personal' | 'Claro' | 'Movistar' | 'Tuenti' | 'Otro';
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
  camarasPorZona?: ICamaraAlarma[];
  idsCamaras?: string[];
  armado?: boolean[];
  armando?: string;
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

export interface IUpdateDispositivoAlarma extends Omit<
  Partial<IDispositivoAlarma>,
  OmitirUpdate
> {}

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
export interface IConfigAlarmaHSI {
  id: string;
  lastEventReport: string;
  cameraLink: {
    appName: string;
    appPackage: string;
    appStoreUrl: string;
    appPlayStoreUri: string;
    appBundleId: string;
  };
  userPermissions: {
    atributos: {
      puedeArmar: boolean;
      puedeDesarmar: boolean;
      puedeInhibirZonas: boolean;
      puedeInteractuarConSalidas: boolean;
      puedeInteractuarConSirena: boolean;
      puedeVerCamaras: boolean;
      sharedPartitions: {
        [key: string]: boolean;
      };
    };
    configuraciones: {
      users: boolean;
      automations: boolean;
      timeZone: boolean;
    };
    eventos: {
      recibeAlarmas: boolean;
      recibeAperturasYCierres: boolean;
      recibeEventosDeEnergia: boolean;
      recibeEventosDePanico: boolean;
      recibeOtrosEventos: boolean;
      sharedPartitions: {
        [key: string]: boolean;
      };
    };
    userType: number;
  };
  subscriptionInfo: {
    planType: number;
    status: number;
    freeUsers: any[];
    freeCards: any[];
    orders: any[];
    planId: string;
    validThru: string;
  };
  owner: {
    configuraciones: {
      users: boolean;
      automations: boolean;
      timeZone: boolean;
    };
    atributos: {
      puedeArmar: boolean;
      puedeDesarmar: boolean;
      puedeInhibirZonas: boolean;
      puedeInteractuarConSalidas: boolean;
      puedeInteractuarConSirena: boolean;
      puedeVerCamaras: boolean;
      sharedPartitions: {
        [key: string]: boolean;
      };
    };
    eventos: {
      recibeAlarmas: boolean;
      recibeAperturasYCierres: boolean;
      recibeEventosDeEnergia: boolean;
      recibeEventosDePanico: boolean;
      recibeOtrosEventos: boolean;
      sharedPartitions: {
        [key: string]: boolean;
      };
    };
    email: string;
    nombre: string;
    apellido: string;
    avatar: number;
    verified: boolean;
    location: boolean;
    userType: number;
    number: number;
  };
  users: {
    configuraciones: {
      users: boolean;
      automations: boolean;
      timeZone: boolean;
    };
    atributos: {
      puedeArmar: boolean;
      puedeDesarmar: boolean;
      puedeInhibirZonas: boolean;
      puedeInteractuarConSalidas: boolean;
      puedeInteractuarConSirena: boolean;
      puedeVerCamaras: boolean;
      sharedPartitions: {
        [key: string]: boolean;
      };
    };
    eventos: {
      recibeAlarmas: boolean;
      recibeAperturasYCierres: boolean;
      recibeEventosDeEnergia: boolean;
      recibeEventosDePanico: boolean;
      recibeOtrosEventos: boolean;
      sharedPartitions: {
        [key: string]: boolean;
      };
    };
    email: string;
    nombre: string;
    apellido: string;
    avatar: number;
    verified: boolean;
    location: boolean;
    userType: number;
    number: number;
  }[];
  timeZone: string;
  programation: {
    lastEvent: string;
    data: {
      extraProgrammation: {
        modulesEnabled: string;
        reportsOne: string;
        reportsTwo: string;
        reportsThree: string;
        stageOne: string;
        stageTwo: string;
      };
      alarmPanel: {
        brand: number;
        isNewVersion: boolean;
        model: number;
        modelName: string;
        version: number;
        versionName: string;
        isYoMonitoreo: boolean;
      };
      zones: {
        number: number;
        name: string;
        icon: string;
        associatedCamera: number;
        configuration: string;
        attributes: string;
        enabled: boolean;
        isPresentZone: boolean;
      }[];
      outputs: {
        number: number;
        name: string;
        icon: string;
        configuration: string;
        enabled: boolean;
      }[];
      automations: {
        number: number;
        hours: number;
        minutes: number;
        action: number;
        option: number;
        enabled: boolean;
        days: boolean[];
      }[];
      partitions: {
        name: string;
        number: number;
        enabled: boolean;
      }[];
    };
    lastUpdate: string;
  };
  programmers: any[];
  nombre: string;
  icono: number;
}

export interface IStatusAlarmaGarnet {
  particion?: number;
  problemas1?: {
    falloSalidaSirena?: boolean;
    falloLineaTelefonica?: boolean;
    falloAlimentacionAuxiliarPanel?: boolean;
    falloAlimentacionAuxiliarDatos?: boolean;
    falloEnSupSirena?: boolean;
    fuenteAuxiliarBateriaBaja?: boolean;
    bateriaBaja?: boolean;
    falloDeRed?: boolean;
  };
  problemas2?: {
    relojNoProgramado?: boolean;
    falloLinkInternet?: boolean;
    falloLinkGPRS?: boolean;
    falloComInternet?: boolean;
    falloComSMS?: boolean;
    falloComGPRS?: boolean;
    falloComTelefono2?: boolean;
    falloComTelefono1?: boolean;
  };
  estadosParticiones?: {
    part4Armada?: boolean;
    part3Armada?: boolean;
    part2Armada?: boolean;
    part1Armada?: boolean;
    part4ListaParaArmar?: boolean;
    part3ListaParaArmar?: boolean;
    part2ListaParaArmar?: boolean;
    part1ListaParaArmar?: boolean;
  };
  estadosSalidas?: {
    pgm4Activada?: boolean;
    pgm3Activada?: boolean;
    pgm2Activada?: boolean;
    pgm1Activada?: boolean;
    sirenaActivada?: boolean;
  };
  estadosAlarmas?: {
    alarma1Activada?: boolean;
    alarma2Activada?: boolean;
    alarma3Activada?: boolean;
    alarma4Activada?: boolean;
  };
  zonasAbiertas?: {
    zona1Abierta?: boolean;
    zona2Abierta?: boolean;
    zona3Abierta?: boolean;
    zona4Abierta?: boolean;
    zona5Abierta?: boolean;
    zona6Abierta?: boolean;
    zona7Abierta?: boolean;
    zona8Abierta?: boolean;
    zona9Abierta?: boolean;
    zona10Abierta?: boolean;
    zona11Abierta?: boolean;
    zona12Abierta?: boolean;
    zona13Abierta?: boolean;
    zona14Abierta?: boolean;
    zona15Abierta?: boolean;
    zona16Abierta?: boolean;
    zona17Abierta?: boolean;
    zona18Abierta?: boolean;
    zona19Abierta?: boolean;
    zona20Abierta?: boolean;
    zona21Abierta?: boolean;
    zona22Abierta?: boolean;
    zona23Abierta?: boolean;
    zona24Abierta?: boolean;
    zona25Abierta?: boolean;
    zona26Abierta?: boolean;
    zona27Abierta?: boolean;
    zona28Abierta?: boolean;
    zona29Abierta?: boolean;
    zona30Abierta?: boolean;
    zona31Abierta?: boolean;
    zona32Abierta?: boolean;
  };
  zonasAlarma?: {
    zona1Alarma?: boolean;
    zona2Alarma?: boolean;
    zona3Alarma?: boolean;
    zona4Alarma?: boolean;
    zona5Alarma?: boolean;
    zona6Alarma?: boolean;
    zona7Alarma?: boolean;
    zona8Alarma?: boolean;
    zona9Alarma?: boolean;
    zona10Alarma?: boolean;
    zona11Alarma?: boolean;
    zona12Alarma?: boolean;
    zona13Alarma?: boolean;
    zona14Alarma?: boolean;
    zona15Alarma?: boolean;
    zona16Alarma?: boolean;
    zona17Alarma?: boolean;
    zona18Alarma?: boolean;
    zona19Alarma?: boolean;
    zona20Alarma?: boolean;
    zona21Alarma?: boolean;
    zona22Alarma?: boolean;
    zona23Alarma?: boolean;
    zona24Alarma?: boolean;
    zona25Alarma?: boolean;
    zona26Alarma?: boolean;
    zona27Alarma?: boolean;
    zona28Alarma?: boolean;
    zona29Alarma?: boolean;
    zona30Alarma?: boolean;
    zona31Alarma?: boolean;
    zona32Alarma?: boolean;
  };
  zonasInhibidas?: {
    zona1?: boolean;
    zona2?: boolean;
    zona3?: boolean;
    zona4?: boolean;
    zona5?: boolean;
    zona6?: boolean;
    zona7?: boolean;
    zona8?: boolean;
    zona9?: boolean;
    zona10?: boolean;
    zona11?: boolean;
    zona12?: boolean;
    zona13?: boolean;
    zona14?: boolean;
    zona15?: boolean;
    zona16?: boolean;
    zona17?: boolean;
    zona18?: boolean;
    zona19?: boolean;
    zona20?: boolean;
    zona21?: boolean;
    zona22?: boolean;
    zona23?: boolean;
    zona24?: boolean;
    zona25?: boolean;
    zona26?: boolean;
    zona27?: boolean;
    zona28?: boolean;
    zona29?: boolean;
    zona30?: boolean;
    zona31?: boolean;
    zona32?: boolean;
  };
  estadosSalidasInalambricas?: {
    PGMW1?: boolean;
    PGMW2?: boolean;
    PGMW3?: boolean;
    PGMW4?: boolean;
  };
  estadoPanel2?: {
    armadoPresenteDemoradoPart1?: boolean;
    armadoPresenteDemoradoPart2?: boolean;
    armadoPresenteDemoradoPart3?: boolean;
    armadoPresenteDemoradoPart4?: boolean;
    armadoPresenteInstantaneoPart1?: boolean;
    armadoPresenteInstantaneoPart2?: boolean;
    armadoPresenteInstantaneoPart3?: boolean;
    armadoPresenteInstantaneoPart4?: boolean;
  };
  registroDeDemoras?: {
    demoraPart1?: boolean;
    demoraPart2?: boolean;
    demoraPart3?: boolean;
    demoraPart4?: boolean;
  };
}

export interface ArmOptions {
  profile: string;
  triggerId: string;
  triggerName: string;
}

export interface IArmModeRequest {
  deviceId: string;
  devCode: string;
  armMode: TiposDeArmado;
  areaIds: number[];
  armOptions: ArmOptions;
}

export interface respuestaDoLynk {
  code?: string;
  data?: dolynkAuthRes | dolynkAlarmUser[] | ResponseInformationData;
  msg?: string;
  success?: boolean;
}

export interface dolynkAuthRes {
  appAccessToken?: string;
}

export interface dolynkAlarmUser {
  userId: string; // ejemplo: "42950568110"
  userType: string; // ejemplo: "Keypad"
  group: string; // ejemplo: "Admin"
  name: string; // ejemplo: "admin"
  userCode: string; // puede estar vacío
  duressCode: string; // puede estar vacío
  authorities: string[]; // lista de permisos/autoridades
  cards: string[]; // UID(s) de tarjetas
  reserved: boolean;
  status: string;
  accessAllowTime: string | null; // fecha/hora en ISO o null si no aplica
  areaIds: number[]; // ids de áreas permitidas
  memo: string | null; // nota opcional
  oneClickArming: boolean | null; // modo de armado rápido (o null si no definido)
}

export interface AccessoryInfo {
  name?: string;
  id?: string;
  deviceId?: string;
}

export interface AreaInfo {
  enable?: boolean;
  name?: string;
  accessoryInfos?: AccessoryInfo[];
}

export interface armModes {
  areaId: number;
  mode: TiposDeArmado;
}

export interface accessoryInfo {
  deviceId?: string;
  id?: string;
  name?: string;
  type?: string;
  model?: string;
  areaId?: number;
  bypassMode?: 'Active' | 'DisableTamper' | 'Bypassed';
  mode?: TiposDeArmado;
}

export interface ResponseInformationData {
  areaInfos?: AreaInfo[];
}

export interface ResponseStateData {
  armModes?: armModes[];
}

export interface ResponseAccessoryInfos {
  accessoryInfos?: accessoryInfo[];
}

/// hikvision ( esta hecho para que coincida con la api de mierda que tienen )

export type EstadoArmadoHikvision = 'disarm' | 'away' | 'stay';

export interface ISubSysHikvision {
  id?: number;
  arming?: EstadoArmadoHikvision;
  alarm?: boolean;
  enabled?: boolean;
  name?: string;
  delayTime?: number;
}

export interface ISubSysItemHikvision {
  SubSys?: ISubSysHikvision;
}

export interface IStatusAlarmaHikvision {
  SubSysList?: ISubSysItemHikvision[];
}

export type EstadoZonaHikvision = 'online' | 'offline';
export type EstadoSensorHikvision = 'normal';
export type CargaZonaHikvision = 'normal';
export type TipoDetectorHikvision = 'passiveInfraredDetector';
export type TipoZonaHikvision = 'Instant';
export type AtributoZonaHikvision = 'wireless';

export interface IZoneHikvision {
  id?: number;
  name?: string;
  status?: EstadoZonaHikvision;
  sensorStatus?: EstadoSensorHikvision;
  tamperEvident?: boolean;
  shielded?: boolean;
  bypassed?: boolean;
  armed?: boolean;
  isArming?: boolean;
  alarm?: boolean;
  charge?: CargaZonaHikvision;
  chargeValue?: number;
  signal?: number;
  realSignal?: number;
  signalType?: string;
  temperature?: number;
  subSystemNo?: number;
  linkageSubSystem?: number[];
  detectorType?: TipoDetectorHikvision;
  model?: string;
  stayAway?: boolean;
  zoneType?: TipoZonaHikvision;
  isViaRepeater?: boolean;
  zoneAttrib?: AtributoZonaHikvision;
  version?: string;
  deviceNo?: number;
  abnormalOrNot?: boolean;
}

export interface IZoneItemHikvision {
  Zone?: IZoneHikvision;
}

export interface IZoneListHikvision {
  ZoneList?: IZoneItemHikvision[];
}

export interface IResponseHikvision {
  statusCode?: number;
  statusString?: string;
  subStatusCode?: string;
  errorCode?: number;
  errorMsg?: string;
}
