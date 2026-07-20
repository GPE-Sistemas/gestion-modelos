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
});
export type IOpcionesReenvio = z.infer<typeof OpcionesReenvioSchema>;

export const ConfigReenvioSchema = z.object({
  _id: z.string().optional(),
  activo: z.boolean().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  // Configuracion
  agrupacionReenvio: AgrupacionReenvioSchema.optional(),
  idClienteReenvio: z.string().optional(),
  idEntidadReenvio: z.string().optional(),
  opcionesReenvio: OpcionesReenvioSchema.optional(),
  reenviarHijos: z.boolean().optional(), /// solo para trackers o alarmas de clientes hijos del cliente reenvio -- tambien se reenvian los propios
  periodoInicio: z.string().optional(), // Fecha desde la cual se comenzará a reenviar la data (si no se especifica, se asume que es desde la fecha de creación del reenvío)
  periodoFin: z.string().optional(), // Fecha hasta la cual se reenviará la data (si no se especifica, se asume que es indefinido)

  // Virtual
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  clienteReenvio: ClienteSchema.optional(),
  dispositivoAlarma: DispositivoAlarmaSchema.optional(),
  tracker: TrackerSchema.optional(),
});
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
