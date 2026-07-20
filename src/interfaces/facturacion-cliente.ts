import { z } from 'zod';
import { ClienteSchema, TipoClienteSchema } from './cliente';

export const MonedaFacturacionSchema = z.enum(['ARS', 'USD']);
export type MonedaFacturacion = z.infer<typeof MonedaFacturacionSchema>;

export const FacturacionClienteSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  activa: z.boolean().optional(),
  /**
   * Si true, el cliente no se cobra: su costo se descuenta del cliente
   * facturable padre (línea de bonificación). Si false/undefined y el
   * cliente no es nivel 1, se considera raíz independiente de facturación.
   */
  bonificado: z.boolean().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IFacturacionCliente = z.infer<typeof FacturacionClienteSchema>;

export const CreateFacturacionClienteSchema = FacturacionClienteSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
});
export type ICreateFacturacionCliente = z.infer<
  typeof CreateFacturacionClienteSchema
>;

export const UpdateFacturacionClienteSchema = FacturacionClienteSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
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
