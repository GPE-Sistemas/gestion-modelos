import { z } from 'zod';
import { ClienteSchema } from './cliente';

/**
 * Discriminador del destino de una relación de facturación. Acompaña a
 * `idClienteDestino` en IPrecio, IContratacion, IFacturacionCliente e
 * ILiquidacion (y en `lineas[].detalle`).
 * - 'Cliente': `idClienteDestino` es un `ICliente` (colección `clientes`).
 * - 'Externo': `idClienteDestino` es un `IClienteExterno` (colección
 *   `clientesexternos`): alguien a quien el emisor factura pero que no está
 *   registrado en Irix.
 * Ausente = 'Cliente'.
 */
export const TipoDestinoSchema = z.enum(['Cliente', 'Externo']);
export type TipoDestino = z.infer<typeof TipoDestinoSchema>;

/**
 * Destino de facturación que no es cliente de Irix: sin usuario, jerarquía ni
 * dispositivos. Es un contacto del EMISOR (`idCliente`), lo administra él y lo
 * ve su jerarquía. Sus datos fiscales NO van acá: van, como los de cualquier
 * destino, en la IFacturacionCliente del par (emisor, externo).
 */
export const ClienteExternoSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z //El emisor dueño de este contacto
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    nombre: z.string(),
    cuit: z.string().optional(), // Para detectar duplicados y para incorporarlo a Irix
    // Si pasó a ser cliente del sistema: el ICliente que lo reemplaza
    idClienteIrix: z.string().optional().meta({ 'x-bson': 'objectId' }),
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
    clienteIrix: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idClienteIrix',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'clientesexternos' });
export type IClienteExterno = z.infer<typeof ClienteExternoSchema>;

export const CreateClienteExternoSchema = ClienteExternoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  clienteIrix: true,
});
export type ICreateClienteExterno = z.infer<typeof CreateClienteExternoSchema>;

export const UpdateClienteExternoSchema = ClienteExternoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  clienteIrix: true,
}).partial();
export type IUpdateClienteExterno = z.infer<typeof UpdateClienteExternoSchema>;
