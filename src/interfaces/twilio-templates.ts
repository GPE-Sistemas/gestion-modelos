/**
 * Interfaz para el template de Twilio
 *
 *  @example ED5200*1234,ID=6573,igprs.claro.com.ar=clarogprs,PWD=clarogprs999,IP=34.46.185.217,PORT=6000,,,
 *  @example Modelo*PASSComunicador,ID=idComunicador,apn=usuario,PWD=password,IP=server,PORT=portServer,,,
 *  @example `${modelo}*${passComunicador},ID=${idComunicador},apn=${apn},PWD=${pwd},IP=${ip},PORT=${port},,,`
 */

export interface ConfigComunicadorNanocomm {
  // ED5200*1234,ID=6573,igprs.claro.com.ar=clarogprs,PWD=clarogprs999,IP=34.46.185.217,PORT=6000,,,
  // Modelo*PASSComunicador,ID=idComunicador,apn=usuario,PWD=password,IP=server,PORT=portServer,,,
  modelo?: string;
  passComunicador?: string;
  idComunicador?: string;
  apn?: string;
  pwd?: string;
  ip?: string;
  port?: string;
}
