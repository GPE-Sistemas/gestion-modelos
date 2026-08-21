import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { DispositivoAlarmaSchema } from './dispositivo-alarma';
import { TrackerSchema } from './tracker';

export const MetodoReenvioSchema = z.enum([
  'Básico',
  'Seguridad Evento Externo',
  'Soflex',
  'Caessat',
  'Cersat',
  'Iron Tracking',
  'Logictracker',
  'Objetivo AVL',
]);
export type MetodoReenvio = z.infer<typeof MetodoReenvioSchema>;

export const ProtocoloSchema = z.enum(['UDP', 'TCP']);
export type Protocolo = z.infer<typeof ProtocoloSchema>;

export const AgrupacionReenvioSchema = z.enum([
  'Todos los trackers del cliente',
  'Todas las alarmas del cliente',
  'Entidad',
]);
export type IAgrupacionReenvio = z.infer<typeof AgrupacionReenvioSchema>;

export const ReglaReenvioSchema = z.object({
  puertoEntrada: z.number().optional(), // Puerto por el cual llegó la data recibida. Para Trackers: TRAX (5031), GTO6 (5023), GPS103 (5001)
  protocoloEntrada: ProtocoloSchema.optional(),
  puertoSalida: z.number().optional(), // Puerto al cual se reenviará la data (definido por el usuario)
  protocoloSalida: ProtocoloSchema.optional(),
  hostSalida: z.string().optional(), // Host al cual se reenviará la data (definido por el usuario)
});
export type IReglaReenvio = z.infer<typeof ReglaReenvioSchema>;

export const SoflexConfigSchema = z.object({
  providerid: z.string().optional(),
  version: z.string().optional(), // v.X.X dice la documentación
});
export type ISoflexConfig = z.infer<typeof SoflexConfigSchema>;

/** Datos propios de cada emergencia declarada en el esquema "Objetivos AVL"
 *  de la DGSPCB. Las credenciales (url + token) NO van acá: son del prestador
 *  y viven en `cliente.config.integracionObjetivosAVL`. */
export const ObjetivoAVLConfigSchema = z.object({
  /** Identificador del dispositivo que reporta la posición. Tiene que ser
   *  EXACTAMENTE el mismo que el operador cargó al dar de alta el Suceso en
   *  e911, o Suite911 no puede vincular la posición a la Carta Policial. */
  deviceid: z.string().optional(),
  /** Número de Carta Policial que originó la emergencia. La API de posiciones
   *  no lo exige, pero el instructivo lo recomienda para trazabilidad y es lo
   *  que se usa para cualquier gestión posterior con Policía de la Ciudad. */
  nroCarta: z.string().optional(),
});
export type IObjetivoAVLConfig = z.infer<typeof ObjetivoAVLConfigSchema>;

export const OpcionesReenvioSchema = z.object({
  metodo: MetodoReenvioSchema.optional(),
  host: z.string().optional(),
  puerto: z.number().optional(),
  apikey: z.string().optional(),
  usuario: z.string().optional(),
  protocolo: ProtocoloSchema.optional(),
  contrasena: z.string().optional(),
  usaReglaReenvio: z.boolean().optional(),
  reglasReenvio: z.array(ReglaReenvioSchema).optional(), //Especifica condiciones de cómo reenviar, dependiendo de cómo llegó la data recibida
  opcionesSoflex: SoflexConfigSchema.optional(),
  opcionesObjetivoAVL: ObjetivoAVLConfigSchema.optional(),
});
export type IOpcionesReenvio = z.infer<typeof OpcionesReenvioSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const ConfigReenvioSchema = z
  .object({
    _id: z.string().optional(),
    activo: z.boolean().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    // Configuracion
    agrupacionReenvio: AgrupacionReenvioSchema.optional(),
    idClienteReenvio: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    // Polimórfico (tracker o dispositivoAlarma según agrupacionReenvio): sin
    // ref fijo en el legacy (@Prop sin `ref`), por eso sin x-ref acá tampoco.
    idEntidadReenvio: z.string().optional().meta({ 'x-bson': 'objectId' }),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    opcionesReenvio: OpcionesReenvioSchema.optional().meta({
      'x-bson': 'mixed',
    }),
    reenviarHijos: z.boolean().optional(), /// solo para trackers o alarmas de clientes hijos del cliente reenvio -- tambien se reenvian los propios
    periodoInicio: z.string().optional().meta({ 'x-bson': 'date' }), // Fecha desde la cual se comenzará a reenviar la data (si no se especifica, se asume que es desde la fecha de creación del reenvío)
    periodoFin: z.string().optional().meta({ 'x-bson': 'date' }), // Fecha hasta la cual se reenviará la data (si no se especifica, se asume que es indefinido)

    // Virtual
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
    clienteReenvio: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idClienteReenvio',
        foreignField: '_id',
        justOne: true,
      },
    }),
    dispositivoAlarma: DispositivoAlarmaSchema.optional().meta({
      'x-populate': {
        ref: 'DispositivoAlarmaSchema',
        localField: 'idEntidadReenvio',
        foreignField: '_id',
        justOne: true,
      },
    }),
    tracker: TrackerSchema.optional().meta({
      'x-populate': {
        ref: 'TrackerSchema',
        localField: 'idEntidadReenvio',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'configreenvios' });
export type IConfigReenvio = z.infer<typeof ConfigReenvioSchema>;

export const CreateConfigReenvioSchema = ConfigReenvioSchema.omit({
  _id: true,
  cliente: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type ICreateConfigReenvio = z.infer<typeof CreateConfigReenvioSchema>;

export const UpdateConfigReenvioSchema = ConfigReenvioSchema.omit({
  _id: true,
  cliente: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type IUpdateConfigReenvio = z.infer<typeof UpdateConfigReenvioSchema>;

export const ConfigReenvioCacheSchema = ConfigReenvioSchema.omit({
  cliente: true,
  ancestros: true,
  clienteReenvio: true,
  dispositivoAlarma: true,
  tracker: true,
});
export type IConfigReenvioCache = z.infer<typeof ConfigReenvioCacheSchema>;
