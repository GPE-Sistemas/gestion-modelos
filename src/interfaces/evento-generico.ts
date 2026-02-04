// evento-generico.ts
import { ICliente } from './cliente';
import { ITracker } from './tracker';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { IActivo } from './activo';
import { IConfigEventoUsuario } from './config-evento-usuario';
import { SonidoEvento } from './categoria-evento';
import { IUsuario } from './usuario';
import { ILuminaria } from './luminaria';
import { IBotonBluetooth } from './boton-bluetooth';
import { IReporteGenerico } from './reporte-generico';
import { IDestinatarioAsistencia } from './destinatario-asistencia';
import { IEmergencia } from './emergencias';
import { IHospital } from './hospitales';
import { IPersonalSalud } from './personal-salud';
import { ICentroDeAtencion } from './centro-de-atencion';
import { DireccionV2, IGeoJSONPoint } from '../auxiliares';
import { ISirena } from './sirena';

/* ────────────────────────────────────────────────
 *  ALIAS DE TIPOS EXISTENTES
 * ────────────────────────────────────────────────*/

export type EstadoEvento = estadoEvento;
export type EstadoEventoTecnico = estadoEventoTecnico;
export type EstadoEventoEmergencia =
  | EstadoEmergenciaMedica
  | EstadoEmergenciaBomberos;

/* ────────────────────────────────────────────────
 *  TIPOS DE EVENTO (DISCRIMINANTE)
 * ────────────────────────────────────────────────*/

export type TipoEventoGenerico =
  | 'Evento Colectivo'
  | 'Evento Activo'
  | 'Evento Tracker'
  | 'Evento Vehiculo'
  | 'Evento Alarma'
  | 'Evento Luminaria'
  | 'Evento BotonBLE'
  | 'Evento Sirena'
  | 'Evento Técnico Alarma'
  | 'Evento Técnico Tracker'
  | 'Evento Técnico Luminaria'
  | 'Evento Técnico Sirena'
  | 'Evento Emergencia Médica'
  | 'Evento Emergencia Bomberos';

/* ────────────────────────────────────────────────
 *  CATEGORIAS
 * ────────────────────────────────────────────────*/
export type Categoria =
  | 'Evento' // Eventos operacionales que pueden ser atendidos. (colectivos, activos, trackers, vehículos, alarmas, luminarias, botón BLE)
  | 'Servicio Técnico' // Eventos técnicos (alarma, tracker, luminaria)
  | 'Seguimiento Emergencia'; // Eventos de emergencia (médica, bomberos)

/* ────────────────────────────────────────────────
 *  Auxiliares
 * ────────────────────────────────────────────────*/
export interface RangoHorario {
  dias?: string[]; // ['Lunes', 'Martes', ...]
  horarioDesde?: string; // '08:00'
  horarioHasta?: string; // '18:00'
}

export type CategoriaTecnica = 'Alarma' | 'Tracker' | 'Luminaria' | 'Sirena';

export type estadoEventoTecnico =
  | 'Pendiente'
  | 'Asignado'
  | 'En Atención'
  | 'Pendiente de Aprobación'
  | 'Finalizado';

export type estadoEvento =
  | 'Sin Tratamiento'
  | 'Pendiente'
  | 'En Atención'
  | 'En Espera'
  | 'Liberada'
  | 'Finalizada';

export type EstadoEmergenciaMedica =
  //LLAMADAS DE EMERGENCIA
  | 'Atendida' //La llamada se atendió exitosamente

  //AUXILIOS
  | 'Pendiente' // Auxilio recién creado
  | 'Asignada' // Se asignó vehículo/médico/enfermero
  | 'Reasignada' //Se reasignó vehículo/médico/enfermero
  | 'En tránsito' // El vehículo salió del centro
  | 'Llegó a destino' // El vehículo llegó al lugar de la emergencia
  | 'Rumbo a hospital' // El vehículo sale hacia el hospital
  | 'Llegada a hospital' //El vehículo Llegó al hospital
  | 'Finalizada' // La emergencia fue tratada. Ya sea porque se llegó al hospital o no
  | 'Cancelada'; // La emergencia se canceló

export type EstadoEmergenciaBomberos =
  //LLAMADAS DE EMERGENCIA
  | 'Atendida' //La llamada se atendió exitosamente

  //AUXILIOS
  | 'Pendiente' // Auxilio recién creado
  | 'Asignada' // Se asignó vehículo
  | 'Reasignada' //Se reasignó vehículo
  | 'En tránsito' // El vehículo salió del centro
  | 'Llegó a destino' // El vehículo llegó al lugar de la emergencia
  | 'Finalizada' // La emergencia fue tratada
  | 'Cancelada'; // La emergencia se canceló

export interface IContactID {
  numeroCuenta?: string;
  tipoMensaje?: string;
  calificadorDeEvento?: string;
  codigoDeEvento?: string;
  numeroDeParticion?: string;
  numeroDeZona?: string;
  checksum?: string;
}
/* ────────────────────────────────────────────────
 *  VALORES ESPECÍFICOS POR TIPO DE EVENTO
 * ────────────────────────────────────────────────*/

// IValoresEventoOperacional
// Separar en Alarmas - Trackers (Colectivos/Activos/Vehículos) - Luminarias
export interface IValoresEventoBase {
  titulo?: string;
  mensaje?: string;
  color?: string;
  sonido?: SonidoEvento;
}

export interface IValoresEventoTracker extends IValoresEventoBase {
  geojson?: IGeoJSONPoint;
  codigoTracker?: string;
}

export interface IValoresEventoAlarma extends IValoresEventoBase {
  contactId?: IContactID;
  codigoAlarma?: string;
  codigoComunicador?: string;
  tiposEvento?: ('Armado' | 'Desarmado' | 'Detonación' | 'Test')[];
}

export interface IValoresEventoLuminaria extends IValoresEventoBase {
  geojson?: IGeoJSONPoint;
}

export interface IValoresEventoBotonBLE extends IValoresEventoBase {
  geojson?: IGeoJSONPoint;
}

export interface IValoresEventoSirena extends IValoresEventoBase {
  idSirena?: string;
  chipId?: string;
  origen?: 'APP' | 'Botón' | 'Monitoreo'; /// Pánico (APP) - Manual (Botón físico) - Monitoreo (¿Programado o algo así?)
  efecto?: 'Reflector' | 'Sirena' | 'Pánico'; /// Reflector (Luz) - Sirena (Sonido) - Pánico (Luz y Sonido)
  direccion?: string; // Dirección parseada de la sirena
  idVecino?: string;
  nombreVecino?: string;
  telefono?: string; // Solo del vecino
  idUsuario?: string; // Si viene de monitoreo
  usuario?: string; // Si viene de monitoreo
  geojson?: IGeoJSONPoint; /// Ubicación del vecino cuando es APP Sirena en lkos otros casos.
}

// Valores para eventos técnicos
export interface IValoresEventoTecnico extends IValoresEventoBase {
  categoria?: CategoriaTecnica;
  solicitante?: {
    nombre?: string;
    telefono?: string;
    email?: string;
  };
  disponibilidad?: RangoHorario[];
  prioridad?: 'Normal' | 'Alta' | 'Urgente';
  numeroIncidente?: string; // Random cuando se crea.
}

// Valores para eventos de emergencia
export interface IValoresEventoEmergencia extends IValoresEventoBase {
  ubicacionDestino?: DireccionV2;
  motivoCancelacion?: string;
  motivoReasignacion?: string;
  observaciones?: string;
  diagnostico?: string;
}

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
  'Evento Técnico Luminaria': {
    valores: IValoresEventoTecnico;
    estado: EstadoEventoTecnico;
  };
  'Evento Técnico Sirena': {
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
  idsClientesAtendiendo?: string[];
  idsUsuariosAtendiendo?: string[];

  // Populate opcional
  cliente?: ICliente;
  ancestros?: ICliente[];
  // idEntidad
  tracker?: ITracker;
  alarma?: IDispositivoAlarma;
  luminaria?: ILuminaria;
  usuario?: IUsuario;
  activo?: IActivo;
  botonBluetooth?: IBotonBluetooth;
  sirena?: ISirena;
  //
  reporte?: IReporteGenerico;
  configEventoUsuario?: IConfigEventoUsuario;
}

export type DetallesTecnicos = {
  idTecnicoAsignado?: string;
  // Populate opcional
  tecnico?: IUsuario;
};

export type DetallesEmergencias = {
  // Ubicaciones
  idEmergencia?: string;
  idCentroDeAtencion?: string;
  idHospital?: string;

  // Cosas que deberían ser usuarios, pero algunas no lo son.
  idDestinatarioAsistencia?: string;
  idChofer?: string;
  idMovilUsuario?: string;
  idsMedicos?: string[];
  idsEnfermeros?: string[];
  idUsuarioResponsable?: string;
  idMovilAsignado?: string;

  // Populate opcional
  destinatarioAsistencia?: IDestinatarioAsistencia;
  emergencia?: IEmergencia;
  chofer?: IUsuario;
  centroDeAtencion?: ICentroDeAtencion;
  movilUsuario?: IUsuario;
  medicos?: IPersonalSalud[];
  enfermeros?: IPersonalSalud[];
  hospital?: IHospital;
  usuarioResponsable?: IUsuario;
  movilAsignado?: IActivo;
};

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
  | IEventoBaseGenerico<'Evento BotonBLE'>
  | IEventoBaseGenerico<'Evento Sirena'>
  | IEventoBaseGenerico<'Evento Técnico Alarma'>
  | IEventoBaseGenerico<'Evento Técnico Tracker'>
  | IEventoBaseGenerico<'Evento Técnico Luminaria'>
  | IEventoBaseGenerico<'Evento Técnico Sirena'>
  | IEventoBaseGenerico<'Evento Emergencia Médica'>
  | IEventoBaseGenerico<'Evento Emergencia Bomberos'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE - UNIONES DISCRIMINADAS
 * ────────────────────────────────────────────────*/

type OmitirCreate =
  | '_id'
  | 'idsAncestros'
  | 'cliente'
  | 'ancestros'
  | 'tracker'
  | 'alarma'
  | 'luminaria'
  | 'usuario'
  | 'activo'
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
  | Omit<IEventoBaseGenerico<'Evento BotonBLE'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Sirena'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Alarma'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Tracker'>, OmitirCreate>
  | Omit<IEventoBaseGenerico<'Evento Técnico Luminaria'>, OmitirCreate>
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
  | ({ tipoEvento: 'Evento Técnico Luminaria' } & Partial<
      Omit<
        IEventoBaseGenerico<'Evento Técnico Luminaria'>,
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
 *  TIPO CACHE (SIN POPULATE)
 * ────────────────────────────────────────────────*/

export type IEventoGenericoCache = Omit<
  IEventoGenerico,
  | 'cliente'
  | 'ancestros'
  | 'tracker'
  | 'alarma'
  | 'luminaria'
  | 'usuario'
  | 'activo'
  | 'botonBluetooth'
  | 'configEventoUsuario'
  | 'reporte'
  | 'sirena'
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
