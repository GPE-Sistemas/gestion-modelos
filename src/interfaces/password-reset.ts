import { IUsuario } from './usuario';

export interface IPasswordReset {
  _id?: string;
  idUsuario?: string;
  token?: string;
  vencimiento?: string;
  utilizado?: boolean;

  // virtuals
  usuario?: IUsuario;
}

type Omitir = '_id' | 'usuario';
export interface ICreatePasswordReset
  extends Omit<Partial<IPasswordReset>, Omitir> {}

export interface IUpdatePasswordReset
  extends Omit<Partial<IPasswordReset>, Omitir> {}
