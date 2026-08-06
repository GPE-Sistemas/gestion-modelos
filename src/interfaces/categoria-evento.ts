import { z } from "zod";
import { ClienteSchema } from "./cliente";

export const SonidoEventoSchema = z.enum(["Silencio", "Campana", "Sirena"]);
export type SonidoEvento = z.infer<typeof SonidoEventoSchema>;

export const TipoCategoriaSchema = z.enum([
  "Activo",
  "Vehiculo",
  "Alarma",
  "Luminaria",
  "Sistema",
  "Otro",
]);
export type TipoCategoria = z.infer<typeof TipoCategoriaSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const CategoriaEventoSchema = z
  .object({
    _id: z.string().optional(),
    //
    nombre: z.string().optional(), // BUR
    prioridad: z.number().optional(), // 100
    color: z.string().optional(),
    notificar: z.boolean().optional(),
    atender: z.boolean().optional(),
    noDerivar: z.boolean().optional(),
    sonido: SonidoEventoSchema.optional(),
    modulo: TipoCategoriaSchema.optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    default: z.boolean().optional(),
    global: z.boolean().optional(),
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
  })
  .meta({ 'x-collection': 'categoriaeventos' });
export type ICategoriaEvento = z.infer<typeof CategoriaEventoSchema>;

export const CreateCategoriaEventoSchema = CategoriaEventoSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateCategoriaEvento = z.infer<
  typeof CreateCategoriaEventoSchema
>;

export const UpdateCategoriaEventoSchema = CategoriaEventoSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateCategoriaEvento = z.infer<
  typeof UpdateCategoriaEventoSchema
>;

export const CategoriaEventoCacheSchema = CategoriaEventoSchema.omit({
  cliente: true,
  ancestros: true,
});
export type ICategoriaEventoCache = z.infer<typeof CategoriaEventoCacheSchema>;
