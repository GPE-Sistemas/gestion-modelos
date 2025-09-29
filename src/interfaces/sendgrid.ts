// EMAIL

import { IConfigTwilio } from './cliente';

export interface IEmailDataBase {
  sid: string;
  subject?: string;
}

export interface IEmailGenerico extends IEmailDataBase {
  [key: string]: string | undefined;
}

export interface IEmailResetPassword extends IEmailDataBase {
  token: string;
}

export interface IEmailNuevoUsuario extends IEmailDataBase {
  usuario: string;
  password: string;
}

export interface IEmailCambioPassword extends IEmailDataBase {
  codigo: string;
}

export interface IEmailTwilio {
  email?: string;
  datos?:
    | IEmailGenerico
    | IEmailResetPassword
    | IEmailNuevoUsuario
    | IEmailCambioPassword;
  idCliente?: string;
  usuario?: string;
  twilio?: IConfigTwilio;
  extra?: Record<string, any>;
}
