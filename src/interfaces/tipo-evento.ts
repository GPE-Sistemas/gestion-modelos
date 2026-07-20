import { z } from "zod";
import { ClienteSchema } from "./cliente";

export const CategoriaTipoEventoSchema = z.enum([
  "Alarma",
  "Tracker",
  "Luminaria",
]);
export type ICategoriaTipoEvento = z.infer<typeof CategoriaTipoEventoSchema>;

export const TipoEventoSchema = z.object({
  _id: z.string().optional(),
  //
  nombre: z.string().optional(),
  categoria: CategoriaTipoEventoSchema.optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  default: z.boolean().optional(),
  global: z.boolean().optional(),
  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type ITipoEvento = z.infer<typeof TipoEventoSchema>;

export const CreateTipoEventoSchema = TipoEventoSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateTipoEvento = z.infer<typeof CreateTipoEventoSchema>;

export const UpdateTipoEventoSchema = TipoEventoSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateTipoEvento = z.infer<typeof UpdateTipoEventoSchema>;

export const TipoEventoCacheSchema = TipoEventoSchema.omit({
  cliente: true,
  ancestros: true,
});
export type ITipoEventoCache = z.infer<typeof TipoEventoCacheSchema>;
