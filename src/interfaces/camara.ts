import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ModeloDispositivoSchema } from './modelo-dispositivo';

export const TipoHabilitacionSchema = z.enum(['Siempre', 'Con Evento']);
export type TipoHabilitacion = z.infer<typeof TipoHabilitacionSchema>;

export const TipoCamaraSchema = z.enum([
  'Hikvision',
  'Dahua',
  'Hikvision P2P',
  'Dahua P2P',
]);
export type TipoCamara = z.infer<typeof TipoCamaraSchema>;

export const CanalesCamaraSchema = z.object({
  numero: z.string(), // 1
  ids: z.array(
    z.object({
      id: z.string(),
      width: z.number(),
      height: z.number(),
    }),
  ),
  idModeloDispositivo: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  tipoHabilitacion: TipoHabilitacionSchema.optional(),

  // populate
  modeloDispositivo: ModeloDispositivoSchema.optional(),
});
export type ICanalesCamara = z.infer<typeof CanalesCamaraSchema>;

export const CredencialesDahuaSchema = z.object({
  acceskeyDahua: z.string().optional(),
  secretKeyDahua: z.string().optional(),
  productID: z.string().optional(),
});
export type ICredencialesDahua = z.infer<typeof CredencialesDahuaSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const CamaraSchema = z
  .object({
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
    identificacion: z.string().optional(),
    // @Prop({type: [Object]}) en el legacy: cada elemento es Mixed, Mongoose
    // no castea adentro.
    canales: z.array(CanalesCamaraSchema).optional().meta({
      'x-bson': 'mixed',
    }),
    idModeloDispositivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ModeloDispositivoSchema' }),
    tipo: TipoCamaraSchema.optional(),
    numeroSerie: z.string().optional(),
    host: z.string().optional(),
    puertoRTSP: z.number().optional(),
    puertoHTTP: z.number().optional(),
    usuario: z.string().optional(),
    password: z.string().optional(),
    claveDeEncriptacion: z.string().optional(),
    // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
    credencialesDahua: CredencialesDahuaSchema.optional().meta({
      'x-bson': 'mixed',
    }),
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
    modeloDispositivo: ModeloDispositivoSchema.optional().meta({
      'x-populate': {
        ref: 'ModeloDispositivoSchema',
        localField: 'idModeloDispositivo',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'camaras' });
export type ICamara = z.infer<typeof CamaraSchema>;

export const CreateCamaraSchema = CamaraSchema.omit({
  _id: true,
  cliente: true,
  modeloDispositivo: true,
});
export type ICreateCamara = z.infer<typeof CreateCamaraSchema>;

export const UpdateCamaraSchema = CamaraSchema.omit({
  _id: true,
  cliente: true,
  modeloDispositivo: true,
});
export type IUpdateCamara = z.infer<typeof UpdateCamaraSchema>;
