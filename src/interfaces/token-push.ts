export type PlataformaTokenPush = 'android' | 'ios';

export interface ITokenPush {
  _id?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  tokenPush?: string;
  idUsuario?: string;
  // Identificador estable del dispositivo (Android: ANDROID_ID, iOS:
  // identifierForVendor). Permite 1 fila por (idUsuario, idDispositivo):
  // al rotar el FCM token se reemplaza el de ese device (sin huerfanos) y
  // el logout borra limpio por device.
  idDispositivo?: string;
  plataforma?: PlataformaTokenPush;
}

type OmitirCreate = '_id';
export interface ICreateTokenPush
  extends Omit<Partial<ITokenPush>, OmitirCreate> {}

type OmitirUpdate = '_id';
export interface IUpdateTokenPush
  extends Omit<Partial<ITokenPush>, OmitirUpdate> {}
