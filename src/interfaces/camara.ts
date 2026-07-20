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

export const CamaraSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  identificacion: z.string().optional(),
  canales: z.array(CanalesCamaraSchema).optional(),
  idModeloDispositivo: z.string().optional(),
  tipo: TipoCamaraSchema.optional(),
  numeroSerie: z.string().optional(),
  host: z.string().optional(),
  puertoRTSP: z.number().optional(),
  puertoHTTP: z.number().optional(),
  usuario: z.string().optional(),
  password: z.string().optional(),
  claveDeEncriptacion: z.string().optional(),
  credencialesDahua: CredencialesDahuaSchema.optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  modeloDispositivo: ModeloDispositivoSchema.optional(),
});
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
