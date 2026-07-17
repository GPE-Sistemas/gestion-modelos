import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { GeoJSONPointSchema } from '../auxiliares';

//Esta es la interfaz del gateway que se va a guardar en nuestra base de datos. Va a requerir que ya exista creado el gateway en Chirpstack
export const GatewaySchema = z.object({
  //Propios de nuestra base de datos
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  nombre: z.string().optional(),
  /** true si fue creado automáticamente por el cron de métricas */
  autoCreado: z.boolean().optional(),
  //Propios de Chirpstack
  fechaCreacionChirpstack: z.string().optional(), //Fecha de creación en Chirpstack
  gatewayEui: z.string().optional(),
  nombreChirpstack: z.string().optional(),
  description: z.string().optional(),
  statsInterval: z.number().optional(),
  ubicacion: GeoJSONPointSchema.optional(), //De Chirpstack vienen en otro formato, pero acá lo guardamos como GeoJSON Point
  tags: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional(),

  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),

  // Estadísticas calculadas por cron (actualización horaria)
  /** ToA promedio por canal en ms de la última hora */
  toaPromedioHora: z.number().optional(),
  /** Estado de salud basado en ToA: ok (<5%), warning (5-17%), error (>17%) */
  estadoSalud: z.enum(['ok', 'warning', 'error']).optional(),
  /** Fecha de última actualización de estadísticas */
  estadisticasActualizadas: z.string().optional(),
});
export type IGateway = z.infer<typeof GatewaySchema>;

export const CreateGatewaySchema = GatewaySchema.omit({ _id: true });
export type ICreateGateway = z.infer<typeof CreateGatewaySchema>;

export const UpdateGatewaySchema = GatewaySchema.omit({ _id: true });
export type IUpdateGateway = z.infer<typeof UpdateGatewaySchema>;
