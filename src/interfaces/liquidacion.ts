import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ClienteExternoSchema, TipoDestinoSchema } from './cliente-externo';
import { MonedaFacturacionSchema } from './facturacion-cliente';
import { TipoCargoSchema } from './precio';
import { CategoriaDispositivoSchema } from './servicio-ofrecido';

export const TipoLiquidacionSchema = z.enum(['Liquidacion', 'NotaCredito']);
export type TipoLiquidacion = z.infer<typeof TipoLiquidacionSchema>;

/**
 * Borrador → Emitida → Cobrada, o Emitida → Anulada. Sólo el Borrador se
 * recalcula y admite ajustes; una emitida no cambia de importe: se corrige con
 * una nota de crédito.
 */
export const EstadoLiquidacionSchema = z.enum([
  'Borrador',
  'Emitida',
  'Cobrada',
  'Anulada',
]);
export type EstadoLiquidacion = z.infer<typeof EstadoLiquidacionSchema>;

/** Snapshot del emisor, congelado al emitir. */
export const EmisorLiquidacionSchema = z.object({
  razonSocial: z.string().optional(),
  cuit: z.string().optional(),
  condicionIVA: z.string().optional(),
  domicilio: z.string().optional(),
  codigoExterno: z.string().optional(),
});
export type IEmisorLiquidacion = z.infer<typeof EmisorLiquidacionSchema>;

/** Snapshot del pagador, congelado al emitir. */
export const DestinoLiquidacionSchema = z.object({
  idCliente: z.string().optional().meta({ 'x-bson': 'objectId' }),
  razonSocial: z.string().optional(),
  cuit: z.string().optional(),
  condicionIVA: z.string().optional(),
  domicilio: z.string().optional(),
  codigoExterno: z.string().optional(),
});
export type IDestinoLiquidacion = z.infer<typeof DestinoLiquidacionSchema>;

/** Componente de un pack, copiado del catálogo. */
export const ComponenteLineaLiquidacionSchema = z.object({
  idServicioOfrecido: z.string().optional().meta({ 'x-bson': 'objectId' }),
  concepto: z.string().optional(),
  codigoExterno: z.string().optional(),
});
export type IComponenteLineaLiquidacion = z.infer<
  typeof ComponenteLineaLiquidacionSchema
>;

export const DetalleLineaLiquidacionSchema = z.object({
  categoria: CategoriaDispositivoSchema.optional(),
  // Quién recibió el servicio de esta línea. Difiere del pagador cuando el
  // documento agrupa destinos con pagadoPor.
  idClienteDestino: z.string().optional().meta({ 'x-bson': 'objectId' }),
  tipoDestino: TipoDestinoSchema.optional(),
  idsContrataciones: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId' }),
  componentes: z.array(ComponenteLineaLiquidacionSchema).optional(),
  // PorCliente: dispositivos que cubre el cargo fijo. Informativo, no multiplica
  cubre: z.number().optional(),
  // Grupo y Todos: la foto de los dispositivos cobrados por esta línea
  idsEntidades: z.array(z.string()).optional().meta({ 'x-bson': 'objectId' }),
  // Precio en otra moneda que la del pagador: el precio unitario original. La
  // línea ya está convertida con el tipo de cambio del documento
  conversion: z
    .object({
      moneda: MonedaFacturacionSchema,
      precioUnitario: z.number(),
    })
    .optional(),
});
export type IDetalleLineaLiquidacion = z.infer<
  typeof DetalleLineaLiquidacionSchema
>;

export const DescuentoLineaLiquidacionSchema = z.object({
  motivo: z.string().optional(),
  importe: z.number(),
});
export type IDescuentoLineaLiquidacion = z.infer<
  typeof DescuentoLineaLiquidacionSchema
>;

/**
 * Línea del documento. Concepto, código, unidad y alícuota se COPIAN del
 * catálogo: la liquidación se explica sola aunque el catálogo cambie.
 * El período de la línea es el servicio que realmente se prestó (prorrateos,
 * cargos de otra periodicidad, cargos únicos de un día) y puede diferir del
 * período del documento.
 */
export const LineaLiquidacionSchema = z.object({
  // Ausente en las líneas de ajuste
  idServicioOfrecido: z.string().optional().meta({ 'x-bson': 'objectId' }),
  codigoExterno: z.string().optional(),
  concepto: z.string(),
  unidad: z.string().optional(),
  tipoCargo: TipoCargoSchema.optional(),
  cantidad: z.number(),
  precioUnitario: z.number(),
  subtotal: z.number(), // Negativo en las líneas de ajuste
  alicuotaIVA: z.number().optional(),
  descuento: DescuentoLineaLiquidacionSchema.optional(),
  periodoInicio: z.string().meta({ 'x-bson': 'date' }),
  periodoFin: z.string().meta({ 'x-bson': 'date' }),
  detalle: DetalleLineaLiquidacionSchema.optional(),

  // Ajuste ocasional de ESTE período (sólo en Borrador)
  esAjuste: z.boolean().optional(),
  motivoAjuste: z.string().optional(), // Obligatorio si esAjuste
  idUsuarioAjuste: z.string().optional().meta({ 'x-bson': 'objectId' }), // Quién lo autorizó
});
export type ILineaLiquidacion = z.infer<typeof LineaLiquidacionSchema>;

/**
 * Tipo de cambio con que se convirtieron los precios en otra moneda: pesos
 * por dólar. Oficial (Comunicación A3500 del BCRA, día hábil anterior al
 * cierre) o cargado a mano en el borrador.
 */
export const TipoCambioLiquidacionSchema = z.object({
  valor: z.number(),
  fecha: z.string(), // Día de la cotización (YYYY-MM-DD)
  fuente: z.enum(['A3500', 'Manual']),
  motivo: z.string().optional(), // Sólo el manual
  idUsuario: z.string().optional().meta({ 'x-bson': 'objectId' }), // Quién lo cargó
});
export type ITipoCambioLiquidacion = z.infer<
  typeof TipoCambioLiquidacionSchema
>;

/** Base imponible por alícuota. El IVA lo calcula el ERP, no Irix. */
export const AlicuotaLiquidacionSchema = z.object({
  alicuota: z.number(),
  base: z.number(),
});
export type IAlicuotaLiquidacion = z.infer<typeof AlicuotaLiquidacionSchema>;

/**
 * Los frenos de la validación del borrador. Impiden emitir; sólo `Variacion` se
 * levanta confirmando con motivo.
 */
export const CodigoValidacionLiquidacionSchema = z.enum([
  'SinPrecio', // Alguna línea sin precio resuelto
  'CategoriaEnCero', // Una categoría cae a 0 teniendo dispositivos
  'Variacion', // Variación contra el período anterior mayor al umbral
  'SinDatosFiscales', // Falta CUIT o condición IVA del pagador
  'TotalCero', // Total 0 con contrataciones activas
  'Duplicado', // Una contratación ya cobrada por el mismo lapso
  'CadenaPagadores', // pagadoPor apunta a un pagador que a su vez tiene pagadoPor
  'SinCotizacion', // Hay precios en otra moneda y no hay tipo de cambio para convertirlos
  'Conversion', // Se convirtieron precios de otra moneda: se confirma que corresponde
  'NetoNegativo', // Los descuentos superan a lo facturado
]);
export type CodigoValidacionLiquidacion = z.infer<
  typeof CodigoValidacionLiquidacionSchema
>;

export const ValidacionLiquidacionSchema = z.object({
  codigo: CodigoValidacionLiquidacionSchema,
  mensaje: z.string(),
  confirmable: z.boolean().optional(), // Se puede levantar confirmando con motivo
  confirmada: z.boolean().optional(),
  motivoConfirmacion: z.string().optional(),
  idUsuarioConfirmacion: z.string().optional().meta({ 'x-bson': 'objectId' }),
  // Qué hay que abrir para resolverla: el producto sin precio, la liquidación
  // que ya cobró lo mismo o el destino sin datos fiscales
  ref: z
    .object({
      tipo: z.enum(['producto', 'liquidacion', 'destino']),
      id: z.string(),
    })
    .optional(),
});
export type IValidacionLiquidacion = z.infer<
  typeof ValidacionLiquidacionSchema
>;

/**
 * El documento cobrable. Autosuficiente: una vez
 * emitida se lee, no se recalcula.
 * - idCliente + idsAncestros: el EMISOR.
 * - idClienteDestino (+ tipoDestino): el PAGADOR, a quién se le emite.
 *
 * periodoInicio/periodoFin del documento son el envolvente de sus líneas
 * (campo fiscal obligatorio para Concepto = Servicios).
 */
export const LiquidacionSchema = z
  .object({
    _id: z.string().optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idCliente: z //El cliente emisor
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    // El PAGADOR: ICliente o IClienteExterno según tipoDestino
    idClienteDestino: z.string().meta({ 'x-bson': 'objectId' }),
    tipoDestino: TipoDestinoSchema.optional(), // Default 'Cliente'

    // Lo asigna gestion-datos-go al crear (colección `counters`)
    numero: z.string().optional(),
    tipo: TipoLiquidacionSchema,
    // Si es nota de crédito: la liquidación que corrige
    idLiquidacionOrigen: z.string().optional().meta({ 'x-bson': 'objectId' }),

    periodoInicio: z.string().meta({ 'x-bson': 'date' }),
    periodoFin: z.string().meta({ 'x-bson': 'date' }),
    fechaEmision: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaVencimiento: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaCobro: z.string().optional().meta({ 'x-bson': 'date' }),
    moneda: MonedaFacturacionSchema,
    cotizacion: z.number().optional(),

    // Snapshots congelados al emitir
    emisor: EmisorLiquidacionSchema.optional(),
    destino: DestinoLiquidacionSchema.optional(),

    lineas: z.array(LineaLiquidacionSchema),

    subtotal: z.number(),
    descuentos: z.number(),
    neto: z.number(),
    porAlicuota: z.array(AlicuotaLiquidacionSchema),

    estado: EstadoLiquidacionSchema,
    nroComprobanteExterno: z.string().optional(), // Para conciliar con el ERP
    advertencias: z.array(z.string()).optional(),
    tipoCambio: TipoCambioLiquidacionSchema.optional(), // Si se convirtió algún precio

    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
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
  .meta({ 'x-collection': 'liquidaciones' });
export type ILiquidacion = z.infer<typeof LiquidacionSchema>;

export const CreateLiquidacionSchema = LiquidacionSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
  ancestros: true,
  clienteDestino: true,
  clienteExternoDestino: true,
});
export type ICreateLiquidacion = z.infer<typeof CreateLiquidacionSchema>;

export const UpdateLiquidacionSchema = LiquidacionSchema.omit({
  _id: true,
  fechaCreacion: true,
  idCliente: true,
  idsAncestros: true,
  cliente: true,
  ancestros: true,
  clienteDestino: true,
  clienteExternoDestino: true,
}).partial();
export type IUpdateLiquidacion = z.infer<typeof UpdateLiquidacionSchema>;
