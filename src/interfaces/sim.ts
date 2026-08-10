import { z } from 'zod';

// SIM asociada por FK ObjectId a tracker/dispositivo-alarma (idSim1/idSim2) + virtuals `sim1`/`sim2`.

// Operador/carrier de la SIM
export const OperadorSchema = z.enum([
  'Personal',
  'Claro',
  'Movistar',
  'Tuenti',
  'Otro',
]);
export type Operador = z.infer<typeof OperadorSchema>;

export const SimSchema = z
  .object({
    _id: z.string().optional().meta({ 'x-bson': 'objectId' }),
    iccid: z.string().optional(), //Serial del chip SIM
    imsi: z.string().optional(), //Identidad del abonado en la red (MCC+MNC+MSIN).
    numero: z.string().optional(), //MSISDN: número de teléfono de la línea
    operador: OperadorSchema.optional(),
    apn: z.string().optional(),
    usuario: z.string().optional(),
    password: z.string().optional(),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    fechaUltimoReporte: z.string().optional().meta({ 'x-bson': 'date' }), //En caso de que sea cargada por reporte
  })
  .meta({ 'x-collection': 'sims' });
export type ISim = z.infer<typeof SimSchema>;

export const CreateSimSchema = SimSchema.omit({ _id: true });
export interface ICreateSim extends Omit<Partial<ISim>, '_id'> {}

export const UpdateSimSchema = SimSchema.omit({ _id: true });
export interface IUpdateSim extends Omit<Partial<ISim>, '_id'> {}
