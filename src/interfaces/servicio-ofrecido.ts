import { z } from 'zod';
import { ClienteSchema } from './cliente';

/**
 * Tipo de dispositivo al que aplica un servicio, una contratación o una línea
 * de liquidación. Una por colección de dispositivos facturable.
 */
export const CategoriaDispositivoSchema = z.enum([
  'alarmas',
  'trackers',
  'sirenas',
  'camaras',
  'luminarias',
  'dispositivosLorawan',
  'gateways',
  'botonesBluetooth',
]);
export type CategoriaDispositivo = z.infer<typeof CategoriaDispositivoSchema>;

/**
 * Catálogo comercial (ProductOffering, TMF620): define QUÉ se vende.
 * El precio NO vive acá: está en IPrecio (por emisor, destino y vigencia).
 * idCliente + idsAncestros: el EMISOR dueño del catálogo; con `global` lo pueden vender sus descendientes.
 */
export const ServicioOfrecidoSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z //EMISOR (dueño del catálogo)
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    nombre: z.string(),
    icono: z.string().optional(),
    global: z.boolean().optional(), // Visible (y vendible) para toda la jerarquía
    categorias: z.array(CategoriaDispositivoSchema).optional(), // A qué tipos de dispositivo aplica
    alicuotaIVA: z.number().optional(), // 21 · 10.5 · 0
    codigoExterno: z.string().optional(), // El artículo en el ERP del emisor: "SERV-001"
    unidadMedida: z.string().optional(), // Default "unidad"
    // Pack: servicio compuesto por otros. Se factura como una línea al precio
    // del pack; los componentes quedan en el detalle de la línea.
    componentes: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ServicioOfrecidoSchema' }),
    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z
      .array(ClienteSchema)
      .optional()
      .meta({
        'x-populate': {
          ref: 'ClienteSchema',
          localField: 'idsAncestros',
          foreignField: '_id',
          justOne: false,
        },
      }),
  })
  .meta({ 'x-collection': 'serviciosofrecidos' });
export type IServicioOfrecido = z.infer<typeof ServicioOfrecidoSchema>;

export const CreateServicioOfrecidoSchema = ServicioOfrecidoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
});
export type ICreateServicioOfrecido = z.infer<
  typeof CreateServicioOfrecidoSchema
>;

export const UpdateServicioOfrecidoSchema = ServicioOfrecidoSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
}).partial();
export type IUpdateServicioOfrecido = z.infer<
  typeof UpdateServicioOfrecidoSchema
>;
