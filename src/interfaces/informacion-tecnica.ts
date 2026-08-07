import { z } from "zod";

export const InfoEndPointSchema = z.object({
  url: z.string().optional(),
  ip: z.string().optional(),
  puerto: z
    .array(
      z.object({
        protocolo: z.string(),
        info: z.string().optional(),
        puerto: z.string(),
      }),
    )
    .optional(),
});
export type IInfoEndPoint = z.infer<typeof InfoEndPointSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const InformacionTecnicaSchema = z.object({
  _id: z.string().optional(),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  // @Prop({type: Object}) en el legacy: Mixed — escalar para Mongoose pese al
  // array de TS (exento en arraysQueNoSonArrays de gestion-datos-go).
  infoEndPoints: z
    .array(InfoEndPointSchema)
    .optional()
    .meta({ 'x-bson': 'mixed' }),
}).meta({ 'x-collection': 'informaciontecnicas' });
export type IInformacionTecnica = z.infer<typeof InformacionTecnicaSchema>;

export const CreateInformacionTecnicaSchema = InformacionTecnicaSchema.omit({
  _id: true,
});
export type ICreateInformacionTecnica = z.infer<
  typeof CreateInformacionTecnicaSchema
>;

export const UpdateInformacionTecnicaSchema = InformacionTecnicaSchema.omit({
  _id: true,
});
export type IUpdateInformacionTecnica = z.infer<
  typeof UpdateInformacionTecnicaSchema
>;
