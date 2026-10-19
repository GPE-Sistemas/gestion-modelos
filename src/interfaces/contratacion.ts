import { z } from 'zod';
import { ClienteSchema } from './cliente';
import { ClienteExternoSchema, TipoDestinoSchema } from './cliente-externo';
import { MonedaFacturacionSchema } from './facturacion-cliente';
import { PrecioSchema } from './precio';
import {
  CategoriaDispositivoSchema,
  ServicioOfrecidoSchema,
} from './servicio-ofrecido';

/**
 * Altas y bajas. La suspensión NO es un estado de la contratación: se lee de
 * IEstadoEntidad del dispositivo, por vigencia.
 */
export const EstadoContratacionSchema = z.enum(['Activa', 'Baja']);
export type EstadoContratacion = z.infer<typeof EstadoContratacionSchema>;

/**
 * Por qué una contratación continúa a otra (idContratacionOrigen):
 * - Recambio: cambió el equipo, el servicio no se interrumpió. Hereda
 *   cargoUnicoFacturado = true.
 * - Rehabilitacion: vuelve tras una baja. Nace con cargoUnicoFacturado = false.
 * - Traspaso: otro destino u otro emisor. Hereda cargoUnicoFacturado = true.
 */
export const MotivoOrigenContratacionSchema = z.enum([
  'Recambio',
  'Rehabilitacion',
  'Traspaso',
]);
export type MotivoOrigenContratacion = z.infer<
  typeof MotivoOrigenContratacionSchema
>;

export const ModalidadEquipoSchema = z.enum(['Comodato', 'Venta', 'DelCliente']);
export type ModalidadEquipo = z.infer<typeof ModalidadEquipoSchema>;

/**
 * Qué cubre una contratación:
 * - Individual: un dispositivo (idEntidad). Se mide con historia: alta, baja
 *   y suspensión prorratean.
 * - Grupo: los trackers de los vehículos de un IGrupo de activos (idGrupo).
 * - Todos: todos los dispositivos de una categoría (categoria) del destino.
 * - Cliente: cargo fijo, sin dispositivo (precio PorCliente).
 * Grupo y Todos se miden con una foto de los dispositivos activos al
 * facturar, sin prorrateo. Ausente = Individual si hay idEntidad, si no
 * Cliente (contrataciones anteriores a este campo).
 */
export const FormaContratacionSchema = z.enum([
  'Individual',
  'Grupo',
  'Todos',
  'Cliente',
]);
export type FormaContratacion = z.infer<typeof FormaContratacionSchema>;

/**
 * Sólo para precios en modo PorCliente: qué cubre el cargo fijo. No cambia el
 * importe.
 */
export const AlcanceContratacionSchema = z.object({
  categorias: z.array(CategoriaDispositivoSchema).optional(),
  requiereAlMenosUno: z.boolean().optional(), // No cobrar si el destino quedó sin dispositivos
});
export type IAlcanceContratacion = z.infer<typeof AlcanceContratacionSchema>;

/**
 * Quién tiene qué: la relación emisor ↔ destino ↔ servicio
 * ↔ dispositivo, con sus fechas. NO guarda el precio: se resuelve en cada
 * tarifación contra IPrecio.
 * - idCliente + idsAncestros: el EMISOR, quien ofrece y cobra.
 * - idClienteDestino (+ tipoDestino): quien RECIBE el servicio. Inmutable.
 *
 * Append-only por ciclo: una baja cierra la fila (fechaBaja); un alta
 * posterior crea una fila nueva encadenada por idContratacionOrigen.
 */
export const ContratacionSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z //El emisor
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

    // Quien RECIBE: ICliente o IClienteExterno según tipoDestino
    idClienteDestino: z.string().meta({ 'x-bson': 'objectId' }),
    tipoDestino: TipoDestinoSchema.optional(), // Default 'Cliente'
    idServicioOfrecido: z
      .string()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ServicioOfrecidoSchema' }),
    // El dispositivo (polimórfico según categoria, sin x-ref). Ausente =
    // servicio sin equipo o precio PorCliente. Siempre ausente con destino
    // Externo.
    idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }),
    // En Todos: la categoría que cubre. En Grupo: 'trackers'
    categoria: CategoriaDispositivoSchema.optional(),
    forma: FormaContratacionSchema.optional(),
    // Grupo: IGrupo de activos (flota, línea de colectivo, ...)
    idGrupo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'GrupoSchema' }),

    fechaAlta: z.string().meta({ 'x-bson': 'date' }),
    fechaBaja: z.string().optional().meta({ 'x-bson': 'date' }),
    estado: EstadoContratacionSchema,

    // Precio vigente al contratar. Informativo, salvo con precioCongelado
    idPrecioAlContratar: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'PrecioSchema' }),
    // Trato puntual para ESTE equipo: gana sobre todo. Sin vigencia, usar poco
    precioPactado: z.number().optional(),
    moneda: MonedaFacturacionSchema.optional(), // Moneda de precioPactado
    // Ata la contratación a idPrecioAlContratar, ignorando vigencias posteriores
    precioCongelado: z.boolean().optional(),

    // Cargo UnicaVez ya cobrado: evita cobrar la instalación en cada período
    cargoUnicoFacturado: z.boolean().optional(),

    alcance: AlcanceContratacionSchema.optional(),

    // Cadena: la contratación anterior (autorreferencia)
    idContratacionOrigen: z.string().optional().meta({ 'x-bson': 'objectId' }),
    motivoOrigen: MotivoOrigenContratacionSchema.optional(),

    modalidadEquipo: ModalidadEquipoSchema.optional(),

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
    servicioOfrecido: ServicioOfrecidoSchema.optional().meta({
      'x-populate': {
        ref: 'ServicioOfrecidoSchema',
        localField: 'idServicioOfrecido',
        foreignField: '_id',
        justOne: true,
      },
    }),
    precioAlContratar: PrecioSchema.optional().meta({
      'x-populate': {
        ref: 'PrecioSchema',
        localField: 'idPrecioAlContratar',
        foreignField: '_id',
        justOne: true,
      },
    }),
    // Sólo uno de los dos resuelve, según tipoDestino
    clienteDestino: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idClienteDestino',
        foreignField: '_id',
        justOne: true,
      },
    }),
    clienteExternoDestino: ClienteExternoSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteExternoSchema',
        localField: 'idClienteDestino',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'contrataciones' });
export type IContratacion = z.infer<typeof ContratacionSchema>;

export const CreateContratacionSchema = ContratacionSchema.omit({
  _id: true,
  cliente: true,
  ancestros: true,
  servicioOfrecido: true,
  precioAlContratar: true,
  clienteDestino: true,
  clienteExternoDestino: true,
});
export type ICreateContratacion = z.infer<typeof CreateContratacionSchema>;

// idClienteDestino y el emisor no se editan: un traspaso cierra y encadena.
export const UpdateContratacionSchema = ContratacionSchema.omit({
  _id: true,
  idCliente: true,
  idsAncestros: true,
  idClienteDestino: true,
  tipoDestino: true,
  cliente: true,
  ancestros: true,
  servicioOfrecido: true,
  precioAlContratar: true,
  clienteDestino: true,
  clienteExternoDestino: true,
}).partial();
export type IUpdateContratacion = z.infer<typeof UpdateContratacionSchema>;
