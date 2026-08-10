import { z } from 'zod';
import { RxInfoSchema, TxInfoSchema } from '../auxiliares';
import { DispositivoLorawanSchema } from './dispositivo-lorawan';

export const TipoLogEventoSchema = z.enum([
  'up',
  'status',
  'join',
  'ack',
  'txack',
  'down',
  'log',
]);
export type TipoLogEvento = z.infer<typeof TipoLogEventoSchema>;

export const MetadatosUplinkSchema = z.object({
  rxInfo: z.array(RxInfoSchema).optional(),
  txInfo: TxInfoSchema.optional(),
  dr: z.number().optional(),
  /** Tiempo en aire (Time on Air) en milisegundos */
  timeOnAir: z.number().optional(),
  /** Tamaño del payload en bytes */
  payloadSize: z.number().optional(),
});
export type IMetadatosUplink = z.infer<typeof MetadatosUplinkSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const LogEventoSchema = z
  .object({
    _id: z.string().optional(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    expireAt: z.string().optional().meta({ 'x-bson': 'date' }),
    tipo: TipoLogEventoSchema.optional(),
    deveui: z.string().optional().meta({ 'x-setter': 'uppercase' }),
    deviceName: z.string().optional().meta({ 'x-setter': 'uppercase' }),
    payload: z.string().optional(),
    puerto: z.number().optional(),
    battery: z.number().optional(),
    fCnt: z.number().optional(),
    margin: z.number().optional(),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    metadatosUplink: MetadatosUplinkSchema.optional().meta({
      'x-bson': 'mixed',
    }),

    // Campos específicos para mensajes de tipo 'log' de ChirpStack
    level: z.string().optional(), // "ERROR", "WARNING", "INFO"
    code: z.string().optional(), // Código del tipo de log (ej: "DOWNLINK_GATEWAY", "UPLINK_F_CNT_RETRANSMISSION")
    description: z.string().optional(), // Descripción del evento
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    context: z.record(z.string(), z.any()).optional().meta({
      'x-bson': 'mixed',
    }), // Contexto adicional del log

    // NO es un populate real: sin @Prop y sin schema.virtual() en el legacy
    // (schema.ts). service.ts:75 hace populate([{ path: 'dispositivoLorawan' }])
    // en el getById, y Mongoose lo rechaza con strictPopulate → 500 SIEMPRE.
    // Documentado en el meta.go de logEventoMqtts. Se deja la propiedad (el
    // shape sigue siendo útil para tipar) pero SIN `x-populate`: anotarlo como
    // populate haría que el generador cree un virtual que funciona de verdad,
    // divergiendo del 500 que el legacy siempre devolvió. El virtual real es
    // "dispositivo", abajo.
    dispositivoLorawan: DispositivoLorawanSchema.optional(),
    // El virtual que el schema legacy declara DE VERDAD. Convive con
    // `dispositivoLorawan` de arriba en vez de reemplazarlo: renombrar sería un
    // cambio de contrato para los consumidores que ya lo piden con ese nombre,
    // y este `dispositivo` es el que realmente resuelve un ?populate.
    dispositivo: DispositivoLorawanSchema.optional().meta({
      'x-populate': {
        ref: 'DispositivoLorawanSchema',
        localField: 'deveui',
        foreignField: 'deveui',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'logeventos' });
export type ILogEvento = z.infer<typeof LogEventoSchema>;

export const CreateLogEventoSchema = LogEventoSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type ICreateLogEvento = z.infer<typeof CreateLogEventoSchema>;

// El OmitirUpdate original incluía 'cliente', que no es una clave de ILogEvento
export const UpdateLogEventoSchema = LogEventoSchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type IUpdateLogEvento = z.infer<typeof UpdateLogEventoSchema>;
