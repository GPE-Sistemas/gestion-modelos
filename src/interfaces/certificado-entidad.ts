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
    // @Prop({type: [Object]}) en el schema Mongoose legacy: adentro de un
    // Mixed, Mongoose no declara NADA — no castea ni inicializa esos paths. La
    // anotación se lo dice al chequeo de drift, que si no exigiría en el
    // meta.go de gestion-datos-go casts que el legacy nunca tuvo.
    //
    // `.omit({ categoriaEvento: true })`: CodigoDispositivoSchema (tipo
    // compartido, codigos-dispositivo.ts) hornea `categoriaEvento` con
    // `x-populate` — correcto para el OTRO uso del tipo
    // (CodigosDispositivo.codigos, cuyo meta.go declara el virtual
    // `codigos.categoriaEvento`), pero falso acá: el schema legacy de
    // certificadoEntidad (schema.ts) declara solo 5 virtuals — cliente,
    // ancestros, activo, alarma, tracker — y NUNCA populó ese path anidado
    // bajo `codigosEsperados`. Sin el omit, el chequeo de drift heredaría una
    // anotación que no le corresponde a este embebedor.
    codigosEsperados: z
      .array(CodigoDispositivoSchema.omit({ categoriaEvento: true }))
      .optional()
      .meta({ 'x-bson': 'mixed' }),
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
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
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
