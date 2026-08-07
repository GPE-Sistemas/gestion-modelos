import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { GatewaySchema } from './gateway';

export const PeriodoMetricaSchema = z.enum(['hora', 'dia']);
export type PeriodoMetrica = z.infer<typeof PeriodoMetricaSchema>;

/**
 * Métricas agregadas de Time on Air por gateway y canal
 */
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const MetricasGatewaySchema = z
  .object({
    _id: z.string().optional(),
    /** Referencia al Gateway en MongoDB */
    idGateway: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'GatewaySchema' }),
    /** EUI del gateway (para queries directas sin join) */
    gatewayEui: z.string().meta({ 'x-setter': 'uppercase' }),
    /** Cliente dueño del dispositivo que generó el uplink (para filtro cross-tenant) */
    idClienteDispositivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    /** Inicio del periodo de agregación (ISO string) */
    fecha: z.string().meta({ 'x-bson': 'date' }),
    /** Granularidad de la agregación */
    periodo: PeriodoMetricaSchema,
    /** Frecuencia/canal en Hz (ej: 915400000) */
    canal: z.number(),

    /** Suma total de Time on Air en milisegundos */
    totalToA: z.number(),
    /** Cantidad de uplinks en el periodo */
    cantidadUplinks: z.number(),

    // Virtuals
    gateway: GatewaySchema.optional().meta({
      'x-populate': {
        ref: 'GatewaySchema',
        localField: 'idGateway',
        foreignField: '_id',
        justOne: true,
      },
    }),
    clienteDispositivo: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idClienteDispositivo',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'metricasgateways' });
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
