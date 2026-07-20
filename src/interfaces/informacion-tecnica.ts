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

export const InformacionTecnicaSchema = z.object({
  _id: z.string().optional(),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  infoEndPoints: z.array(InfoEndPointSchema).optional(),
});
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
