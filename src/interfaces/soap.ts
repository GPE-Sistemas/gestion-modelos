import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const SoapAltaSchema = z.object({
  grupoEconomico: z.number().optional(),
  empresa: z.number().optional(),
  linea: z.number().optional(),
  nroInterno: z.number().optional(),
  legajoChofer: z.number().optional(),
  salidaDateTime: z.string().optional(),
  codigoRamal: z.number().optional(),
  sentido: z.number().optional(),
  llegadaDateTime: z.string().optional(),
  numeroVueltaTurno: z.number().optional(),
  idDiagramaDaz: z.number().optional(),
  idTurnoDaz: z.number().optional(),
  turno: z.string().optional(),
  seccionadoCsv: z.string().optional(),
});
export type ISoapAlta = z.infer<typeof SoapAltaSchema>;

export const SoapCreateSchema = z.object({
  grupoEconomico: z.instanceof(Int16Array).optional(),
  empresa: z.instanceof(Int16Array).optional(),
  linea: z.instanceof(Int16Array).optional(),
  nroInterno: z.instanceof(Int16Array).optional(),
  legajoChofer: z.instanceof(Int16Array).optional(),
  salida: z.string().optional(), //dateTimeInt16Array;
  codigoRamal: z.instanceof(Int16Array).optional(),
  sentido: z.instanceof(Int16Array).optional(),
  llegada: z.string().optional(), //dateTimeInt16Array;
  numeroVueltaTurno: z.instanceof(Int16Array).optional(),
  idDiagramaDaz: z.instanceof(Int16Array).optional(),
  idTurnoDaz: z.instanceof(Int16Array).optional(),
  turno: z.number().optional(), //charInt16Array;
  seccionado: z.string().optional(), //ArrayOfKeyValuePairOfInt32DateTimeInt16Array;
});
export type ISoapCreate = z.infer<typeof SoapCreateSchema>;

export const SoapAltaChoferSchema = z.object({
  grupoEconomico: z.number().optional(),
  empresa: z.number().optional(),
  linea: z.number().optional(),
  legajoChofer: z.number().optional(),
  NombreChofer: z.string().optional(),
});
export type ISoapAltaChofer = z.infer<typeof SoapAltaChoferSchema>;

export const SoapObtenerChoferesSchema = z.object({
  grupoEconomico: z.number().optional(),
  empresa: z.number().optional(),
  linea: z.number().optional(),
});
export type ISoapObtenerChoferes = z.infer<typeof SoapObtenerChoferesSchema>;

export const SoapAltaPorMinutaSchema = z.object({
  grupoEconomico: z.number().optional(),
  empresa: z.number().optional(),
  linea: z.number().optional(),
  nroInterno: z.number().optional(),
  legajoChofer: z.number().optional(),
  salidaDateTime: z.string().optional(),
  idMinutaSauron: z.number().optional(),
});
export type ISoapAltaPorMinuta = z.infer<typeof SoapAltaPorMinutaSchema>;

export const SoapAltaPorMinutaChoferSchema = z.object({
  grupoEconomico: z.number().optional(),
  empresa: z.number().optional(),
  linea: z.number().optional(),
  nroInterno: z.number().optional(),
  legajoChofer: z.number().optional(),
  salidaDateTime: z.string().optional(),
  idMinutaSauron: z.number().optional(),
  nombreChofer: z.string().optional(),
  dniChofer: z.string().optional(),
});
export type ISoapAltaPorMinutaChofer = z.infer<
  typeof SoapAltaPorMinutaChoferSchema
>;

export const SoapBajaSchema = z.object({
  idHorarioOjoSauron: z.number().optional(),
  motivo: z.number().optional(),
  descripcionMotivo: z.string().optional(),
  lineaDaz: z.number().optional(),
  nroInterno: z.number().optional(),
});
export type ISoapBaja = z.infer<typeof SoapBajaSchema>;

export const SoapSchema = z.object({
  _id: z.string().optional(),
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),

  alta: SoapAltaSchema.optional(),
  create: SoapCreateSchema.optional(),
  altaChofer: SoapAltaChoferSchema.optional(),
  obtenerChoferes: SoapObtenerChoferesSchema.optional(),
  altaPorMinuta: SoapAltaPorMinutaSchema.optional(),
  altaPorMinutaChofer: SoapAltaPorMinutaChoferSchema.optional(),
  baja: SoapBajaSchema.optional(),

  // Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});
export type ISoap = z.infer<typeof SoapSchema>;

export const CreateSoapSchema = SoapSchema.omit({
  _id: true,
  cliente: true,
});
export type ICreateSoap = z.infer<typeof CreateSoapSchema>;

export const UpdateSoapSchema = SoapSchema.omit({
  _id: true,
  cliente: true,
});
export type IUpdateSoap = z.infer<typeof UpdateSoapSchema>;
