import { z } from 'zod';
import { ActivoSchema } from './activo';
import { ClienteSchema } from './cliente';
import { DocumentacionSchema } from './documentacion';
import { UsuarioSchema } from './usuario';

export const TipoRecordatorioSchema = z.enum(['km', 'fecha']);
export type TipoRecordatorio = z.infer<typeof TipoRecordatorioSchema>;

export const CategoriaRecordatorioSchema = z.enum(['Colectivo', 'Vehiculo']);
export type CategoriaRecordatorio = z.infer<typeof CategoriaRecordatorioSchema>;

export const SubcategoriaRecordatorioSchema = z.enum([
  'Cambio de aceite y filtro',
  'Cambio de aceite de caja',
  'Cambio de líquido refrigerante',
  'Cambio de filtro de combustible',
  'Cambio de filtro de aire',
  'Cambio de filtro de habitáculo',
  'Cambio de batería',
  'Cambio de cubiertas',
  'Cambio de luces',
  'Cambio de líquido de frenos',
  'Cambio de pastillas de freno',
  'Cambio de bujías',
  'Otro',
]);
export type SubcategoriaRecordatorio = z.infer<
  typeof SubcategoriaRecordatorioSchema
>;

//RECORDATORIOS DE MANTENIMIENTO
//- Se generan desde los módulos de vehículos o colectivos en el front end
// -Pueden ser por km o por fecha (o ambos)
//- Tienen subcategorias (cambio de aceite, cambio de cubiertas, etc)
// -Pueden ser repetibles o no (si son repetibles, cada vez que se cumple el recordatorio, se vuelve a crear otro con la misma frecuencia)
// -Los km y las fechas se chequean en el cron. En el caso de los km se chequean cada hora

//RECORDATORIOS DE DOCUMENTACIÓN
//- Son aquellos que tienen idDocumentación
//- La documentación puede ser seguro o licencia
//- Solo son recordatorios por fecha (vencimiento)
// - Las fechas se chequean en el cron
//- La documentación de seguro es para vehículos y colectivos, se crean cuando se crea documentación desde vehículo/colectivo >> detalles >> documentos
//- La documentación de licencia/seguro es para choferes y conductores, se crean desde el listado de choferes/conductores en la acción documentos

//💡💡💡 Creo que esto de los recordatorios debería ser mas genérico porque podría servir para otras entidades. Además, actualmente es confuso porque se mezclan recordatorios de mantenimiento con los de documentación. Podríamos agregar un campo "tipo" que indique si es un recordatorio de mantenimiento o de documentación, y así podríamos tener campos específicos para cada tipo sin que queden confusos.
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const RecordatorioSchema = z
  .object({
    _id: z.string().optional(),
    categoria: CategoriaRecordatorioSchema.optional(),
    subcategoria: SubcategoriaRecordatorioSchema.optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idUsuario: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    tipo: z.array(TipoRecordatorioSchema).optional(),
    notificado: z.boolean().optional(),
    fechaLimite: z.string().optional().meta({ 'x-bson': 'date' }),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    kmLimite: z.number().optional(),
    idActivo: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ActivoSchema' }),
    idDocumentacion: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'DocumentacionSchema' }),
    detallesDelMantenimiento: z.string().optional(),
    repetible: z.boolean().optional(),
    frecuenciaKm: z.number().optional(),
    frecuenciaDia: z.number().optional(),

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
    usuario: UsuarioSchema.optional().meta({
      'x-populate': {
        ref: 'UsuarioSchema',
        localField: 'idUsuario',
        foreignField: '_id',
        justOne: true,
      },
    }),
    activo: ActivoSchema.optional().meta({
      'x-populate': {
        ref: 'ActivoSchema',
        localField: 'idActivo',
        foreignField: '_id',
        justOne: true,
      },
    }),
    documentacion: DocumentacionSchema.optional().meta({
      'x-populate': {
        ref: 'DocumentacionSchema',
        localField: 'idDocumentacion',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'recordatorios' });
export type IRecordatorio = z.infer<typeof RecordatorioSchema>;

export const CreateRecordatorioSchema = RecordatorioSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  documentacion: true,
  usuario: true,
});
export type ICreateRecordatorio = z.infer<typeof CreateRecordatorioSchema>;

export const UpdateRecordatorioSchema = RecordatorioSchema.omit({
  _id: true,
  cliente: true,
  activo: true,
  documentacion: true,
  usuario: true,
});
export type IUpdateRecordatorio = z.infer<typeof UpdateRecordatorioSchema>;
