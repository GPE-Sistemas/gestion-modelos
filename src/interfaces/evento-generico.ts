// evento-generico.ts
import { IEntidades } from './asignacion';
import { z } from 'zod';
import { ClienteSchema, ConfigHorarioSchema, ICliente, IConfigHorario } from './cliente';
import type { ITracker } from './tracker';
import { ModoArmadoUnicomSchema } from './dispositivo-alarma';
import type { IDispositivoAlarma } from './dispositivo-alarma';
import type { IActivo } from './activo';
import type { IConfigEventoUsuario } from './config-evento-usuario';
import { SonidoEventoSchema } from './categoria-evento';
import type { IUsuario } from './usuario';
import type { ILuminaria } from './luminaria';
import { BotonBluetoothSchema, IBotonBluetooth } from './boton-bluetooth';
import type { IReporteGenerico } from './reporte-generico';
import type { IDestinatarioAsistencia } from './destinatario-asistencia';
import type { IEmergencia } from './emergencias';
import { PersonalSaludSchema, IPersonalSalud } from './personal-salud';
import { GeoJSONPointSchema } from '../auxiliares';
import { SirenaSchema, ISirena } from './sirena';
import type { IUbicacion } from './ubicacion';
import { GatewaySchema, IGateway } from './gateway';

/* ────────────────────────────────────────────────
 *  TIPOS DE EVENTO (DISCRIMINANTE)
 * ────────────────────────────────────────────────*/

export const TipoEventoGenericoSchema = z.enum([
  'Evento Colectivo',
  'Evento Activo',
  'Evento Tracker',
  'Evento Vehiculo',
  'Evento Alarma',
  'Evento Luminaria',
  'Evento Gateway',
  'Evento BotonBLE',
  'Evento Sirena',
  'Evento Técnico Alarma',
  'Evento Técnico Tracker',
  'Evento Técnico Vehículo',
  'Evento Técnico Luminaria',
  'Evento Técnico Sirena',
  'Evento Técnico Gateway',
  'Evento Emergencia Médica',
  'Evento Emergencia Bomberos',
]);
export type TipoEventoGenerico = z.infer<typeof TipoEventoGenericoSchema>;

/* ────────────────────────────────────────────────
 *  CATEGORIAS
 * ────────────────────────────────────────────────*/
export const CategoriaSchema = z.enum([
  'Evento', // Eventos operacionales que pueden ser atendidos. (colectivos, activos, trackers, vehículos, alarmas, luminarias, botón BLE, gateways)
  'Servicio Técnico', // Eventos técnicos (alarma, tracker, luminaria)
  'Seguimiento Emergencia', // Eventos de emergencia (médica, bomberos)
  'Verificación', // Eventos de verificación (subir fotos y notas de entidades particulares)
]);
export type Categoria = z.infer<typeof CategoriaSchema>;

/* ────────────────────────────────────────────────
 *  Auxiliares
 * ────────────────────────────────────────────────*/
export const RangoHorarioSchema = z.object({
  dias: z.array(z.string()).optional(), // ['Lunes', 'Martes', ...]
  horarioDesde: z.string().optional(), // '08:00'
  horarioHasta: z.string().optional(), // '18:00'
});
export type RangoHorario = z.infer<typeof RangoHorarioSchema>;

export const CategoriaTecnicaSchema = z.enum([
  'Alarma',
  'Tracker',
  'Vehículo',
  'Luminaria',
  'Sirena',
  'Gateway',
]);
export type CategoriaTecnica = z.infer<typeof CategoriaTecnicaSchema>;

export const EstadoEventoTecnicoSchema = z.enum([
  'Pendiente',
  'Asignado',
  'En Atención',
  'Pendiente de Aprobación',
  'Firma Cliente',
  'Finalizado',
]);
export type estadoEventoTecnico = z.infer<typeof EstadoEventoTecnicoSchema>;

export const EstadoEventoSchema = z.enum([
  'Sin Tratamiento',
  'Pendiente',
  'En Atención',
  'En Espera',
  'Liberada',
  'Finalizada',
]);
export type estadoEvento = z.infer<typeof EstadoEventoSchema>;

export const EstadoEmergenciaMedicaSchema = z.enum([
  'Pendiente', // Auxilio recién creado
  'Asignada', // Se asignó vehículo/médico/enfermero
  'Reasignada', //Se reasignó vehículo/médico/enfermero
  'En tránsito', // El vehículo salió del centro
  'Llegó a destino', // El vehículo llegó al lugar de la emergencia
  'Rumbo a hospital', // El vehículo sale hacia el hospital
  'Llegada a hospital', //El vehículo Llegó al hospital
  'Finalizada', // La emergencia fue tratada. Ya sea porque se llegó al hospital o no
  'Cancelada', // La emergencia se canceló
]);
export type EstadoEmergenciaMedica = z.infer<typeof EstadoEmergenciaMedicaSchema>;

export const EstadoEmergenciaBomberosSchema = z.enum([
  'Pendiente', // Auxilio recién creado
  'Asignada', // Se asignó vehículo
  'Reasignada', //Se reasignó vehículo
  'En tránsito', // El vehículo salió del centro
  'Llegó a destino', // El vehículo llegó al lugar de la emergencia
  'Finalizada', // La emergencia fue tratada
  'Cancelada', // La emergencia se canceló
]);
export type EstadoEmergenciaBomberos = z.infer<typeof EstadoEmergenciaBomberosSchema>;

/* ────────────────────────────────────────────────
 *  ALIAS DE TIPOS EXISTENTES
 * ────────────────────────────────────────────────*/

export type EstadoEvento = estadoEvento;
export type EstadoEventoTecnico = estadoEventoTecnico;
export type EstadoEventoEmergencia =
  | EstadoEmergenciaMedica
  | EstadoEmergenciaBomberos;

export const EstadoEventoEmergenciaSchema = z.union([
  EstadoEmergenciaMedicaSchema,
  EstadoEmergenciaBomberosSchema,
]);

export const ContactIDSchema = z.object({
  numeroCuenta: z.string().optional(),
  tipoMensaje: z.string().optional(),
  calificadorDeEvento: z.string().optional(),
  codigoDeEvento: z.string().optional(),
  numeroDeParticion: z.string().optional(),
  numeroDeZona: z.string().optional(),
  checksum: z.string().optional(),
});
export type IContactID = z.infer<typeof ContactIDSchema>;

/* ────────────────────────────────────────────────
 *  VALORES ESPECÍFICOS POR TIPO DE EVENTO
 * ────────────────────────────────────────────────*/

// IValoresEventoOperacional
// Separar en Alarmas - Trackers (Colectivos/Activos/Vehículos) - Luminarias
export const ValoresEventoBaseSchema = z.object({
  titulo: z.string().optional(),
  mensaje: z.string().optional(),
  color: z.string().optional(),
  sonido: SonidoEventoSchema.optional(),
});
export type IValoresEventoBase = z.infer<typeof ValoresEventoBaseSchema>;

export const ValoresEventoTrackerSchema = ValoresEventoBaseSchema.extend({
  geojson: GeoJSONPointSchema.optional(),
  codigoTracker: z.string().optional(),
  direccion: z.string().optional(), // Coordenadas traducidas a dirección legible
});
export type IValoresEventoTracker = z.infer<typeof ValoresEventoTrackerSchema>;

export const ValoresEventoAlarmaSchema = ValoresEventoBaseSchema.extend({
  contactId: ContactIDSchema.optional(),
  codigoAlarma: z.string().optional(),
  codigoComunicador: z.string().optional(),
  tiposEvento: z
    .array(z.enum(['Armado', 'Desarmado', 'Detonación', 'Test']))
    .optional(),
  // Usuario que generó el armado/desarmado. Ausentes si no se pudo resolver
  // (armado rápido/llave/automático, zona sin contacto configurado, eventos históricos).
  idUsuario: z.string().optional(), // Solo si se resolvió a un IUsuario de la plataforma
  usuario: z.string().optional(), // Nombre ya resuelto (denormalizado): IUsuario, contacto del panel o "Usuario N"
  // UNICOM (additive): datos crudos del evento MQTT para trazabilidad/diagnóstico.
  cidUnicom: z.string().optional(), // "<estado> <opcode>" original, ej. "3 407"
  opcodeUnicom: z.string().optional(), // opcode del cid, ej. "407"
  // ModoArmadoUnicomSchema es un z.enum chico y dispositivo-alarma (V2) ya no
  // importa valores intra-SCC → import de valor sin ciclo runtime.
  modoArmado: ModoArmadoUnicomSchema.optional(), // si el evento es de armado/desarmado
  idSensor: z.number().optional(), // índice del sensor en reportes 1 606 / disparos 1 134
  crf: z.string().optional(), // 8 hex del reporte de sensor (código RF + attr)
});
export type IValoresEventoAlarma = z.infer<typeof ValoresEventoAlarmaSchema>;

export const ValoresEventoLuminariaSchema = ValoresEventoBaseSchema.extend({
  geojson: GeoJSONPointSchema.optional(),
});
export type IValoresEventoLuminaria = z.infer<typeof ValoresEventoLuminariaSchema>;

export const ValoresEventoBotonBLESchema = ValoresEventoBaseSchema.extend({
  geojson: GeoJSONPointSchema.optional(),
});
export type IValoresEventoBotonBLE = z.infer<typeof ValoresEventoBotonBLESchema>;

export const ValoresEventoGatewaySchema = ValoresEventoBaseSchema.extend({
  geojson: GeoJSONPointSchema.optional(),
});
export type IValoresEventoGateway = z.infer<typeof ValoresEventoGatewaySchema>;

export const ValoresEventoSirenaSchema = ValoresEventoBaseSchema.extend({
  idSirena: z.string().optional(),
  chipId: z.string().optional(),
  origen: z.enum(['APP', 'Botón', 'Monitoreo']).optional(), /// Pánico (APP) - Manual (Botón físico) - Monitoreo (¿Programado o algo así?)
  efecto: z.enum(['Reflector', 'Sirena', 'Pánico']).optional(), /// Reflector (Luz) - Sirena (Sonido) - Pánico (Luz y Sonido)
  direccion: z.string().optional(), // Dirección parseada de la sirena
  idVecino: z.string().optional(),
  nombreVecino: z.string().optional(),
  telefono: z.string().optional(), // Solo del vecino
  idUsuario: z.string().optional(), // Si viene de monitoreo
  usuario: z.string().optional(), // Si viene de monitoreo
  geojson: GeoJSONPointSchema.optional(), /// Ubicación del vecino cuando es APP Sirena en lkos otros casos.
});
export type IValoresEventoSirena = z.infer<typeof ValoresEventoSirenaSchema>;

// Valores para eventos técnicos
export const ValoresEventoTecnicoSchema = ValoresEventoBaseSchema.extend({
  categoria: CategoriaTecnicaSchema.optional(),
  solicitante: z
    .object({
      nombre: z.string().optional(),
      telefono: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  disponibilidad: z.array(RangoHorarioSchema).optional(),
  prioridad: z.enum(['Normal', 'Alta', 'Urgente']).optional(),
  numeroIncidente: z.string().optional(), // Random cuando se crea.
});
export type IValoresEventoTecnico = z.infer<typeof ValoresEventoTecnicoSchema>;

// Valores para eventos de emergencia
export const ValoresEventoEmergenciaSchema = ValoresEventoBaseSchema.extend({
  ubicacionActual: GeoJSONPointSchema.optional(), //Es la ubicación donde se generó el evento. Cuando se crea la emergencia, el primer evento no tiene ubicación porque no tiene ninguna ambulancia asignada
  direccionActual: z.string().optional(),
  motivoCancelacion: z.string().optional(),
  motivoReasignacion: z.string().optional(),
  observaciones: z.string().optional(),
  diagnostico: z.string().optional(),
});
export type IValoresEventoEmergencia = z.infer<typeof ValoresEventoEmergenciaSchema>;

/* ────────────────────────────────────────────────
 *  DETALLES (sub-objetos con populates)
 * ────────────────────────────────────────────────*/

/** Cambio de entidad propuesto por el técnico durante la atención de un servicio
 *  técnico. Ej: cambio de nodo de una luminaria. Se aplica recién cuando
 *  administración aprueba (finaliza) el evento. */
export const CambioEntidadPropuestoSchema = z.object({
  tipoEntidad: z.custom<IEntidades>().optional(),
  idEntidadAnterior: z.string().optional(),
  idEntidadNueva: z.string().optional(),
  aplicado: z.boolean().optional(), // false hasta que administración aprueba
  fechaAplicado: z.string().optional(),
});
export type CambioEntidadPropuesto = z.infer<
  typeof CambioEntidadPropuestoSchema
>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const DetallesTecnicosSchema = z.object({
  idTecnicoAsignado: z.string().optional(),
  fechaDisponibleParaTratar: z.string().optional(),
  cambioEntidadPropuesto: CambioEntidadPropuestoSchema.optional(),

  // Populate opcional
  tecnico: z.custom<IUsuario>().optional(),
});
export type DetallesTecnicos = z.infer<typeof DetallesTecnicosSchema>;

export const DetallesEmergenciasSchema = z.object({
  // Ubicaciones
  idEmergencia: z.string().optional(),
  idCentroDeAtencion: z.string().optional(),
  idHospital: z.string().optional(),

  // Cosas que deberían ser usuarios, pero algunas no lo son.
  idDestinatarioAsistencia: z.string().optional(),
  idChofer: z.string().optional(),
  idMovilUsuario: z.string().optional(),
  idsMedicos: z.array(z.string()).optional(),
  idsEnfermeros: z.array(z.string()).optional(),
  idUsuarioResponsable: z.string().optional(),
  idMovilAsignado: z.string().optional(),

  // Populate opcional
  destinatarioAsistencia: z.custom<IDestinatarioAsistencia>().optional(),
  emergencia: z.custom<IEmergencia>().optional(),
  chofer: z.custom<IUsuario>().optional(),
  centroDeAtencion: z.custom<IUbicacion>().optional(),
  movilUsuario: z.custom<IUsuario>().optional(),
  medicos: z.array(PersonalSaludSchema).optional(),
  enfermeros: z.array(PersonalSaludSchema).optional(),
  hospital: z.custom<IUbicacion>().optional(),
  usuarioResponsable: z.custom<IUsuario>().optional(),
  movilAsignado: z.custom<IActivo>().optional(),
});
export type DetallesEmergencias = z.infer<typeof DetallesEmergenciasSchema>;

/* ────────────────────────────────────────────────
 *  MAPA DE TIPOS DE EVENTO → VALORES Y ESTADO
 * ────────────────────────────────────────────────*/

export type MapaEventoGenerico = {
  'Evento Colectivo': {
    valores: IValoresEventoTracker;
    estado: EstadoEvento;
  };
  'Evento Activo': {
    valores: IValoresEventoTracker;
    estado: EstadoEvento;
  };
  'Evento Tracker': {
    valores: IValoresEventoTracker;
    estado: EstadoEvento;
  };
  'Evento Vehiculo': {
    valores: IValoresEventoTracker;
    estado: EstadoEvento;
  };
  'Evento Alarma': {
    valores: IValoresEventoAlarma;
    estado: EstadoEvento;
  };
  'Evento Luminaria': {
    valores: IValoresEventoLuminaria;
    estado: EstadoEvento;
  };
  'Evento Gateway': {
    valores: IValoresEventoGateway;
    estado: EstadoEvento;
  };
  'Evento BotonBLE': {
    valores: IValoresEventoBotonBLE;
    estado: EstadoEvento;
  };
  'Evento Sirena': {
    valores: IValoresEventoSirena;
    estado: EstadoEvento;
  };
  'Evento Técnico Alarma': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };
  'Evento Técnico Tracker': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };

  'Evento Técnico Vehículo': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };
  'Evento Técnico Luminaria': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };
  'Evento Técnico Sirena': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };
  'Evento Técnico Gateway': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };
  'Evento Emergencia Médica': {
    valores: IValoresEventoEmergencia;
    estado: EstadoEventoEmergencia;
  };
  'Evento Emergencia Bomberos': {
    valores: IValoresEventoEmergencia;
    estado: EstadoEventoEmergencia;
  };
};

/* ────────────────────────────────────────────────
 *  BASE DEL EVENTO (GENÉRICO)
 *
 *  Tipo legacy hand-written: el discriminante `tipoEvento` es OPCIONAL acá,
 *  pero REQUERIDO en los schemas Zod de abajo. Por eso NO se deriva con z.infer.
 * ────────────────────────────────────────────────*/

export interface IEventoBaseGenerico<T extends keyof MapaEventoGenerico> {
  _id?: string;
  fechaCreacion?: string;
  expireAt?: string;

  // Tenant / relaciones
  idCliente?: string;
  idsAncestros?: string[];

  filtrador?: Categoria; // Para las vistas de atender

  // Tipo y datos discriminados
  tipoEvento?: T;
  estado?: MapaEventoGenerico[T]['estado'];
  valores?: MapaEventoGenerico[T]['valores'];

  // Campos comunes a eventos operacionales
  notificar?: boolean;
  atender?: boolean;
  /** Derivado en backend (hooks): atender===true && estado en estados activos.
   *  Indexado parcialmente para acelerar la consulta de eventos "a atender". */
  requiereAtencion?: boolean;
  noDerivar?: boolean;
  posponerHasta?: string;
  categoria?: string; // Nombre de la categoria del tipo de evento
  prioridad?: number;
  repetido?: number;
  fechaUltimoRepetido?: string;
  tiempoRespuesta?: number;

  idEntidad?: string; // Lo que generó el evento (activo, tracker, alarma, reporte,etc.)
  idReporte?: string; // En caso de ser un evento generado por un reporte automático
  idConfigEventoUsuario?: string; // Configuración de usuario aplicada al evento

  detallesTecnicos?: DetallesTecnicos;
  detallesEmergencias?: DetallesEmergencias;
  // Permisos y atención
  idsClientesQuePuedenAtender?: string[];
  configHorariosAtencion?: IConfigHorario[];
  idsClientesAtendiendo?: string[];
  idsUsuariosAtendiendo?: string[];

  // Populate opcional
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuariosAtendiendo?: IUsuario[];
  // idEntidad
  tracker?: ITracker;
  alarma?: IDispositivoAlarma;
  luminaria?: ILuminaria;
  usuario?: IUsuario;
  activo?: IActivo;
  botonBluetooth?: IBotonBluetooth;
  sirena?: ISirena;
  gateway?: IGateway;
  //
  reporte?: IReporteGenerico;
  configEventoUsuario?: IConfigEventoUsuario;
}

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO (TYPE-SAFE) - READ
 * ────────────────────────────────────────────────*/

export type IEventoGenerico =
  | IEventoBaseGenerico<'Evento Colectivo'>
  | IEventoBaseGenerico<'Evento Activo'>
  | IEventoBaseGenerico<'Evento Tracker'>
  | IEventoBaseGenerico<'Evento Vehiculo'>
  | IEventoBaseGenerico<'Evento Alarma'>
  | IEventoBaseGenerico<'Evento Luminaria'>
  | IEventoBaseGenerico<'Evento Gateway'>
  | IEventoBaseGenerico<'Evento BotonBLE'>
  | IEventoBaseGenerico<'Evento Sirena'>
  | IEventoBaseGenerico<'Evento Técnico Alarma'>
  | IEventoBaseGenerico<'Evento Técnico Tracker'>
  | IEventoBaseGenerico<'Evento Técnico Vehículo'>
  | IEventoBaseGenerico<'Evento Técnico Luminaria'>
  | IEventoBaseGenerico<'Evento Técnico Gateway'>
  | IEventoBaseGenerico<'Evento Técnico Sirena'>
  | IEventoBaseGenerico<'Evento Emergencia Médica'>
  | IEventoBaseGenerico<'Evento Emergencia Bomberos'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type OmitirCreate =
  | '_id'
  | 'idsAncestros'
  | 'requiereAtencion'
  | 'cliente'
  | 'ancestros'
  | 'usuariosAtendiendo'
  | 'tracker'
  | 'alarma'
  | 'luminaria'
  | 'usuario'
  | 'activo'
  | 'gateway'
  | 'botonBluetooth'
  | 'configEventoUsuario'
  | 'reporte';

/** Create: no incluimos los virtuales/ids que se manejan en el backend.
 *  Mantiene `tipoEvento` como discriminante.
 */
export type ICreateEventoGenerico =
  | Omit<IEventoBaseGenerico<'Evento Colectivo'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Activo'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Tracker'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Vehiculo'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Alarma'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Luminaria'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Gateway'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento BotonBLE'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Sirena'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Alarma'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Tracker'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Vehículo'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Luminaria'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Gateway'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Sirena'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Emergencia Médica'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Emergencia Bomberos'>, OmitirCreate>;

/** Update: permitimos campos parciales (opcional) pero mantenemos `tipoEvento` para que TS pueda discriminar.
 *  Ejemplo: cuando se actualiza, se puede enviar solo `valores` con algunos campos o metadatos.
 */
export type IUpdateEventoGenerico =
  | ({ tipoEvento: 'Evento Colectivo' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Colectivo'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Activo' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Activo'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Tracker' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Tracker'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Vehiculo' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Vehiculo'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Alarma' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Alarma'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Luminaria' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Luminaria'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Gateway' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Gateway'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento BotonBLE' } & Partial<
      Omit<IEventoBaseGenerico<'Evento BotonBLE'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Sirena' } & Partial<
      Omit<IEventoBaseGenerico<'Evento Sirena'>, OmitirCreate | 'tipoEvento'>
    >)
  | ({ tipoEvento: 'Evento Técnico Alarma' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Alarma'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Técnico Tracker' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Tracker'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Técnico Vehículo' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Vehículo'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Técnico Luminaria' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Luminaria'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Técnico Gateway' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Gateway'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Técnico Sirena' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Sirena'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Emergencia Médica' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Emergencia Médica'>,
        OmitirCreate | 'tipoEvento'
      >
    >)
  | ({ tipoEvento: 'Evento Emergencia Bomberos' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Emergencia Bomberos'>,
        OmitirCreate | 'tipoEvento'
      >
    >);

/* ────────────────────────────────────────────────
 *  ATENCIÓN (arrays idsUsuariosAtendiendo / idsClientesAtendiendo)
 * ────────────────────────────────────────────────*/

export const AccionAtencionEventoSchema = z.enum([
  'atender',
  'desatender',
  'limpiar',
]);
export type AccionAtencionEvento = z.infer<typeof AccionAtencionEventoSchema>;

/** Body de PUT /eventos-genericos/:id/atencion (api-datos).
 *  Actualiza estado + arrays de atención en una sola operación atómica
 *  ($addToSet/$pull), sin ventana de carrera entre operadores. */
export const ActualizarAtencionEventoGenericoSchema = z.object({
  accion: AccionAtencionEventoSchema,
  idUsuario: z.string(),
  idCliente: z.string(),
  estado: EstadoEventoSchema,
  /** Solo para 'limpiar' (En Espera) */
  posponerHasta: z.string().optional(),
  /** Solo para 'atender': si es true, falla con 409 si otro usuario ya está
   *  atendiendo (lock de atención única). */
  exclusivo: z.boolean().optional(),
});
export type IActualizarAtencionEventoGenerico = z.infer<
  typeof ActualizarAtencionEventoGenericoSchema
>;

/* ────────────────────────────────────────────────
 *  TIPO CACHE (SIN POPULATE)
 * ────────────────────────────────────────────────*/

export type IEventoGenericoCache = Omit<
  IEventoGenerico,
  | 'cliente'
  | 'ancestros'
  | 'usuariosAtendiendo'
  | 'tracker'
  | 'vehiculo'
  | 'alarma'
  | 'luminaria'
  | 'usuario'
  | 'activo'
  | 'botonBluetooth'
  | 'configEventoUsuario'
  | 'reporte'
  | 'sirena'
  | 'gateway'
> & {
  // Sobrescribir detallesTecnicos sin populates
  detallesTecnicos?: Omit<DetallesTecnicos, 'tecnico'>;
  // Sobrescribir detallesMedicos sin populates
  detallesEmergencias?: Omit<
    DetallesEmergencias,
    | 'destinatarioAsistencia'
    | 'emergencia'
    | 'chofer'
    | 'centroDeAtencion'
    | 'movilUsuario'
    | 'medicos'
    | 'enfermeros'
    | 'hospital'
    | 'usuarioResponsable'
  >;
};

/* ────────────────────────────────────────────────
 *  SCHEMAS ZOD (nuevos, discriminante REQUERIDO)
 *
 *  Para validación runtime y JSON Schema de datos nuevos. A diferencia de los
 *  tipos legacy de arriba, acá `tipoEvento` es obligatorio (z.discriminatedUnion
 *  lo exige). Los populates hacia el SCC van como getters (ciclo de imports);
 *  `reporte` usa z.custom para conservar el tipo legacy IReporteGenerico.
 * ────────────────────────────────────────────────*/

// Populates intra-SCC como z.custom (import type-only) — ver comentario en
// DetallesTecnicosSchema. Sin getters, el objeto es spreadeable.
const camposComunesEvento = {
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(),
  expireAt: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  filtrador: CategoriaSchema.optional(), // Para las vistas de atender
  notificar: z.boolean().optional(),
  atender: z.boolean().optional(),
  /** Derivado en backend (hooks): atender===true && estado en estados activos. */
  requiereAtencion: z.boolean().optional(),
  noDerivar: z.boolean().optional(),
  posponerHasta: z.string().optional(),
  categoria: z.string().optional(), // Nombre de la categoria del tipo de evento
  prioridad: z.number().optional(),
  repetido: z.number().optional(),
  fechaUltimoRepetido: z.string().optional(),
  tiempoRespuesta: z.number().optional(),
  idEntidad: z.string().optional(), // Lo que generó el evento
  idReporte: z.string().optional(), // En caso de ser un evento generado por un reporte automático
  idConfigEventoUsuario: z.string().optional(),
  detallesTecnicos: DetallesTecnicosSchema.optional(),
  detallesEmergencias: DetallesEmergenciasSchema.optional(),
  idsClientesQuePuedenAtender: z.array(z.string()).optional(),
  configHorariosAtencion: z.array(ConfigHorarioSchema).optional(),
  idsClientesAtendiendo: z.array(z.string()).optional(),
  idsUsuariosAtendiendo: z.array(z.string()).optional(),
  // Populates fuera del SCC (directas)
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  botonBluetooth: BotonBluetoothSchema.optional(),
  sirena: SirenaSchema.optional(),
  gateway: GatewaySchema.optional(),
  // Populates intra-SCC → z.custom
  usuariosAtendiendo: z.array(z.custom<IUsuario>()).optional(),
  tracker: z.custom<ITracker>().optional(),
  alarma: z.custom<IDispositivoAlarma>().optional(),
  luminaria: z.custom<ILuminaria>().optional(),
  usuario: z.custom<IUsuario>().optional(),
  activo: z.custom<IActivo>().optional(),
  configEventoUsuario: z.custom<IConfigEventoUsuario>().optional(),
  // Tipo legacy con discriminante opcional → z.custom conserva compatibilidad
  reporte: z.custom<IReporteGenerico>().optional(),
};

const varianteEvento = <
  T extends TipoEventoGenerico,
  V extends z.ZodTypeAny,
  E extends z.ZodTypeAny,
>(
  tipo: T,
  valores: V,
  estado: E,
) =>
  z.object({
    ...camposComunesEvento,
    tipoEvento: z.literal(tipo),
    estado: estado.optional(),
    valores: valores.optional(),
  });

const vEvtColectivo = varianteEvento('Evento Colectivo', ValoresEventoTrackerSchema, EstadoEventoSchema);
const vEvtActivo = varianteEvento('Evento Activo', ValoresEventoTrackerSchema, EstadoEventoSchema);
const vEvtTracker = varianteEvento('Evento Tracker', ValoresEventoTrackerSchema, EstadoEventoSchema);
const vEvtVehiculo = varianteEvento('Evento Vehiculo', ValoresEventoTrackerSchema, EstadoEventoSchema);
const vEvtAlarma = varianteEvento('Evento Alarma', ValoresEventoAlarmaSchema, EstadoEventoSchema);
const vEvtLuminaria = varianteEvento('Evento Luminaria', ValoresEventoLuminariaSchema, EstadoEventoSchema);
const vEvtGateway = varianteEvento('Evento Gateway', ValoresEventoGatewaySchema, EstadoEventoSchema);
const vEvtBotonBLE = varianteEvento('Evento BotonBLE', ValoresEventoBotonBLESchema, EstadoEventoSchema);
const vEvtSirena = varianteEvento('Evento Sirena', ValoresEventoSirenaSchema, EstadoEventoSchema);
const vEvtTecAlarma = varianteEvento('Evento Técnico Alarma', ValoresEventoTecnicoSchema, EstadoEventoTecnicoSchema);
const vEvtTecTracker = varianteEvento('Evento Técnico Tracker', ValoresEventoTecnicoSchema, EstadoEventoTecnicoSchema);
const vEvtTecVehiculo = varianteEvento('Evento Técnico Vehículo', ValoresEventoTecnicoSchema, EstadoEventoTecnicoSchema);
const vEvtTecLuminaria = varianteEvento('Evento Técnico Luminaria', ValoresEventoTecnicoSchema, EstadoEventoTecnicoSchema);
const vEvtTecSirena = varianteEvento('Evento Técnico Sirena', ValoresEventoTecnicoSchema, EstadoEventoTecnicoSchema);
const vEvtTecGateway = varianteEvento('Evento Técnico Gateway', ValoresEventoTecnicoSchema, EstadoEventoTecnicoSchema);
const vEvtEmergenciaMedica = varianteEvento('Evento Emergencia Médica', ValoresEventoEmergenciaSchema, EstadoEmergenciaMedicaSchema);
const vEvtEmergenciaBomberos = varianteEvento('Evento Emergencia Bomberos', ValoresEventoEmergenciaSchema, EstadoEmergenciaBomberosSchema);

// Anotación explícita: el tipo inferido de una discriminated union de 17
// variantes (cada una embebiendo ClienteSchema) excede el límite de
// serialización de declarations (TS7056). z.ZodType<tipo legacy> es honesto
// (el parse devuelve esa forma) y se emite por referencia.
export const EventoGenericoSchema: z.ZodType<IEventoGenerico> =
  z.discriminatedUnion('tipoEvento', [
  vEvtColectivo,
  vEvtActivo,
  vEvtTracker,
  vEvtVehiculo,
  vEvtAlarma,
  vEvtLuminaria,
  vEvtGateway,
  vEvtBotonBLE,
  vEvtSirena,
  vEvtTecAlarma,
  vEvtTecTracker,
  vEvtTecVehiculo,
  vEvtTecLuminaria,
  vEvtTecSirena,
  vEvtTecGateway,
  vEvtEmergenciaMedica,
  vEvtEmergenciaBomberos,
]);

// Mismo set que el type OmitirCreate de arriba (sirena NO se omite, igual que el original)
const omitirCreateUpdateEvento = {
  _id: true,
  idsAncestros: true,
  requiereAtencion: true,
  cliente: true,
  ancestros: true,
  usuariosAtendiendo: true,
  tracker: true,
  alarma: true,
  luminaria: true,
  usuario: true,
  activo: true,
  gateway: true,
  botonBluetooth: true,
  configEventoUsuario: true,
  reporte: true,
} as const;

export const CreateEventoGenericoSchema: z.ZodType<ICreateEventoGenerico> =
  z.discriminatedUnion('tipoEvento', [
  vEvtColectivo.omit(omitirCreateUpdateEvento),
  vEvtActivo.omit(omitirCreateUpdateEvento),
  vEvtTracker.omit(omitirCreateUpdateEvento),
  vEvtVehiculo.omit(omitirCreateUpdateEvento),
  vEvtAlarma.omit(omitirCreateUpdateEvento),
  vEvtLuminaria.omit(omitirCreateUpdateEvento),
  vEvtGateway.omit(omitirCreateUpdateEvento),
  vEvtBotonBLE.omit(omitirCreateUpdateEvento),
  vEvtSirena.omit(omitirCreateUpdateEvento),
  vEvtTecAlarma.omit(omitirCreateUpdateEvento),
  vEvtTecTracker.omit(omitirCreateUpdateEvento),
  vEvtTecVehiculo.omit(omitirCreateUpdateEvento),
  vEvtTecLuminaria.omit(omitirCreateUpdateEvento),
  vEvtTecSirena.omit(omitirCreateUpdateEvento),
  vEvtTecGateway.omit(omitirCreateUpdateEvento),
  vEvtEmergenciaMedica.omit(omitirCreateUpdateEvento),
  vEvtEmergenciaBomberos.omit(omitirCreateUpdateEvento),
]);

// Update: parcial pero con el discriminante requerido de nuevo (patrón UpdatePermisoSchema de acceso-modelos)
export const UpdateEventoGenericoSchema: z.ZodType<IUpdateEventoGenerico> =
  z.discriminatedUnion('tipoEvento', [
  vEvtColectivo.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Colectivo') }),
  vEvtActivo.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Activo') }),
  vEvtTracker.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Tracker') }),
  vEvtVehiculo.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Vehiculo') }),
  vEvtAlarma.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Alarma') }),
  vEvtLuminaria.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Luminaria') }),
  vEvtGateway.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Gateway') }),
  vEvtBotonBLE.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento BotonBLE') }),
  vEvtSirena.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Sirena') }),
  vEvtTecAlarma.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Técnico Alarma') }),
  vEvtTecTracker.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Técnico Tracker') }),
  vEvtTecVehiculo.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Técnico Vehículo') }),
  vEvtTecLuminaria.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Técnico Luminaria') }),
  vEvtTecSirena.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Técnico Sirena') }),
  vEvtTecGateway.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Técnico Gateway') }),
  vEvtEmergenciaMedica.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Emergencia Médica') }),
  vEvtEmergenciaBomberos.omit(omitirCreateUpdateEvento).partial().extend({ tipoEvento: z.literal('Evento Emergencia Bomberos') }),
]);
