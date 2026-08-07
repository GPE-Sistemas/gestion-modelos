import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { DiaSchema } from './config-evento-usuario';
import type { IUbicacion } from './ubicacion';

export const TipoDeCronogramaSchema = z.enum(['despacho', 'turnos']);
export type TipoDeCronograma = z.infer<typeof TipoDeCronogramaSchema>;

export const PeriodoSchema = z.object({
  desde: z.string().optional(), // Sale
  hasta: z.string().optional(), // Llega
  datos: z.record(z.string(), z.any()).optional(), // Datos extras para el periodo, como el chofer, el vehículo, el usuario, etc
});
export type Periodo = z.infer<typeof PeriodoSchema>;

export const ConfigCronogramaSchema = z.object({
  color: z.string().optional(),
  nombreParaMostrar: z.string().optional(),
});
export type ConfigCronograma = z.infer<typeof ConfigCronogramaSchema>;

export const CronogramaSchema = z
  .object({
    _id: z.string().optional(),
    //
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idUbicacion: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UbicacionSchema' }),
    //
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    automatico: z.boolean().optional(),
    dias: z.array(DiaSchema).optional(),
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    tipo: TipoDeCronogramaSchema.optional(),
    // @Prop({type: [Object]}) en el legacy: Mixed, sin casteo adentro.
    periodos: z.array(PeriodoSchema).optional().meta({ 'x-bson': 'mixed' }),
    //
    // @Prop({type: Object}) en el legacy: Mixed.
    configuracion: ConfigCronogramaSchema.optional().meta({
      'x-bson': 'mixed',
    }), // Colores, el nombre de de lo que se está mostrando, etc
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
    // Populate hacia una union discriminada (IUbicacion): z.custom con el tipo
    // hand-written, NO UbicacionSchema. z.infer del schema union rompe el
    // narrowing por categoria al asignar un doc Mongoose en consumidores.
    ubicacion: z.custom<IUbicacion>().optional().meta({
      'x-populate': {
        ref: 'UbicacionSchema',
        localField: 'idUbicacion',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'cronogramas' });
export type ICronograma = z.infer<typeof CronogramaSchema>;

export const CreateCronogramaSchema = CronogramaSchema.omit({
  _id: true,
  cliente: true,
  ubicacion: true,
});
export type ICreateCronograma = z.infer<typeof CreateCronogramaSchema>;

export const UpdateCronogramaSchema = CronogramaSchema.omit({
  _id: true,
  cliente: true,
  ubicacion: true,
});
export type IUpdateCronograma = z.infer<typeof UpdateCronogramaSchema>;
