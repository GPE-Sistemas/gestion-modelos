import { z } from 'zod';
import { ActivoSchema } from './activo';
import { CategoriaEventoSchema } from './categoria-evento';
import { ClienteSchema } from './cliente';
import { DispositivoAlarmaSchema } from './dispositivo-alarma';
import { LuminariaSchema } from './luminaria';

export const TipoNotaSchema = z.enum(['Contacto', 'Nota']);
export type TipoNota = z.infer<typeof TipoNotaSchema>;

export const InformacionNotaSchema = z.object({
  nota: z.string().optional(),
});
export type IInformacionNota = z.infer<typeof InformacionNotaSchema>;

export const InformacionContactoSchema = z.object({
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  interno: z.string().optional(),
  email: z.string().optional(),

  // Solo cuando es contacto de alarma
  palabraSeguridadNormal: z.string().optional(),
  palabraSeguridadEmergencia: z.string().optional(),
  numeroUsuarioAlarma: z.number().optional(),
  particion: z.number(),

  // Derivados: indican si el contacto tiene configurado cada código, sin
  // exponer el valor. Los setea StripCodigosSeguridadInterceptor al reemplazar
  // los 2 campos de arriba en cualquier respuesta que no sea la ruta dedicada
  // (GET /notas/:id/codigos-seguridad). No tienen efecto si se envían en un
  // create/update.
  tieneCodigoSeguridadNormal: z.boolean().optional(),
  tieneCodigoSeguridadEmergencia: z.boolean().optional(),
});
export type IInformacionContacto = z.infer<typeof InformacionContactoSchema>;

// Respuesta del endpoint dedicado que expone los códigos de seguridad de un
// contacto (palabraSeguridadNormal/palabraSeguridadEmergencia) — estos 2 campos
// se ocultan del resto de las respuestas de Nota (ver StripCodigosSeguridadInterceptor).
export const CodigosSeguridadContactoSchema = z.object({
  palabraSeguridadNormal: z.string().optional(),
  palabraSeguridadEmergencia: z.string().optional(),
});
export type ICodigosSeguridadContacto = z.infer<
  typeof CodigosSeguridadContactoSchema
>;

// IInformacion era IInformacionNota & IInformacionContacto (intersección de objetos)
export const InformacionSchema = InformacionNotaSchema.extend(
  InformacionContactoSchema.shape,
);
export type IInformacion = z.infer<typeof InformacionSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const NotaSchema = z.object({
  _id: z.string().optional(),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  // Polimórfico (Activo/Alarma/Luminaria según no hay un tipo dedicado en
  // Nota, se resuelve por los 3 virtuals activo/alarma/luminaria): sin ref
  // fijo en el legacy (@Prop sin `ref`), por eso sin x-ref acá tampoco.
  idAsignado: z.string().optional().meta({ 'x-bson': 'objectId' }),
  permanente: z.boolean().optional(),
  vigenciaDesde: z.string().optional().meta({ 'x-bson': 'date' }),
  vigenciaHasta: z.string().optional().meta({ 'x-bson': 'date' }),
  tipo: TipoNotaSchema.optional(),
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  informacion: InformacionSchema.optional().meta({ 'x-bson': 'mixed' }),
  orden: z.number().optional(),
  //Para contactos
  inhabilitadoDesde: z.string().optional().meta({ 'x-bson': 'date' }), //Durante el período inhabilitado, no se mostrará el conatcto en el tratamiento de los eventos
  inhabilitadoHasta: z.string().optional().meta({ 'x-bson': 'date' }),
  // Categoría de evento a la que aplica esta nota/contacto. Sin valor = aplica a todos los eventos
  idCategoriaEvento: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'CategoriaEventoSchema' }),
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
  activo: ActivoSchema.optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'idAsignado',
      foreignField: '_id',
      justOne: true,
    },
  }),
  alarma: DispositivoAlarmaSchema.optional().meta({
    'x-populate': {
      ref: 'DispositivoAlarmaSchema',
      localField: 'idAsignado',
      foreignField: '_id',
      justOne: true,
    },
  }),
  luminaria: LuminariaSchema.optional().meta({
    'x-populate': {
      ref: 'LuminariaSchema',
      localField: 'idAsignado',
      foreignField: '_id',
      justOne: true,
    },
  }),
  categoriaEvento: CategoriaEventoSchema.optional().meta({
    'x-populate': {
      ref: 'CategoriaEventoSchema',
      localField: 'idCategoriaEvento',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'notas' });
export type INota = z.infer<typeof NotaSchema>;

export const CreateNotaSchema = NotaSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateNota = z.infer<typeof CreateNotaSchema>;

export const UpdateNotaSchema = NotaSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateNota = z.infer<typeof UpdateNotaSchema>;

export const NotaCacheSchema = NotaSchema.omit({
  cliente: true,
  ancestros: true,
  activo: true,
  alarma: true,
  luminaria: true,
  categoriaEvento: true,
});
export type INotaCache = z.infer<typeof NotaCacheSchema>;
