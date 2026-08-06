import { z } from "zod";
import { ClienteSchema } from "./cliente";
import { DispositivoLorawanSchema } from "./dispositivo-lorawan";
import { LuminariaSchema } from "./luminaria";

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const AlertaBotonBLESchema = z
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
    idDispositivoLorawan: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'DispositivoLorawanSchema' }),
    idLuminaria: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'LuminariaSchema' }),
    mac: z.string().optional(),

    //Populate
    dispositivoLorawan: DispositivoLorawanSchema.optional().meta({
      'x-populate': {
        ref: 'DispositivoLorawanSchema',
        localField: 'idDispositivoLorawan',
        foreignField: '_id',
        justOne: true,
      },
    }),
    luminaria: LuminariaSchema.optional().meta({
      'x-populate': {
        ref: 'LuminariaSchema',
        localField: 'idLuminaria',
        foreignField: '_id',
        justOne: true,
      },
    }),
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
  .meta({ 'x-collection': 'alertabotonbles' });
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
