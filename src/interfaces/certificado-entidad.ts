import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { CodigoDispositivoSchema } from './codigos-dispositivo';
import { DispositivoAlarmaSchema } from './dispositivo-alarma';
import type { IEventoGenerico } from './evento-generico';
import { TrackerSchema } from './tracker';

export const CertificadoEntidadSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  //
  idEntidad: z.string().optional(),
  fechaComienzo: z.string().optional(),
  fechaEmision: z.string().optional(),
  eventosRegistrados: z.array(z.custom<IEventoGenerico>()).optional(),
  codigosEsperados: z.array(CodigoDispositivoSchema).optional(),
  // Populate
  tracker: TrackerSchema.optional(),
  activo: ActivoSchema.optional(),
  alarma: DispositivoAlarmaSchema.optional(),
  cliente: ClienteSchema.optional(),
});
export type ICertificadoEntidad = z.infer<typeof CertificadoEntidadSchema>;

export const CreateCertificadoEntidadSchema = CertificadoEntidadSchema.omit({
  _id: true,
  cliente: true,
  tracker: true,
  alarma: true,
  activo: true,
});
export type ICreateCertificadoEntidad = z.infer<
  typeof CreateCertificadoEntidadSchema
>;

export const UpdateCertificadoEntidadSchema = CertificadoEntidadSchema.omit({
  _id: true,
  cliente: true,
  tracker: true,
  alarma: true,
  activo: true,
});
export type IUpdateCertificadoEntidad = z.infer<
  typeof UpdateCertificadoEntidadSchema
>;
