import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { CodigoDispositivoSchema } from './codigos-dispositivo';
import { DispositivoAlarmaSchema } from './dispositivo-alarma';
import type { IEventoGenerico } from './evento-generico';
import { TrackerSchema } from './tracker';

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const CertificadoEntidadSchema = z
  .object({
    _id: z.string().optional(),
    //
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    //
    // Polimórfico (tracker / activo / alarma): sin ref fijo en el legacy
    // (@Prop sin `ref`), por eso sin x-ref acá tampoco.
    idEntidad: z.string().optional().meta({ 'x-bson': 'objectId' }),
    fechaComienzo: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaEmision: z.string().optional().meta({ 'x-bson': 'date' }),
    eventosRegistrados: z.array(z.custom<IEventoGenerico>()).optional(),
    codigosEsperados: z.array(CodigoDispositivoSchema).optional(),
    // Populate
    tracker: TrackerSchema.optional().meta({
      'x-populate': {
        ref: 'TrackerSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    activo: ActivoSchema.optional().meta({
      'x-populate': {
        ref: 'ActivoSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    alarma: DispositivoAlarmaSchema.optional().meta({
      'x-populate': {
        ref: 'DispositivoAlarmaSchema',
        localField: 'idEntidad',
        foreignField: '_id',
        justOne: true,
      },
    }),
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'certificadoentidads' });
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
