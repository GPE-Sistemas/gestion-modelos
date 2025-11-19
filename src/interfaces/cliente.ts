export interface IImagenesCliente {
  icono?: string;
  banner?: string;
  bannerModoOscuro?: string;
}

export interface ITemaCliente {
  primaryColor?: string;
  accentColor?: string;
  warnColor?: string;
  backgroundColor?: string;
  typography?: string;
}

export interface ICredencialesAlarma {
  tipo?: 'Garnet Titanium';
  usuario?: string;
  password?: string;
}

export interface IConfigCliente {
  imagenes?: IImagenesCliente;
  tema?: ITemaCliente;
  moduloColectivos?: IModuloColectivos;
  moduloAlarmasDomiciliarias?: IModuloAlarmasDomiciliarias;
  moduloDispositivosLorawan?: IModuloDispositivosLorawan;
  moduloActivos?: IModuloActivos;
  moduloAdministracion?: IModuloAdministracion;
  moduloEventosTecnicos?: IModuloEventosTecnicos;
  moduloVehiculos?: IModuloVehiculos;
  moduloLuminarias?: IModuloLuminarias;
  moduloEmergencias?: IModuloEmergencias;
  moduloBotonBLE?: IModuloBotonBLE;
  modulosIntegraciones?: IModulosIntegraciones;
  moduloLogs?: IModuloLogs;
  moduloTwilio?: IModuloTwilio;
  moduloSendgrid?: IModuloSendgrid;
  moduloSirenas?: IModuloSirenas;
  idsClientesQuePuedenAtenderEventos?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  solicitantesEmergencias?: string[];
  solicitantePredeterminado?: string;
  credencialesAlarmas?: ICredencialesAlarma[];
}

/// Twilio

export type TemplatesWhatsapp =
  | 'Error de comunicación de alarma'
  | 'Equipos fuera de línea'
  | 'Batería baja';

export type TemplatesMail =
  | TemplatesWhatsapp
  | 'Nuevo usuario'
  | 'Reset de contraseña'
  | 'Cambio de contraseña';

export interface IModuloTwilio {
  activo?: boolean;
  accSid?: string;
  authToken?: string;
  msgServiceSid?: string;
  statusCallback?: string;
  phoneSms?: string;
  phoneWhatsapp?: string;
  phoneLlamada?: string;
  templatesWhatsapp?: {
    [K in TemplatesWhatsapp]?: string;
  };
}

export interface IModuloSendgrid {
  activo?: boolean;
  senderEmail?: string;
  senderName?: string;
  senderAddress?: string;
  senderCity?: string;
  senderState?: string;
  senderZip?: number;
  sendGridApiKey?: string;
  templatesMail?: {
    [K in TemplatesMail]?: string;
  };
}

export type ITipoCliente = 'Mayorista' | 'Minorista' | 'Final';

export type EstadoCuenta = 'Activo' | 'Suspendido' | 'Moroso';
export interface IModulosIntegraciones {
  activo?: boolean;
  moduloBotonDePanico?: IModuloBotonDePanico;
}

export interface IModuloBotonDePanico {
  appkey?: string;
  activo?: boolean;
}

export interface IModuloBotonBLE {
  activo?: boolean;
}

export interface IModuloSirenas {
  activo?: boolean;
  crearSirenas?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirSirenas?: boolean;
}

export interface IModuloLuminarias {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirLuminarias?: boolean;
}

export interface IModuloEmergencias {
  activoEmergenciasMedicas?: boolean;
  crearEmergenciasMedicas?: boolean;
  activoEmergenciasBomberos?: boolean;
  crearEmergenciasBomberos?: boolean;
  //Acá pueden ir otros tipos de emergencias...
}

export interface IModuloColectivos {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirFlota?: boolean;
}

export interface IModuloAlarmasDomiciliarias {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirAlarmas?: boolean;
}

export interface IModuloDispositivosLorawan {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirDispositivosLorawan?: boolean;
}

export interface IModuloActivos {
  activo?: boolean;
  crearDispositivos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirActivos?: boolean;
}

export interface IModuloAdministracion {
  activo?: boolean;
  crearUsuarios?: boolean;
  crearServicios?: boolean;
  crearApikeys?: boolean;

  //Trackers
  activoTrackers?: boolean;
  crearTrackers?: boolean;
  //Botones BLE
  activoBotonesBLE?: boolean;
  crearBotonesBLE?: boolean;
  //Dispositivos Lorawam
  activoDispositivosLorawan?: boolean;
  crearDispositivosLorawan?: boolean;
  compartirDispositivosLorawan?: boolean; //Posiblemente esto no se use más
}

export interface IModuloVehiculos {
  activo?: boolean;
  crearVehiculos?: boolean;
  derivarEventos?: boolean;
  derivarEventosTecnicos?: boolean;
  compartirVehiculos?: boolean;
}

export interface IModuloEventosTecnicos {
  activo?: boolean;
}

export interface IModuloLogs {
  activo?: boolean;
}

export interface ILayerMapaPersonalizado {
  nombre?: string;
  url?: string;
  icono?: string;
}

export interface ICliente {
  _id?: string;
  idsAncestros?: string[];
  idPadre?: string;
  activo?: boolean;
  nombre?: string;
  fechaCreacion?: string;
  nivel?: number;
  config?: IConfigCliente;
  tipoCliente?: ITipoCliente;
  estadoDeCuenta?: EstadoCuenta;
  numeroCliente?: string;
  habilitado?: boolean;
  apikeyBotonBLE?: string;
  poligono?: {
    type: 'MultiPolygon';
    coordinates: [number, number][][][];
  };
  mapLayers?: ILayerMapaPersonalizado[]; //Capas de mapa personalizadas
  // Populate
  padre?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'padre';

export interface ICreateCliente extends Omit<Partial<ICliente>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'nivel' | 'tipoCliente' | 'fechaCreacion' | 'padre';

export interface IUpdateCliente extends Omit<Partial<ICliente>, OmitirUpdate> {}
