import { z } from 'zod';
import { PuntoCoord } from '../auxiliares/geojson';

export const ConfigHorarioSchema = z.object({
  idCliente: z.string().optional(), // undefined = default del cliente
  dias: z.array(z.number()).optional(), // 0-6 (Dom-Sáb), undefined = todos los días
  horaInicio: z.string().optional(), // "HH:mm"
  horaFin: z.string().optional(), // "HH:mm"
});
export type IConfigHorario = z.infer<typeof ConfigHorarioSchema>;

export const ImagenesClienteSchema = z.object({
  icono: z.string().optional(),
  banner: z.string().optional(),
  bannerModoOscuro: z.string().optional(),
});
export type IImagenesCliente = z.infer<typeof ImagenesClienteSchema>;

export const TemaClienteSchema = z.object({
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  warnColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  typography: z.string().optional(),
});
export type ITemaCliente = z.infer<typeof TemaClienteSchema>;

export const CredencialesAlarmaSchema = z.object({
  tipo: z.enum(['Garnet Titanium', 'Garnet', 'Hikvision']).optional(),
  usuario: z.string().optional(),
  password: z.string().optional(),
  apikey: z.string().optional(),
  apisecret: z.string().optional(),
});
export type ICredencialesAlarma = z.infer<typeof CredencialesAlarmaSchema>;

export const IntegracionSoflexSchema = z.object({
  // Hace que se creen los trackers en Soflex (se llaman fleet)
  activo: z.boolean().optional(),
  fleetId: z.string().optional(),
  parentFleetId: z.string().optional(),
});
export type IIntegracionSoflex = z.infer<typeof IntegracionSoflexSchema>;

/** Control de inactividad de operadores (popup de confirmación de actividad
 *  en gestion-web-cliente). Aplica a usuarios con rol Operador. */
export const ControlInactividadSchema = z.object({
  /** Minutos sin actividad hasta mostrar el cartel de confirmación */
  limTiempoInactividad: z.number().optional(),
  /** Segundos que tiene el operador para confirmar que está activo */
  limTiempoConfirm: z.number().optional(),
});
export type IControlInactividad = z.infer<typeof ControlInactividadSchema>;

/** Control de actividad excesiva de operadores (banner informativo de descanso
 *  en gestion-web-cliente): al superar un tiempo de uso continuo se sugiere tomar un descanso. Aplica a
 *  usuarios con rol Operador. */
export const ControlActividadSchema = z.object({
  /** Minutos de uso hasta mostrar el banner de actividad excesiva */
  limTiempoActividad: z.number().optional(),
  /** Minutos que dura el descanso sugerido (fijo) una vez que el operador
   *  acepta el banner; al terminar se resetea el contador de uso */
  limTiempoDescanso: z.number().optional(),
});
export type IControlActividad = z.infer<typeof ControlActividadSchema>;

// Informes
// Configuración para envío de informes por mail
export const ConfigInformesSchema = z.object({
  // Lo podemos poner en cualqjhier módulo
  activo: z.boolean().optional(),
  frecuencia: z.enum(['Diaria', 'Semanal', 'Mensual']).optional(), // Para el cron/worker
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  destinatariosInformes: z.array(z.string()).optional(), /// Mails
});
export type IConfigInformes = z.infer<typeof ConfigInformesSchema>;

/// Twilio

export const TemplatesWhatsappSchema = z.enum([
  'Error de comunicación de alarma',
  'Equipos fuera de línea',
  'Batería baja',
]);
export type TemplatesWhatsapp = z.infer<typeof TemplatesWhatsappSchema>;

export const TemplatesMailSchema = z.enum([
  ...TemplatesWhatsappSchema.options,
  'Nuevo usuario',
  'Reset de contraseña',
  'Cambio de contraseña',
]);
export type TemplatesMail = z.infer<typeof TemplatesMailSchema>;

export const ModuloTwilioSchema = z.object({
  activo: z.boolean().optional(),
  accSid: z.string().optional(),
  authToken: z.string().optional(),
  msgServiceSid: z.string().optional(),
  statusCallback: z.string().optional(),
  phoneSms: z.string().optional(),
  phoneWhatsapp: z.string().optional(),
  phoneLlamada: z.string().optional(),
  templatesWhatsapp: z
    .partialRecord(TemplatesWhatsappSchema, z.string())
    .optional(),
});
export type IModuloTwilio = z.infer<typeof ModuloTwilioSchema>;

export const ModuloSendgridSchema = z.object({
  activo: z.boolean().optional(),
  senderEmail: z.string().optional(),
  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  senderCity: z.string().optional(),
  senderState: z.string().optional(),
  senderZip: z.number().optional(),
  sendGridApiKey: z.string().optional(),
  templatesMail: z.partialRecord(TemplatesMailSchema, z.string()).optional(),
});
export type IModuloSendgrid = z.infer<typeof ModuloSendgridSchema>;

export const TipoClienteSchema = z.enum(['Mayorista', 'Minorista', 'Final']);
export type ITipoCliente = z.infer<typeof TipoClienteSchema>;

export const EstadoCuentaSchema = z.enum(['Activo', 'Suspendido', 'Moroso']);
export type EstadoCuenta = z.infer<typeof EstadoCuentaSchema>;

export const ModuloBotonDePanicoSchema = z.object({
  appkey: z.string().optional(),
  activo: z.boolean().optional(),
});
export type IModuloBotonDePanico = z.infer<typeof ModuloBotonDePanicoSchema>;

export const ModulosIntegracionesSchema = z.object({
  activo: z.boolean().optional(),
  moduloBotonDePanico: ModuloBotonDePanicoSchema.optional(),
});
export type IModulosIntegraciones = z.infer<typeof ModulosIntegracionesSchema>;

export const ModuloBotonBLESchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloBotonBLE = z.infer<typeof ModuloBotonBLESchema>;

export const ModuloSirenasSchema = z.object({
  activo: z.boolean().optional(),
  crearSirenas: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirSirenas: z.boolean().optional(),
  informe: ConfigInformesSchema.optional(),
});
export type IModuloSirenas = z.infer<typeof ModuloSirenasSchema>;

export const ModuloLuminariasSchema = z.object({
  activo: z.boolean().optional(),
  crearDispositivos: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirLuminarias: z.boolean().optional(),
  usaPuestas: z.boolean().optional(), // Habilita la creación de puestas y la relación puesta-luminaria
  informe: ConfigInformesSchema.optional(),
});
export type IModuloLuminarias = z.infer<typeof ModuloLuminariasSchema>;

export const ModuloEmergenciasSchema = z.object({
  activoEmergenciasMedicas: z.boolean().optional(),
  crearEmergenciasMedicas: z.boolean().optional(),
  activoEmergenciasBomberos: z.boolean().optional(),
  crearEmergenciasBomberos: z.boolean().optional(),
  //Acá pueden ir otros tipos de emergencias...
});
export type IModuloEmergencias = z.infer<typeof ModuloEmergenciasSchema>;

export const ModuloAlertasSeguridadSchema = z.object({
  activo: z.boolean().optional(),
  crearAlertas: z.boolean().optional(),
});
export type IModuloAlertasSeguridad = z.infer<
  typeof ModuloAlertasSeguridadSchema
>;

export const ModuloColectivosSchema = z.object({
  activo: z.boolean().optional(),
  crearDispositivos: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirFlota: z.boolean().optional(),
});
export type IModuloColectivos = z.infer<typeof ModuloColectivosSchema>;

export const ModuloAlarmasDomiciliariasSchema = z.object({
  activo: z.boolean().optional(),
  crearDispositivos: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirAlarmas: z.boolean().optional(),
});
export type IModuloAlarmasDomiciliarias = z.infer<
  typeof ModuloAlarmasDomiciliariasSchema
>;

export const ModuloCamarasSchema = z.object({
  activo: z.boolean().optional(),
  crear: z.boolean().optional(),
  compartir: z.boolean().optional(),
});
export type IModuloCamaras = z.infer<typeof ModuloCamarasSchema>;

export const ModuloDispositivosLorawanSchema = z.object({
  activo: z.boolean().optional(),
  crearDispositivos: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirDispositivosLorawan: z.boolean().optional(),
});
export type IModuloDispositivosLorawan = z.infer<
  typeof ModuloDispositivosLorawanSchema
>;

export const ModuloActivosSchema = z.object({
  activo: z.boolean().optional(),
  crearDispositivos: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirActivos: z.boolean().optional(),
});
export type IModuloActivos = z.infer<typeof ModuloActivosSchema>;

export const ModuloAdministracionSchema = z.object({
  activo: z.boolean().optional(),
  crearUsuarios: z.boolean().optional(),
  crearServicios: z.boolean().optional(),
  verApikeys: z.boolean().optional(),
  crearApikeys: z.boolean().optional(),

  //Eventos Personalizados
  verCategoriasEventos: z.boolean().optional(),
  verTiposEventos: z.boolean().optional(),
  verEventosPersonalizados: z.boolean().optional(),

  //Trackers
  activoTrackers: z.boolean().optional(),
  crearTrackers: z.boolean().optional(),
  //Botones BLE
  activoBotonesBLE: z.boolean().optional(),
  crearBotonesBLE: z.boolean().optional(),
  //Dispositivos Lorawam
  activoDispositivosLorawan: z.boolean().optional(),
  crearDispositivosLorawan: z.boolean().optional(),
  compartirDispositivosLorawan: z.boolean().optional(), //Posiblemente esto no se use más

  //Gateways
  activoGateways: z.boolean().optional(),
  crearGateways: z.boolean().optional(),
});
export type IModuloAdministracion = z.infer<typeof ModuloAdministracionSchema>;

export const ModuloVehiculosSchema = z.object({
  activo: z.boolean().optional(),
  crearVehiculos: z.boolean().optional(),
  derivarEventos: z.boolean().optional(),
  derivarEventosTecnicos: z.boolean().optional(),
  compartirVehiculos: z.boolean().optional(),
});
export type IModuloVehiculos = z.infer<typeof ModuloVehiculosSchema>;

export const ModuloEventosTecnicosSchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloEventosTecnicos = z.infer<
  typeof ModuloEventosTecnicosSchema
>;

export const ModuloLogsSchema = z.object({
  activo: z.boolean().optional(),
});
export type IModuloLogs = z.infer<typeof ModuloLogsSchema>;

export const LayerMapaPersonalizadoSchema = z.object({
  nombre: z.string().optional(),
  url: z.string().optional(),
  icono: z.string().optional(),
});
export type ILayerMapaPersonalizado = z.infer<
  typeof LayerMapaPersonalizadoSchema
>;

export const ConfigClienteSchema = z.object({
  imagenes: ImagenesClienteSchema.optional(),
  tema: TemaClienteSchema.optional(),
  moduloColectivos: ModuloColectivosSchema.optional(),
  moduloAlarmasDomiciliarias: ModuloAlarmasDomiciliariasSchema.optional(),
  moduloCamaras: ModuloCamarasSchema.optional(),
  moduloDispositivosLorawan: ModuloDispositivosLorawanSchema.optional(),
  moduloActivos: ModuloActivosSchema.optional(),
  moduloAdministracion: ModuloAdministracionSchema.optional(),
  moduloEventosTecnicos: ModuloEventosTecnicosSchema.optional(),
  moduloVehiculos: ModuloVehiculosSchema.optional(),
  moduloLuminarias: ModuloLuminariasSchema.optional(),
  moduloEmergencias: ModuloEmergenciasSchema.optional(),
  moduloBotonBLE: ModuloBotonBLESchema.optional(),
  modulosIntegraciones: ModulosIntegracionesSchema.optional(),
  moduloLogs: ModuloLogsSchema.optional(),
  moduloTwilio: ModuloTwilioSchema.optional(),
  moduloSendgrid: ModuloSendgridSchema.optional(),
  moduloSirenas: ModuloSirenasSchema.optional(),
  moduloAlertasSeguridad: ModuloAlertasSeguridadSchema.optional(),
  idsClientesQuePuedenAtenderEventos: z.array(z.string()).optional(),
  idsClientesQuePuedenAtenderEventosTecnicos: z.array(z.string()).optional(),
  configHorarioAtencion: ConfigHorarioSchema.optional(),
  /** Si es true, los operadores de este cliente pueden sumarse a atender
   *  eventos que ya están siendo atendidos por otro operador.
   *  Default false: solo un operador atiende a la vez (lock). */
  atencionMultipleEventos: z.boolean().optional(),
  solicitantesEmergencias: z.array(z.string()).optional(),
  solicitantePredeterminado: z.string().optional(),
  credencialesAlarmas: z.array(CredencialesAlarmaSchema).optional(),
  integracionSoflex: IntegracionSoflexSchema.optional(),
  verTrafico: z.boolean().optional(),
  controlInactividad: ControlInactividadSchema.optional(),
  controlActividad: ControlActividadSchema.optional(),
});
export type IConfigCliente = z.infer<typeof ConfigClienteSchema>;

export const ClienteSchema = z.object({
  _id: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idPadre: z.string().optional(),
  activo: z.boolean().optional(),
  nombre: z.string().optional(),
  fechaCreacion: z.string().optional(),
  nivel: z.number().optional(),
  config: ConfigClienteSchema.optional(),
  tipoCliente: TipoClienteSchema.optional(),
  estadoDeCuenta: EstadoCuentaSchema.optional(),
  numeroCliente: z.string().optional(),
  habilitado: z.boolean().optional(),
  apikeyBotonBLE: z.string().optional(),
  poligono: z
    .object({
      type: z.literal('MultiPolygon'),
      coordinates: z.array(z.array(z.array(PuntoCoord))),
    })
    .optional(),
  mapLayers: z.array(LayerMapaPersonalizadoSchema).optional(), //Capas de mapa personalizadas
  // Populate
  get padre() {
    return ClienteSchema.optional();
  },
  get ancestros() {
    return z.array(ClienteSchema).optional();
  },
});
export type ICliente = z.infer<typeof ClienteSchema>;

export const CreateClienteSchema = ClienteSchema.omit({
  _id: true,
  padre: true,
});
export type ICreateCliente = z.infer<typeof CreateClienteSchema>;

export const UpdateClienteSchema = ClienteSchema.omit({
  _id: true,
  nivel: true,
  tipoCliente: true,
  fechaCreacion: true,
  padre: true,
});
export type IUpdateCliente = z.infer<typeof UpdateClienteSchema>;
