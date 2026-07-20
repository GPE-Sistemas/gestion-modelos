import { z } from 'zod';

/**
 * Interfaz para el template de Twilio
 *
 *  @example ED5200*1234,ID=6573,igprs.claro.com.ar=clarogprs,PWD=clarogprs999,IP=34.46.185.217,PORT=6000,,,
 *  @example Modelo*PASSComunicador,ID=idComunicador,apn=usuario,PWD=password,IP=server,PORT=portServer,,,
 *  @example `${modelo}*${passComunicador},ID=${idComunicador},${apn}=${usuario},PWD=${pwd},IP=${ip},PORT=${port},,,`
 */

export const ConfigComunicadorNanocommSchema = z.object({
  // ED5200*1234,ID=6573,igprs.claro.com.ar=clarogprs,PWD=clarogprs999,IP=34.46.185.217,PORT=6000,,,
  // Modelo*PASSComunicador,ID=idComunicador,apn=usuario,PWD=password,IP=server,PORT=portServer,,,
  modelo: z.string().optional(),
  passComunicador: z.string().optional(),
  idComunicador: z.string().optional(),
  apn: z.string().optional(),
  usr: z.string().optional(),
  pwd: z.string().optional(),
  ip: z.string().optional(),
  port: z.string().optional(),
});
export type ConfigComunicadorNanocomm = z.infer<
  typeof ConfigComunicadorNanocommSchema
>;
