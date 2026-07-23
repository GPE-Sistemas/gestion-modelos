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

export const NotaSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  idAsignado: z.string().optional(),
  permanente: z.boolean().optional(),
  vigenciaDesde: z.string().optional(),
  vigenciaHasta: z.string().optional(),
  tipo: TipoNotaSchema.optional(),
  informacion: InformacionSchema.optional(),
  orden: z.number().optional(),
  //Para contactos
  inhabilitadoDesde: z.string().optional(), //Durante el período inhabilitado, no se mostrará el conatcto en el tratamiento de los eventos
  inhabilitadoHasta: z.string().optional(),
  // Categoría de evento a la que aplica esta nota/contacto. Sin valor = aplica a todos los eventos
  idCategoriaEvento: z.string().optional(),
  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  activo: ActivoSchema.optional(),
  alarma: DispositivoAlarmaSchema.optional(),
  luminaria: LuminariaSchema.optional(),
  categoriaEvento: CategoriaEventoSchema.optional(),
});
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
