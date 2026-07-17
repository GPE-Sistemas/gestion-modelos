import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { GatewaySchema } from './gateway';

export const PeriodoMetricaSchema = z.enum(['hora', 'dia']);
export type PeriodoMetrica = z.infer<typeof PeriodoMetricaSchema>;

/**
 * Métricas agregadas de Time on Air por gateway y canal
 */
export const MetricasGatewaySchema = z.object({
  _id: z.string().optional(),
  /** Referencia al Gateway en MongoDB */
  idGateway: z.string().optional(),
  /** EUI del gateway (para queries directas sin join) */
  gatewayEui: z.string(),
  /** Cliente dueño del dispositivo que generó el uplink (para filtro cross-tenant) */
  idClienteDispositivo: z.string().optional(),
  /** Inicio del periodo de agregación (ISO string) */
  fecha: z.string(),
  /** Granularidad de la agregación */
  periodo: PeriodoMetricaSchema,
  /** Frecuencia/canal en Hz (ej: 915400000) */
  canal: z.number(),

  /** Suma total de Time on Air en milisegundos */
  totalToA: z.number(),
  /** Cantidad de uplinks en el periodo */
  cantidadUplinks: z.number(),

  // Virtuals
  gateway: GatewaySchema.optional(),
  clienteDispositivo: ClienteSchema.optional(),
});
export type IMetricasGateway = z.infer<typeof MetricasGatewaySchema>;

export const CreateMetricasGatewaySchema = MetricasGatewaySchema.omit({
  _id: true,
}).partial();
export type ICreateMetricasGateway = z.infer<
  typeof CreateMetricasGatewaySchema
>;

export const UpdateMetricasGatewaySchema = MetricasGatewaySchema.omit({
  _id: true,
  gatewayEui: true,
  idClienteDispositivo: true,
  fecha: true,
  periodo: true,
  canal: true,
}).partial();
export type IUpdateMetricasGateway = z.infer<
  typeof UpdateMetricasGatewaySchema
>;
