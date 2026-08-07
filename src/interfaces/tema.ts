import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const MotorEfectoFullscreenSchema = z.enum(['particulas']);
export type IMotorEfectoFullscreen = z.infer<
  typeof MotorEfectoFullscreenSchema
>;

export const RangoNumericoSchema = z.object({
  min: z.number(),
  max: z.number(),
});
export type IRangoNumerico = z.infer<typeof RangoNumericoSchema>;

export const DiaMesSchema = z.object({
  mes: z.number(), // 0-11
  dia: z.number(), // 1-31
});
export type IDiaMes = z.infer<typeof DiaMesSchema>;

export const RangoRecurrenteAnualSchema = z.object({
  inicio: DiaMesSchema,
  fin: DiaMesSchema,
});
export type IRangoRecurrenteAnual = z.infer<typeof RangoRecurrenteAnualSchema>;

export const DecalSchema = z.object({
  urlAsset: z.string(),
  tamanoPct: z.number().optional(), // 0-100
});
export type IDecal = z.infer<typeof DecalSchema>;

export const EfectoFullscreenSchema = z.object({
  motor: MotorEfectoFullscreenSchema,
  spriteUrl: z.string(),
  cantidad: z.number(), // 1-128
  velocidad: RangoNumericoSchema, // segundos por ciclo
  tamano: RangoNumericoSchema, // pixeles
  drift: z.number(), // pixeles laterales (0 = caída recta)
  paleta: z.array(z.string()).optional(), // hex tints opcionales
});
export type IEfectoFullscreen = z.infer<typeof EfectoFullscreenSchema>;

export const TemaPayloadSchema = z.object({
  decalAvatar: DecalSchema.optional(),
  decalLogoLogin: DecalSchema.optional(),
  decalTopbar: DecalSchema.optional(),
  decalLogin: DecalSchema.optional(),
  efectoFullscreen: EfectoFullscreenSchema.optional(),
});
export type ITemaPayload = z.infer<typeof TemaPayloadSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const TemaSchema = z
  .object({
    _id: z.string().optional(),
    //
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    activa: z.boolean().optional(),
    // @Prop() pelados en el legacy → String, sin cast.
    fechaInicio: z.string().optional(),
    fechaFin: z.string().optional(),
    // @Prop({type: Object}) en el schema Mongoose legacy: adentro de un Mixed,
    // Mongoose no declara NADA — no castea ni inicializa esos paths. Vale para
    // este campo y para `payload` más abajo.
    diasRecurrentes: RangoRecurrenteAnualSchema.optional().meta({
      'x-bson': 'mixed',
    }),
    prioridad: z.number().optional(), // 0-100
    global: z.boolean().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    payload: TemaPayloadSchema.optional().meta({ 'x-bson': 'mixed' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaActualizacion: z.string().optional().meta({ 'x-bson': 'date' }),
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
  })
  .meta({ 'x-collection': 'temas' });
export type ITema = z.infer<typeof TemaSchema>;

export const CreateTemaSchema = TemaSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});
export type ICreateTema = z.infer<typeof CreateTemaSchema>;

export const UpdateTemaSchema = TemaSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});
export type IUpdateTema = z.infer<typeof UpdateTemaSchema>;

export const TemaCacheSchema = TemaSchema.omit({
  cliente: true,
  ancestros: true,
});
export type ITemaCache = z.infer<typeof TemaCacheSchema>;

export const TemaPublicoSchema = TemaSchema.omit({
  cliente: true,
  ancestros: true,
  idCliente: true,
  idsAncestros: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});
export type ITemaPublico = z.infer<typeof TemaPublicoSchema>;
