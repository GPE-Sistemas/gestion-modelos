import { z } from "zod";
import { ClienteSchema } from "./cliente";
import { DispositivoLorawanSchema } from "./dispositivo-lorawan";
import { LuminariaSchema } from "./luminaria";

export const AlertaBotonBLESchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  idDispositivoLorawan: z.string().optional(),
  idLuminaria: z.string().optional(),
  mac: z.string().optional(),

  //Populate
  dispositivoLorawan: DispositivoLorawanSchema.optional(),
  luminaria: LuminariaSchema.optional(),
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type IAlertaBotonBLE = z.infer<typeof AlertaBotonBLESchema>;

export const CreateAlertaBotonBLESchema = AlertaBotonBLESchema.omit({
  _id: true,
  fechaCreacion: true,
});
export type ICreateAlertaBotonBLE = z.infer<typeof CreateAlertaBotonBLESchema>;

export const UpdateAlertaBotonBLESchema = AlertaBotonBLESchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type IUpdateAlertaBotonBLE = z.infer<typeof UpdateAlertaBotonBLESchema>;
