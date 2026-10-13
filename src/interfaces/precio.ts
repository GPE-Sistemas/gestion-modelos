import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ClienteExternoSchema, TipoDestinoSchema } from './cliente-externo';
import { MonedaFacturacionSchema } from './facturacion-cliente';
import { ServicioOfrecidoSchema } from './servicio-ofrecido';

/**
 * Cada cuánto se cobra el cargo:
 * - Recurrente: en cada ciclo (requiere `periodicidad`).
 * - UnicaVez: una sola vez por contratación (instalación, alta).
 * - PorUso: por evento medido.
 */
export const TipoCargoSchema = z.enum(['Recurrente', 'UnicaVez', 'PorUso']);
export type TipoCargo = z.infer<typeof TipoCargoSchema>;

export const PeriodicidadPrecioSchema = z.enum([
  'Mensual',
  'Bimestral',
  'Trimestral',
  'Semestral',
  'Anual',
]);
export type PeriodicidadPrecio = z.infer<typeof PeriodicidadPrecioSchema>;

/**
 * Desde cuándo se cuenta el ciclo de un cargo recurrente.
 * - Calendario: alineado al año natural; los ciclos anidan y los cargos se
 *   agrupan solos en menos documentos. Default.
 * - FechaAlta: corre desde el alta de cada contratación.
 */
export const AnclaCicloSchema = z.enum(['Calendario', 'FechaAlta']);
export type AnclaCiclo = z.infer<typeof AnclaCicloSchema>;

/**
 * De qué depende el importe (eje ortogonal a tipoCargo):
 * - PorUnidad: cantidad × precio. Una contratación por dispositivo.
 * - PorCliente: precio fijo, ignora la cantidad. Una contratación por cliente
 *   (idEntidad = null).
 * - Escalonado: suma de tramos de `escalas`. Una contratación por dispositivo.
 * - Volumen: cantidad × precio del tramo en que cae. Una contratación por
 *   dispositivo.
 */
export const ModoPrecioSchema = z.enum([
  'PorUnidad',
  'PorCliente',
  'Escalonado',
  'Volumen',
]);
export type ModoPrecio = z.infer<typeof ModoPrecioSchema>;

export const EscalaPrecioSchema = z.object({
  desde: z.number(),
  hasta: z.number().optional(), // Ausente = sin tope
  precio: z.number(),
});
export type IEscalaPrecio = z.infer<typeof EscalaPrecioSchema>;

export const TipoDescuentoSchema = z.enum(['Porcentaje', 'ImporteFijo']);
export type TipoDescuento = z.infer<typeof TipoDescuentoSchema>;

/** Descuento estructural: se repite en cada período en que aplica. */
export const DescuentoPrecioSchema = z.object({
  tipo: TipoDescuentoSchema,
  valor: z.number(),
  motivo: z.string().optional(),
  // Bonificación temporal
  desde: z.string().optional().meta({ 'x-bson': 'date' }),
  hasta: z.string().optional().meta({ 'x-bson': 'date' }),
  // "10% a partir de 100 dispositivos": el umbral se evalúa sobre el total del
  // servicio, no por línea
  porCantidadDesde: z.number().optional(),
});
export type IDescuentoPrecio = z.infer<typeof DescuentoPrecioSchema>;

export const TipoAjustePrecioSchema = z.enum(['PorcentajeFijo', 'IPC']);
export type TipoAjustePrecio = z.infer<typeof TipoAjustePrecioSchema>;

export const FrecuenciaAjustePrecioSchema = z.enum([
  'Trimestral',
  'Semestral',
  'Anual',
]);
export type FrecuenciaAjustePrecio = z.infer<
  typeof FrecuenciaAjustePrecioSchema
>;

/**
 * Actualización automática: al llegar `proximoAjuste` se cierra el precio
 * vigente y se crea el siguiente (nunca se edita en el lugar).
 */
export const AjustePrecioSchema = z.object({
  tipo: TipoAjustePrecioSchema,
  valor: z.number().optional(), // Porcentaje, para 'PorcentajeFijo'
  frecuencia: FrecuenciaAjustePrecioSchema,
  proximoAjuste: z.string().optional().meta({ 'x-bson': 'date' }),
});
export type IAjustePrecio = z.infer<typeof AjustePrecioSchema>;

/**
 * Cuánto cuesta un servicio y cómo se calcula (ProductOfferingPrice, TMF620).
 * - idCliente + idsAncestros: el EMISOR que publica el precio.
 * - idClienteDestino (+ tipoDestino): a quién. Ausente = precio de lista del
 *   emisor.
 *
 * Los precios NO se editan, se versionan: cambiar un precio es cerrar el
 * vigente con `vigenciaHasta` y crear el siguiente.
 */
export const PrecioSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z //Emisor
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

    idServicioOfrecido: z //A qué servicio ofrecido se aplica este precio
      .string()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ServicioOfrecidoSchema' }),
    // A QUIÉN: ICliente o IClienteExterno según tipoDestino. Ausente = lista
    idClienteDestino: z.string().optional().meta({ 'x-bson': 'objectId' }), //Para qué cliente es este precio
    tipoDestino: TipoDestinoSchema.optional(), // Si es un cliente de los cargados en el sistema o es un cliente externo. Default 'Cliente'

    // — Naturaleza del cargo —
    tipoCargo: TipoCargoSchema,
    periodicidad: PeriodicidadPrecioSchema.optional(), // Requerida si tipoCargo es 'Recurrente': de acá sale cuándo se emite
    anclaCiclo: AnclaCicloSchema.optional(), // Default 'Calendario'

    // — Cómo se calcula —
    modo: ModoPrecioSchema,
    precio: z.number().optional(), // PorUnidad y PorCliente
    escalas: z.array(EscalaPrecioSchema).optional(), // Escalonado y Volumen
    minimoFacturable: z.number().optional(),

    moneda: MonedaFacturacionSchema,

    descuento: DescuentoPrecioSchema.optional(),
    ajuste: AjustePrecioSchema.optional(),

    vigenciaDesde: z.string().meta({ 'x-bson': 'date' }),
    vigenciaHasta: z.string().optional().meta({ 'x-bson': 'date' }),

    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z
      .array(ClienteSchema)
      .optional()
      .meta({
        'x-populate': {
          ref: 'ClienteSchema',
          localField: 'idsAncestros',
          foreignField: '_id',
          justOne: false,
        },
      }),
    servicioOfrecido: ServicioOfrecidoSchema.optional().meta({
      'x-populate': {
        ref: 'ServicioOfrecidoSchema',
        localField: 'idServicioOfrecido',
        foreignField: '_id',
        justOne: true,
      },
    }),
    // Sólo uno de los dos resuelve, según tipoDestino
    clienteDestino: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idClienteDestino',
        foreignField: '_id',
        justOne: true,
      },
    }),
    clienteExternoDestino: ClienteExternoSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteExternoSchema',
        localField: 'idClienteDestino',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'precios' });
export type IPrecio = z.infer<typeof PrecioSchema>;

export const CreatePrecioSchema = PrecioSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  servicioOfrecido: true,
  clienteDestino: true,
  clienteExternoDestino: true,
});
export type ICreatePrecio = z.infer<typeof CreatePrecioSchema>;

// Un precio no se edita: el update existe para cerrar la vigencia
// (vigenciaHasta) y para el ajuste automático (ajuste.proximoAjuste).
export const UpdatePrecioSchema = PrecioSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  servicioOfrecido: true,
  clienteDestino: true,
  clienteExternoDestino: true,
}).partial();
export type IUpdatePrecio = z.infer<typeof UpdatePrecioSchema>;
