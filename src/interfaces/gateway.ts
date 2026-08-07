import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { GeoJSONPointSchema } from '../auxiliares';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts. Esta es la interfaz del gateway que se va
// a guardar en nuestra base de datos. Va a requerir que ya exista creado el
// gateway en Chirpstack
export const GatewaySchema = z
  .object({
    //Propios de nuestra base de datos
    _id: z.string().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    nombre: z.string().optional(),
    /** true si fue creado automáticamente por el cron de métricas */
    autoCreado: z.boolean().optional(),
    //Propios de Chirpstack
    fechaCreacionChirpstack: z.string().optional(), //Fecha de creación en Chirpstack
    gatewayEui: z.string().optional().meta({ 'x-setter': 'uppercase' }),
    nombreChirpstack: z.string().optional(),
    description: z.string().optional(),
    statsInterval: z.number().optional(),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    ubicacion: GeoJSONPointSchema.optional().meta({ 'x-bson': 'mixed' }), //De Chirpstack vienen en otro formato, pero acá lo guardamos como GeoJSON Point
    tags: z.record(z.string(), z.string()).optional(),
    metadata: z.record(z.string(), z.string()).optional(),

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

    // Estadísticas calculadas por cron (actualización horaria)
    /** ToA promedio por canal en ms de la última hora */
    toaPromedioHora: z.number().optional(),
    /** Estado de salud basado en ToA: ok (<5%), warning (5-17%), error (>17%) */
    estadoSalud: z.enum(['ok', 'warning', 'error']).optional(),
    /** Fecha de última actualización de estadísticas */
    estadisticasActualizadas: z.string().optional(),

    // Snapshot de ENVÍO DE STATS de la última franja de 10 min (cron). Solo los
    // dos crudos; ratio/estado/histórico se derivan/sacan de los IResumenDatos
    // ('Gateway Stats'). INDEPENDIENTE de estadoSalud/ToA.
    /** stats recibidos en la última franja de 10 min */
    statsRecibidos: z.number().optional(),
    /** stats esperados = (rangoMinutos*60) / statsInterval — ej. 600/30 = 20 */
    statsEsperados: z.number().optional(),
  })
  .meta({ 'x-collection': 'gateways' });
export type IGateway = z.infer<typeof GatewaySchema>;

export const CreateGatewaySchema = GatewaySchema.omit({ _id: true });
export type ICreateGateway = z.infer<typeof CreateGatewaySchema>;

export const UpdateGatewaySchema = GatewaySchema.omit({ _id: true });
export type IUpdateGateway = z.infer<typeof UpdateGatewaySchema>;
