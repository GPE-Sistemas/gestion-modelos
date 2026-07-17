import { IGeoJSONPoint } from '../auxiliares';
import { ICliente, IConfigHorario } from './cliente';
import { NivelObjetivo } from './comando';
import { IConfigPerfil } from './config-perfil';
import { IDispositivoLorawan } from './dispositivo-lorawan';
import { IGrupo } from './grupo';
import { IModeloDispositivo } from './modelo-dispositivo';
import { IPuesta } from './puesta';
import { IReporteBase } from './reporte-generico';

export type EstadoOperativoLuminaria = 'Operativa' | 'Mantenimiento';
export type ITipoEnergizado = 'Continuo' | 'Nocturno'; //Continuo: Siempre reportando, Nocturno: Solo reporta de noche porque a la mañana se apaga porque se le corta la energía

// Estado calculado de funcionamiento (modelo de 6 estados).
// Lo escribe el backend (gestion-lora-luminarias en uplinks + gestion-cron cada 1 min) y lo lee el front. Ver PLAN_ESTADO_LUMINARIAS_BACKEND.md.
//   0 Sin nodo | 1 Error de comunicación | 2 Error de encendido | 3 Alarma |
//   4 Encendida | 5 Apagada
export type CodigoEstadoLuminaria = 0 | 1 | 2 | 3 | 4 | 5;

export interface IEstadoLuminariaCalculado {
  codigo: CodigoEstadoLuminaria;
  encendida: boolean | null;
  motivo?: string; // ej. 'Desenergizada (horario diurno)' — flag persistido hasta el próximo reporte
  alarmas?: string[]; // snapshot de valores.alarmas al momento de evaluar (drilldown)
  fechaEvaluacion: string; // ISO — última vez que se evaluó
  fechaCambio: string; // ISO — desde cuándo está en este código
  fechaCambioEncendida?: string; // ISO — último cambio de `encendida` (on↔off). Para la nocturna desenergizada marca el momento en que el sistema la consideró apagada
  origen: 'uplink' | 'cron';
}

export type MapaValoresReportePeriodico = {
  'Luminaria GPE': IReporteBase<'Luminaria GPE Periódico'>;
  'Luminaria ACTIS FING': IReporteBase<'Luminaria ACTIS FING Estado'>;
};
export type MapaValoresReporteEnergia = {
  'Luminaria GPE': IReporteBase<'Luminaria GPE Energía'>;
  'Luminaria ACTIS FING': IReporteBase<'Luminaria ACTIS FING Energía'>;
};

export type TipoDispositivoLuminaria = keyof MapaValoresReportePeriodico;

export type ILuminaria =
  | ILuminariaGenerica<'Luminaria GPE'>
  | ILuminariaGenerica<'Luminaria ACTIS FING'>;

export interface ILuminariaGenerica<T extends TipoDispositivoLuminaria> {
  _id?: string;
  fechaCreacion?: string; // Default: Date.now
  idCliente?: string;
  idsAncestros?: string[];
  deveui?: string; // Deveui del dispositivo lorawan
  identificacion?: string;
  ubicacion?: IGeoJSONPoint; // GeoJSON de la ubicacion de la luminaria (si hay idPuesta, se coloca la de la puesta)
  direccion?: string; // Direccion de la luminaria
  idModeloDispositivo?: string; // ID del modelo de dispositivo
  idPuesta?: string; // (opcional, solo clientes con moduloLuminarias.usaPuestas)
  idsGrupos?: string[];
  tiempoEncendida?: number; // En horas
  tipoDispositivo?: T; // Tipo de dispositivo (Luminaria GPE, Luminaria ACTIS FING, etc)
  ultimoReportePeriodico?: MapaValoresReportePeriodico[T]; // Ultimo reporte periodico recibido
  ultimoReporteEnergia?: MapaValoresReporteEnergia[T]; // Ultimo reporte energia recibido
  fechaUltimaComunicacion?: string; // Fecha del ultima comunicacion recibida por el dispositivo
  idPerfilConfig?: string;
  tipoEnergizado?: ITipoEnergizado;
  estadoOperativo?: EstadoOperativoLuminaria; // Condición administrativa (Operativa/Mantenimiento)
  estado?: IEstadoLuminariaCalculado; // Estado calculado de funcionamiento (6 estados). Escrito por backend (uplinks + cron); persiste hasta el próximo cambio.

  // Habilitación de Servicio Técnico
  puedeSolicitarServicioTecnico?: boolean; // Si esta luminaria puede recibir servicio técnico
  idsClientesQuePuedenAtenderEventosTecnicos?: string[]; // Clientes habilitados a atender el ST de esta luminaria
  configHorariosAtencionTecnica?: IConfigHorario[]; // Clientes que atienden + ventanas horarias

  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
  clientesQuePuedenAtenderEventosTecnicos?: ICliente[]; // populate de idsClientesQuePuedenAtenderEventosTecnicos
  dispositivo?: IDispositivoLorawan;
  modeloDispositivo?: IModeloDispositivo;
  grupos?: IGrupo[];
  perfilConfig?: IConfigPerfil;
  puesta?: IPuesta;

  // Computado (no persistido): perfil efectivo resuelto por jerarquía
  // (luminaria > grupo por prioridad > puesta > grupo de puestas). Solo se
  // completa cuando la query pide `incluirPerfilEfectivo`.
  perfilEfectivo?: {
    nivel: NivelObjetivo;
    idFuente: string;
    nombre?: string | null;
  } | null;
}

////// CREATE
type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'cliente'
  | 'ancestros'
  | 'dispositivo'
  | 'modeloDispositivo'
  | 'grupos'
  | 'perfilConfig'
  | 'puesta';

export type ICreateLuminaria =
  | Omit<ILuminariaGenerica<'Luminaria GPE'>, OmitirCreate>
  | Omit<ILuminariaGenerica<'Luminaria ACTIS FING'>, OmitirCreate>;

////// UPDATE
type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'idsAncestros'
  | 'cliente'
  | 'ancestros'
  | 'dispositivo'
  | 'modeloDispositivo'
  | 'grupos'
  | 'perfilConfig'
  | 'puesta';

export type IUpdateLuminaria =
  | Omit<ILuminariaGenerica<'Luminaria GPE'>, OmitirUpdate>
  | Omit<ILuminariaGenerica<'Luminaria ACTIS FING'>, OmitirUpdate>;

/**
 * Representa la ubicación de una luminaria con corte de energía
 */
export interface IUbicacionCorteEnergia {
  idLuminaria?: string;
  deveui?: string;
  identificacion?: string;
  coordenadas?: IGeoJSONPoint;
  direccion?: string;
  cantidadCortes?: number;
  primerCorte?: string; // ISO Date string
  ultimoCorte?: string; // ISO Date string
}

/**
 * Representa un día con luminarias que tuvieron cortes de energía
 */
export interface IDiaCorteEnergia {
  dia?: string; // Formato: YYYY-MM-DD
  diaSemana?: number; // 1=Domingo, 2=Lunes, 3=Martes, 4=Miércoles, 5=Jueves, 6=Viernes, 7=Sábado
  nombreDia?: string; // "Lunes", "Martes", "Miércoles", etc.
  luminariasConCorte?: number;
  ubicaciones?: IUbicacionCorteEnergia[];
}

/**
 * Resumen de cortes de energía por semana
 */
export interface IResumenCortesEnergiaSemana {
  dias?: IDiaCorteEnergia[];
  totalLuminariasAfectadas?: number; // Cantidad única de luminarias afectadas en toda la semana
}

// Arma la jerarquía de perfiles/elegibilidad de las luminarias de un objetivo, para que la UI muestre qué luminaria recibe el comando y por qué.
export interface IJerarquiaObjetivo {
  nivel: NivelObjetivo;
  luminarias: IJerarquiaLuminaria[];
  resumenPorTipo: Record<
    string,
    { total: number; elegibles: number; ignoradas: number }
  >;
}

export interface IJerarquiaLuminaria {
  _id: string;
  identificacion?: string;
  deveui?: string;
  tipo: string;
  perfilNivel: NivelObjetivo | null;
  perfilNombre: string | null;
  elegible: boolean;
}

// Cadena ASCENDENTE de jerarquía de UNA luminaria: todos los contenedores por
// encima (la propia luminaria, sus grupos, su puesta, los grupos de la puesta)
// con el perfil que cada uno tiene para el tipo de la luminaria y la prioridad
// (en los grupos). Marca cuál es la FUENTE del perfil efectivo.
export interface INivelJerarquiaLuminaria {
  nivel: NivelObjetivo;
  id: string;
  nombre?: string;
  perfilNombre?: string | null;
  prioridad?: number | null; // solo grupos / grupos de puesta
  esEfectivo: boolean; // este contenedor provee el perfil efectivo
}

export interface IJerarquiaAscendenteLuminaria {
  tipo: string;
  niveles: INivelJerarquiaLuminaria[];
  efectivo: {
    nivel: NivelObjetivo;
    id: string;
    perfilNombre?: string | null;
  } | null;
}
