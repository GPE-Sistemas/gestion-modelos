import { z } from 'zod';
import { ClienteSchema, TipoClienteSchema } from './cliente';
import { ClienteExternoSchema, TipoDestinoSchema } from './cliente-externo';

export const MonedaFacturacionSchema = z.enum(['ARS', 'USD']);
export type MonedaFacturacion = z.infer<typeof MonedaFacturacionSchema>;

/**
 * Adelantado: el documento se emite al INICIO del ciclo del cargo.
 * Vencido: al FINAL.
 */
export const MomentoFacturacionSchema = z.enum(['Adelantado', 'Vencido']);
export type MomentoFacturacion = z.infer<typeof MomentoFacturacionSchema>;

/**
 * Datos fiscales del destino en la relación (emisor, destino). `codigoExterno`
 * es el código del destino en el ERP de ESTE emisor. Los del propio emisor
 * salen de su config consigo mismo (idCliente = idClienteDestino = emisor).
 */
export const DatosFiscalesFacturacionSchema = z.object({
  razonSocial: z.string().optional(),
  cuit: z.string().optional(),
  condicionIVA: z.string().optional(),
  domicilio: z.string().optional(),
  codigoExterno: z.string().optional(),
});
export type IDatosFiscalesFacturacion = z.infer<
  typeof DatosFiscalesFacturacionSchema
>;

/**
 * Configuración de facturación de UNA relación (emisor, destino).
 * - idCliente + idsAncestros: el EMISOR, quien ofrece y cobra.
 * - idClienteDestino (+ tipoDestino): el cliente al que se le presta el
 *   servicio.
 * Si `pagadoPor` está seteado, de esta config sólo cuentan idClienteDestino,
 * pagadoPor y activa: el resto lo define la config (emisor, pagador).
 */
export const FacturacionClienteSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z //El EMISOR, quien ofrece y cobra
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    // El DESTINO: ICliente o IClienteExterno según tipoDestino (sin x-ref:
    // apunta a dos colecciones; ver los populates clienteDestino /
    // clienteExternoDestino)
    idClienteDestino: z.string().optional().meta({ 'x-bson': 'objectId' }),
    tipoDestino: TipoDestinoSchema.optional(), // Default 'Cliente'
    activa: z.boolean().optional(),
    /**
     * Si true, el cliente no se cobra: su costo se descuenta del cliente
     * facturable padre (línea de bonificación). Si false/undefined y el
     * cliente no es nivel 1, se considera raíz independiente de facturación.
     */
    bonificado: z.boolean().optional(),

    // — Quién paga —
    // "Esta facturación la paga otro destino" (ICliente o IClienteExterno).
    // Ausente = la paga el propio destino. Sin cadenas: un pagador no puede
    // tener a su vez pagadoPor.
    pagadoPor: z.string().optional().meta({ 'x-bson': 'objectId' }),

    // — Cómo se le factura (rige sólo en la config del pagador) —
    moneda: MonedaFacturacionSchema.optional(),
    // Tope de espera de un cargo UnicaVez pendiente sin documento a la vista.
    // Pasado el plazo se emite un documento sólo con el cargo. Default 30.
    diasMaxEsperaCargoUnico: z.number().optional(),
    momento: MomentoFacturacionSchema.optional(),
    diasVencimiento: z.number().optional(), // Días desde la emisión hasta el vencimiento de pago
    condicionPago: z.string().optional(), // Texto libre para el ERP: "30 días", "contado"
    prorratearAltas: z.boolean().optional(),
    prorratearBajas: z.boolean().optional(),
    // Precio con vigencia a mitad de período: false (default) = rige el
    // precio vigente al inicio; true = la línea se parte por tramos
    prorratearCambiosDePrecio: z.boolean().optional(),
    // Habilita al nivel 0 a ver el detalle con importes. Default false
    permitirVisibilidadPlataforma: z.boolean().optional(),

    // — Fiscal —
    datosFiscales: DatosFiscalesFacturacionSchema.optional(),

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
  .meta({ 'x-collection': 'facturacionclientes' });
export type IFacturacionCliente = z.infer<typeof FacturacionClienteSchema>;

export const CreateFacturacionClienteSchema = FacturacionClienteSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  clienteDestino: true,
  clienteExternoDestino: true,
});
export type ICreateFacturacionCliente = z.infer<
  typeof CreateFacturacionClienteSchema
>;

export const UpdateFacturacionClienteSchema = FacturacionClienteSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  clienteDestino: true,
  clienteExternoDestino: true,
});
export type IUpdateFacturacionCliente = z.infer<
  typeof UpdateFacturacionClienteSchema
>;

/* ────────────────────────────────────────────────
 *  FACTURACIÓN EN CURSO (estimado vs real del mes)
 * ────────────────────────────────────────────────*/

/**
 * Detalle por categoría de la facturación en curso (solo cantidades).
 * - total: dispositivos totales del cliente.
 * - activos: los que cuentan (trackers/alarmas con reporte en el mes;
 *   cámaras = total).
 */
export const CategoriaFacturacionEnCursoSchema = z.object({
  total: z.number(),
  activos: z.number(),
});
export type ICategoriaFacturacionEnCurso = z.infer<
  typeof CategoriaFacturacionEnCursoSchema
>;

/** Aporte/descuento de un cliente al total del cliente facturable. */
export const DetalleClienteFacturacionSchema = z.object({
  idCliente: z.string(),
  nombre: z.string().optional(),
  tipoCliente: TipoClienteSchema.optional(),
  costoEstimado: z.number(),
  costoReal: z.number(),
  /** Total del resumen del mes pasado de ese cliente (puede no existir → 0). */
  costoPasado: z.number().optional(),
  /** Cantidades de dispositivos del cliente (activos = consolidados). */
  cantidades: z
    .object({
      trackers: z.object({ total: z.number(), activos: z.number() }),
      alarmas: z.object({ total: z.number(), activos: z.number() }),
      camaras: z.object({ total: z.number() }),
    })
    .optional(),
  /**
   * Desglose del mes pasado por categoría (del resumen guardado del
   * facturable; puede no existir en resúmenes viejos).
   */
  pasado: z
    .object({
      trackers: z
        .object({
          cantidad: z.number().optional(),
          subtotal: z.number().optional(),
        })
        .optional(),
      alarmas: z
        .object({
          cantidad: z.number().optional(),
          subtotal: z.number().optional(),
        })
        .optional(),
      camaras: z
        .object({
          cantidad: z.number().optional(),
          subtotal: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});
export type IDetalleClienteFacturacion = z.infer<
  typeof DetalleClienteFacturacionSchema
>;

export const FacturacionEnCursoSchema = z.object({
  idCliente: z.string(),
  periodoInicio: z.string(), // ISO, inicio del mes en curso
  // Categorías y totales = NETO (lo que efectivamente paga el cliente).
  trackers: CategoriaFacturacionEnCursoSchema,
  alarmas: CategoriaFacturacionEnCursoSchema,
  camaras: CategoriaFacturacionEnCursoSchema,
  totalEstimado: z.number(),
  totalReal: z.number(),
  /** Descuento por clientes hijos bonificados (bruto = neto + bonificación). */
  bonificacion: z.object({
    totalEstimado: z.number(),
    totalReal: z.number(),
  }),
  /**
   * Costo real del mes pasado por categoría (del resumen ya creado para el
   * cliente; puede no existir → 0), para comparar contra el estimado actual.
   */
  mesPasado: z.object({
    trackers: z.number(),
    alarmas: z.number(),
    camaras: z.number(),
    total: z.number(),
    /** Cantidades facturadas del mes anterior (del resumen), por categoría. */
    cantidades: z
      .object({
        trackers: z.number(),
        alarmas: z.number(),
        camaras: z.number(),
      })
      .optional(),
  }),
  /** Aporte de cada hijo directo (no bonificado, no raíz independiente). */
  hijos: z.array(DetalleClienteFacturacionSchema),
  /** Detalle de cada cliente bonificado (descontado del total). */
  bonificados: z.array(DetalleClienteFacturacionSchema),
});
export type IFacturacionEnCurso = z.infer<typeof FacturacionEnCursoSchema>;
