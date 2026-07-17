import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ModeloDispositivoSchema } from './modelo-dispositivo';

export const BotonBluetoothSchema = z.object({
  _id: z.string().optional(),
  idModeloDispositivo: z.string().optional(),

  fechaCreacion: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  mac: z.string().optional(),
  serialNumber: z.string().optional(),

  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  modeloDispositivo: ModeloDispositivoSchema.optional(),
});
export type IBotonBluetooth = z.infer<typeof BotonBluetoothSchema>;

export const CreateBotonBluetoothSchema = BotonBluetoothSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateBotonBluetooth = z.infer<typeof CreateBotonBluetoothSchema>;

export const UpdateBotonBluetoothSchema = BotonBluetoothSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateBotonBluetooth = z.infer<typeof UpdateBotonBluetoothSchema>;
