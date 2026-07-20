import { z } from 'zod';
import { GeoJSONPointSchema, IGeoJSONPoint } from '../auxiliares';
import {
  ClienteSchema,
  ConfigHorarioSchema,
  IConfigHorario,
  ICliente,
} from './cliente';
import { NivelObjetivo, NivelObjetivoSchema } from './comando';
import type { IConfigPerfil } from './config-perfil';
import type { IDispositivoLorawan } from './dispositivo-lorawan';
import type { IGrupo } from './grupo';
import {
  IModeloDispositivo,
  ModeloDispositivoSchema,
} from './modelo-dispositivo';
import type { IPuesta } from './puesta';
import type { IReporteBase } from './reporte-generico';

export const EstadoOperativoLuminariaSchema = z.enum([
  'Operativa',
  'Mantenimiento',
]);
export type EstadoOperativoLuminaria = z.infer<
  typeof EstadoOperativoLuminariaSchema
>;

export const TipoEnergizadoSchema = z.enum(['Continuo', 'Nocturno']); //Continuo: Siempre reportando, Nocturno: Solo reporta de noche porque a la mañana se apaga porque se le corta la energía
export type ITipoEnergizado = z.infer<typeof TipoEnergizadoSchema>;

// Estado calculado de funcionamiento (modelo de 6 estados).
// Lo escribe el backend (gestion-lora-luminarias en uplinks + gestion-cron cada 1 min) y lo lee el front. Ver PLAN_ESTADO_LUMINARIAS_BACKEND.md.
//   0 Sin nodo | 1 Error de comunicación | 2 Error de encendido | 3 Alarma |
//   4 Encendida | 5 Apagada
export const CodigoEstadoLuminariaSchema = z.literal([0, 1, 2, 3, 4, 5]);
export type CodigoEstadoLuminaria = z.infer<typeof CodigoEstadoLuminariaSchema>;

export const EstadoLuminariaCalculadoSchema = z.object({
  codigo: CodigoEstadoLuminariaSchema,
  encendida: z.boolean().nullable(),
  motivo: z.string().optional(), // ej. 'Desenergizada (horario diurno)' — flag persistido hasta el próximo reporte
  alarmas: z.array(z.string()).optional(), // snapshot de valores.alarmas al momento de evaluar (drilldown)
  fechaEvaluacion: z.string(), // ISO — última vez que se evaluó
  fechaCambio: z.string(), // ISO — desde cuándo está en este código
  fechaCambioEncendida: z.string().optional(), // ISO — último cambio de `encendida` (on↔off). Para la nocturna desenergizada marca el momento en que el sistema la consideró apagada
  origen: z.enum(['uplink', 'cron']),
});
export type IEstadoLuminariaCalculado = z.infer<
  typeof EstadoLuminariaCalculadoSchema
>;

export type MapaValoresReportePeriodico = {
  'Luminaria GPE': IReporteBase<'Luminaria GPE Periódico'>;
  'Luminaria ACTIS FING': IReporteBase<'Luminaria ACTIS FING Estado'>;
};
export type MapaValoresReporteEnergia = {
  'Luminaria GPE': IReporteBase<'Luminaria GPE Energía'>;
  'Luminaria ACTIS FING': IReporteBase<'Luminaria ACTIS FING Energía'>;
};

export type TipoDispositivoLuminaria = keyof MapaValoresReportePeriodico;

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

// Campos comunes a las dos variantes (sin tipoDispositivo/ultimoReporte*, que discriminan)
const LuminariaCamposSchema = z.object({
  _id: z.string().optional(),
  fechaCreacion: z.string().optional(), // Default: Date.now
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  deveui: z.string().optional(), // Deveui del dispositivo lorawan
  identificacion: z.string().optional(),
  ubicacion: GeoJSONPointSchema.optional(), // GeoJSON de la ubicacion de la luminaria (si hay idPuesta, se coloca la de la puesta)
  direccion: z.string().optional(), // Direccion de la luminaria
  idModeloDispositivo: z.string().optional(), // ID del modelo de dispositivo
  idPuesta: z.string().optional(), // (opcional, solo clientes con moduloLuminarias.usaPuestas)
  idsGrupos: z.array(z.string()).optional(),
  tiempoEncendida: z.number().optional(), // En horas
  fechaUltimaComunicacion: z.string().optional(), // Fecha del ultima comunicacion recibida por el dispositivo
  idPerfilConfig: z.string().optional(),
  tipoEnergizado: TipoEnergizadoSchema.optional(),
  estadoOperativo: EstadoOperativoLuminariaSchema.optional(), // Condición administrativa (Operativa/Mantenimiento)
  estado: EstadoLuminariaCalculadoSchema.optional(), // Estado calculado de funcionamiento (6 estados). Escrito por backend (uplinks + cron); persiste hasta el próximo cambio.

  // Habilitación de Servicio Técnico
  puedeSolicitarServicioTecnico: z.boolean().optional(), // Si esta luminaria puede recibir servicio técnico
  idsClientesQuePuedenAtenderEventosTecnicos: z.array(z.string()).optional(), // Clientes habilitados a atender el ST de esta luminaria
  configHorariosAtencionTecnica: z.array(ConfigHorarioSchema).optional(), // Clientes que atienden + ventanas horarias

  // Virtuals
  // Populates intra-SCC como z.custom (import type-only): un schema real acá
  // arrastra el shape completo del ciclo y revienta la serialización de
  // declarations (TS7056) acá y en los consumidores NestJS.
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  clientesQuePuedenAtenderEventosTecnicos: z.array(ClienteSchema).optional(), // populate de idsClientesQuePuedenAtenderEventosTecnicos
  dispositivo: z.custom<IDispositivoLorawan>().optional(),
  modeloDispositivo: ModeloDispositivoSchema.optional(),
  grupos: z.array(z.custom<IGrupo>()).optional(),
  perfilConfig: z.custom<IConfigPerfil>().optional(),
  puesta: z.custom<IPuesta>().optional(),

  // Computado (no persistido): perfil efectivo resuelto por jerarquía
  // (luminaria > grupo por prioridad > puesta > grupo de puestas). Solo se
  // completa cuando la query pide `incluirPerfilEfectivo`.
  perfilEfectivo: z
    .object({
      get nivel() {
        return NivelObjetivoSchema;
      },
      idFuente: z.string(),
      nombre: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

const VarianteLuminariaGPE = LuminariaCamposSchema.extend({
  tipoDispositivo: z.literal('Luminaria GPE').optional(), // Tipo de dispositivo (Luminaria GPE, Luminaria ACTIS FING, etc)
  ultimoReportePeriodico: z
    .custom<IReporteBase<'Luminaria GPE Periódico'>>()
    .optional(), // Ultimo reporte periodico recibido
  ultimoReporteEnergia: z
    .custom<IReporteBase<'Luminaria GPE Energía'>>()
    .optional(), // Ultimo reporte energia recibido
});
const VarianteLuminariaACTISFING = LuminariaCamposSchema.extend({
  tipoDispositivo: z.literal('Luminaria ACTIS FING').optional(), // Tipo de dispositivo (Luminaria GPE, Luminaria ACTIS FING, etc)
  ultimoReportePeriodico: z
    .custom<IReporteBase<'Luminaria ACTIS FING Estado'>>()
    .optional(), // Ultimo reporte periodico recibido
  ultimoReporteEnergia: z
    .custom<IReporteBase<'Luminaria ACTIS FING Energía'>>()
    .optional(), // Ultimo reporte energia recibido
});

export const LuminariaSchema = z.union([
  VarianteLuminariaGPE,
  VarianteLuminariaACTISFING,
]);

/**
 * Tipo legacy hand-written (NO z.infer): el ciclo luminaria ↔ puesta ↔
 * dispositivo-lorawan a través de z.infer mutuos dispara TS2589. La union de
 * ILuminariaGenerica es idéntica en forma y corta el ciclo (interfaces lazy).
 */
export type ILuminaria =
  | ILuminariaGenerica<'Luminaria GPE'>
  | ILuminariaGenerica<'Luminaria ACTIS FING'>;

////// CREATE
const camposOmitidos: {
  _id: true;
  fechaCreacion: true;
  idsAncestros: true;
  cliente: true;
  ancestros: true;
  dispositivo: true;
  modeloDispositivo: true;
  grupos: true;
  perfilConfig: true;
  puesta: true;
} = {
  _id: true,
  fechaCreacion: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
  dispositivo: true,
  modeloDispositivo: true,
  grupos: true,
  perfilConfig: true,
  puesta: true,
};

export const CreateLuminariaSchema = z.union([
  VarianteLuminariaGPE.omit(camposOmitidos),
  VarianteLuminariaACTISFING.omit(camposOmitidos),
]);

type OmitirCreateUpdate =
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
  | Omit<ILuminariaGenerica<'Luminaria GPE'>, OmitirCreateUpdate>
  | Omit<ILuminariaGenerica<'Luminaria ACTIS FING'>, OmitirCreateUpdate>;

////// UPDATE
export const UpdateLuminariaSchema = z.union([
  VarianteLuminariaGPE.omit(camposOmitidos),
  VarianteLuminariaACTISFING.omit(camposOmitidos),
]);
export type IUpdateLuminaria =
  | Omit<ILuminariaGenerica<'Luminaria GPE'>, OmitirCreateUpdate>
  | Omit<ILuminariaGenerica<'Luminaria ACTIS FING'>, OmitirCreateUpdate>;

/**
 * Representa la ubicación de una luminaria con corte de energía
 */
export const UbicacionCorteEnergiaSchema = z.object({
  idLuminaria: z.string().optional(),
  deveui: z.string().optional(),
  identificacion: z.string().optional(),
  coordenadas: GeoJSONPointSchema.optional(),
  direccion: z.string().optional(),
  cantidadCortes: z.number().optional(),
  primerCorte: z.string().optional(), // ISO Date string
  ultimoCorte: z.string().optional(), // ISO Date string
});
export type IUbicacionCorteEnergia = z.infer<
  typeof UbicacionCorteEnergiaSchema
>;

/**
 * Representa un día con luminarias que tuvieron cortes de energía
 */
export const DiaCorteEnergiaSchema = z.object({
  dia: z.string().optional(), // Formato: YYYY-MM-DD
  diaSemana: z.number().optional(), // 1=Domingo, 2=Lunes, 3=Martes, 4=Miércoles, 5=Jueves, 6=Viernes, 7=Sábado
  nombreDia: z.string().optional(), // "Lunes", "Martes", "Miércoles", etc.
  luminariasConCorte: z.number().optional(),
  ubicaciones: z.array(UbicacionCorteEnergiaSchema).optional(),
});
export type IDiaCorteEnergia = z.infer<typeof DiaCorteEnergiaSchema>;

/**
 * Resumen de cortes de energía por semana
 */
export const ResumenCortesEnergiaSemanaSchema = z.object({
  dias: z.array(DiaCorteEnergiaSchema).optional(),
  totalLuminariasAfectadas: z.number().optional(), // Cantidad única de luminarias afectadas en toda la semana
});
export type IResumenCortesEnergiaSemana = z.infer<
  typeof ResumenCortesEnergiaSemanaSchema
>;

export const JerarquiaLuminariaSchema = z.object({
  _id: z.string(),
  identificacion: z.string().optional(),
  deveui: z.string().optional(),
  tipo: z.string(),
  get perfilNivel() {
    return NivelObjetivoSchema.nullable();
  },
  perfilNombre: z.string().nullable(),
  elegible: z.boolean(),
});
export type IJerarquiaLuminaria = z.infer<typeof JerarquiaLuminariaSchema>;

// Arma la jerarquía de perfiles/elegibilidad de las luminarias de un objetivo, para que la UI muestre qué luminaria recibe el comando y por qué.
export const JerarquiaObjetivoSchema = z.object({
  get nivel() {
    return NivelObjetivoSchema;
  },
  luminarias: z.array(JerarquiaLuminariaSchema),
  resumenPorTipo: z.record(
    z.string(),
    z.object({
      total: z.number(),
      elegibles: z.number(),
      ignoradas: z.number(),
    }),
  ),
});
export type IJerarquiaObjetivo = z.infer<typeof JerarquiaObjetivoSchema>;

// Cadena ASCENDENTE de jerarquía de UNA luminaria: todos los contenedores por
// encima (la propia luminaria, sus grupos, su puesta, los grupos de la puesta)
// con el perfil que cada uno tiene para el tipo de la luminaria y la prioridad
// (en los grupos). Marca cuál es la FUENTE del perfil efectivo.
export const NivelJerarquiaLuminariaSchema = z.object({
  get nivel() {
    return NivelObjetivoSchema;
  },
  id: z.string(),
  nombre: z.string().optional(),
  perfilNombre: z.string().nullable().optional(),
  prioridad: z.number().nullable().optional(), // solo grupos / grupos de puesta
  esEfectivo: z.boolean(), // este contenedor provee el perfil efectivo
});
export type INivelJerarquiaLuminaria = z.infer<
  typeof NivelJerarquiaLuminariaSchema
>;

export const JerarquiaAscendenteLuminariaSchema = z.object({
  tipo: z.string(),
  niveles: z.array(NivelJerarquiaLuminariaSchema),
  efectivo: z
    .object({
      get nivel() {
        return NivelObjetivoSchema;
      },
      id: z.string(),
      perfilNombre: z.string().nullable().optional(),
    })
    .nullable(),
});
export type IJerarquiaAscendenteLuminaria = z.infer<
  typeof JerarquiaAscendenteLuminariaSchema
>;
