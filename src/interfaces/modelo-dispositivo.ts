import { z } from 'zod';
import { ClienteSchema } from './cliente';
import {
  CodigosDispositivoSchema,
  TipoDispositivoSchema,
} from './codigos-dispositivo';

export const FormatosMensajeComunicadorSchema = z.enum([
  'Garnet-Titanium',
  'TECHNO 123',
  'Netio',
  'Nanocomm ED5200',
  'Garnet',
  'Dahua',
  'Hikvision',
  'Intelbras',
  // UNICOM "WiFi DUO": comunicador WiFi (AVR128 + ESP32) que habla MQTT
  // contra el broker propio de IRIX. NO usa SIM/GPRS (sim1/sim2/numeroAbonado
  // quedan vacíos); su identidad es el devid en idUnicoComunicador.
  'UNICOM',
]);
export type FormatosMensajeComunicador = z.infer<
  typeof FormatosMensajeComunicadorSchema
>;

export const NivelDimerizacionSchema = z.enum([
  'dim10',
  'dim20',
  'dim30',
  'dim40',
  'dim50',
  'dim60',
  'dim70',
  'dim80',
  'dim90',
  'dim100',
]);
export type NivelDimerizacion = z.infer<typeof NivelDimerizacionSchema>;

// Punto de la curva: en un nivel de dimerización dado, valores eléctricos
// esperados y sus margenes bidireccionales de tolerancia.
export const PuntoCurvaLuminariaSchema = z.object({
  potencia: z.number().optional(), // W a un determinado dimming (Wd)
  factorPotencia: z.number().optional(), // cfidim a este dim (0..1). También llamado cosφ.

  margenPotenciaSuperior: z.number().optional(), // alarma si W >= Wd * (1 + potencia/100)
  margenPotenciaInferior: z.number().optional(), // alarma si W <= Wd * (1 - potencia/100)
  margenFactorPotenciaSuperior: z.number().optional(), // delta abs — alarma si cosφ > cfidim + margen
  margenFactorPotenciaInferior: z.number().optional(), // delta abs — alarma si cosφ < cfidim - margen
});
export type IPuntoCurvaLuminaria = z.infer<typeof PuntoCurvaLuminariaSchema>;

export const CurvaDimerizacionLuminariaSchema = z.partialRecord(
  NivelDimerizacionSchema,
  PuntoCurvaLuminariaSchema,
);
export type ICurvaDimerizacionLuminaria = z.infer<
  typeof CurvaDimerizacionLuminariaSchema
>;

// Voltaje: independiente del dim.
export const ConfigVoltajeLuminariaSchema = z.object({
  nominalV: z.number().optional(), // Vn (típicamente 230)
  margenSuperiorV: z.number().optional(), // Θv — alarma si V >= Vn + Θv
  margenInferiorV: z.number().optional(), // alarma si V <= Vn - margenInferiorV
});
export type IConfigVoltajeLuminaria = z.infer<
  typeof ConfigVoltajeLuminariaSchema
>;

export const DetallesLuminariasSchema = z.object({
  horasVida: z.number().optional(),

  voltaje: ConfigVoltajeLuminariaSchema.optional(),
  dimerizacion: CurvaDimerizacionLuminariaSchema.optional(),
});
export type IDetallesLuminarias = z.infer<typeof DetallesLuminariasSchema>;

// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const ModeloDispositivoSchema = z.object({
  _id: z.string().optional(),

  //
  tipo: TipoDispositivoSchema.optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  formatoMensaje: FormatosMensajeComunicadorSchema.optional(),
  idCodigos: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'CodigosDispositivoSchema' }),
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

  //Datos técnicos para luminarias
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  luminarias: DetallesLuminariasSchema.optional().meta({ 'x-bson': 'mixed' }),
  global: z.boolean().optional(),
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
  codigos: CodigosDispositivoSchema.optional().meta({
    'x-populate': {
      ref: 'CodigosDispositivoSchema',
      localField: 'idCodigos',
      foreignField: '_id',
      justOne: true,
    },
  }),
}).meta({ 'x-collection': 'modelodispositivos' });
export type IModeloDispositivo = z.infer<typeof ModeloDispositivoSchema>;

export const CreateModeloDispositivoSchema = ModeloDispositivoSchema.omit({
  _id: true,
  codigos: true,
  cliente: true,
});
export type ICreateModeloDispositivo = z.infer<
  typeof CreateModeloDispositivoSchema
>;

export const UpdateModeloDispositivoSchema = ModeloDispositivoSchema.omit({
  _id: true,
  codigos: true,
  cliente: true,
});
export type IUpdateModeloDispositivo = z.infer<
  typeof UpdateModeloDispositivoSchema
>;

export const ModeloDispositivoCacheSchema = ModeloDispositivoSchema.omit({
  cliente: true,
  ancestros: true,
  codigos: true,
});
export type IModeloDispositivoCache = z.infer<
  typeof ModeloDispositivoCacheSchema
>;
