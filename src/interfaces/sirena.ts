import { z } from 'zod';
import { GeoJSONPointSchema } from '../auxiliares';
import { CamaraSchema } from './camara';
import { ClienteSchema } from './cliente';
import { ModeloDispositivoSchema } from './modelo-dispositivo';

export const EstadoSirenaSchema = z.enum(['Online', 'Offline']);
export type EstadoSirena = z.infer<typeof EstadoSirenaSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const SirenaSchema = z
  .object({
    _id: z.string().optional(),
    /// Cosas de IRIX
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idModelo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ModeloDispositivoSchema' }),
    // Camaras, sensores, etc. Sin x-ref propio: se popula bajo el nombre
    // "camaras" (virtual con nombre distinto al path).
    idsAsignados: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId' }),

    // Datos de sincronizacion de seguridad
    idExterno: z.string().optional(), /// El _id que tiene la sirena en seguridad
    chipId: z.string().optional(), /// El chipId de la sirena en seguridad
    fechaSincronizacion: z.string().optional().meta({ 'x-bson': 'date' }),
    // @Prop({type: Object}) en el schema Mongoose legacy: adentro de un Mixed,
    // Mongoose no declara NADA — no castea ni inicializa esos paths.
    ubicacion: GeoJSONPointSchema.optional().meta({ 'x-bson': 'mixed' }),
    direccion: z.string().optional(),
    activa: z.boolean().optional(),
    estado: EstadoSirenaSchema.optional(),
    tipo: z.string().optional(),
    onlineDesde: z.string().optional().meta({ 'x-bson': 'date' }),
    offlineDesde: z.string().optional().meta({ 'x-bson': 'date' }),
    iccidSim: z.string().optional(),
    telefono: z.string().optional(),

    /// Populates
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    // camaras: virtual poblado desde idsAsignados (Camaras, sensores, etc).
    camaras: z.array(CamaraSchema).optional().meta({
      'x-populate': {
        ref: 'CamaraSchema',
        localField: 'idsAsignados',
        foreignField: '_id',
        justOne: false,
      },
    }),
    modelo: ModeloDispositivoSchema.optional().meta({
      'x-populate': {
        ref: 'ModeloDispositivoSchema',
        localField: 'idModelo',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'sirenas' });
export type ISirena = z.infer<typeof SirenaSchema>;

export const CreateSirenaSchema = SirenaSchema.omit({
  _id: true,
  cliente: true,
  camaras: true,
  modelo: true,
});
export type ICreateSirena = z.infer<typeof CreateSirenaSchema>;

export const UpdateSirenaSchema = SirenaSchema.omit({
  _id: true,
  cliente: true,
  camaras: true,
  modelo: true,
});
export type IUpdateSirena = z.infer<typeof UpdateSirenaSchema>;
