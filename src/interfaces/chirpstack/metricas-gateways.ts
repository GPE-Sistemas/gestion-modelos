import { z } from 'zod';

export const MetricaDatasetSchema = z.object({
  data: z.array(z.number()),
  label: z.string(),
});
export type IMetricaDataset = z.infer<typeof MetricaDatasetSchema>;

export const MetricaItemSchema = z.object({
  datasets: z.array(MetricaDatasetSchema),
  kind: z.string(),
  name: z.string(),
  timestamps: z.array(z.string()),
});
export type IMetricaItem = z.infer<typeof MetricaItemSchema>;

export const MetricasGatewaysSchema = z.object({
  rxPackets: MetricaItemSchema, //Paquetes recibidos
  rxPacketsPerDr: MetricaItemSchema, //Paquetes recibidos por data rate
  rxPacketsPerFreq: MetricaItemSchema, //Paquetes recibidos por frecuencia
  txPackets: MetricaItemSchema, //Paquetes transmitidos
  txPacketsPerDr: MetricaItemSchema, //Paquetes transmitidos por data rate
  txPacketsPerFreq: MetricaItemSchema, //Paquetes transmitidos por frecuencia
  txPacketsPerStatus: MetricaItemSchema, //Paquetes transmitidos por estado
});
export type IMetricasGateways = z.infer<typeof MetricasGatewaysSchema>;

export const AggregationGatewaysMetricsSchema = z.enum([
  'HOUR',
  'DAY',
  'MONTH',
  'MINUTE',
]);
export type aggregationGatewaysMetrics = z.infer<
  typeof AggregationGatewaysMetricsSchema
>;
