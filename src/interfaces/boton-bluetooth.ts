import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ModeloDispositivoSchema } from './modelo-dispositivo';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const BotonBluetoothSchema = z
  .object({
    _id: z.string().optional(),
    idModeloDispositivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ModeloDispositivoSchema' }),

    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    mac: z.string().optional(),
    serialNumber: z.string().optional(),

    //Populate
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
  .meta({ 'x-collection': 'botonbluetooths' });
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
