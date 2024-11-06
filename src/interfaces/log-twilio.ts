import { ICliente } from './cliente';

export type TwilioMessageStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'delivered'
  | 'undelivered'
  | 'receiving'
  | 'received'
  | 'accepted'
  | 'scheduled'
  | 'read'
  | 'partially_delivered'
  | 'canceled';

export type TwilioMessageDirection =
  | 'inbound'
  | 'outbound-api'
  | 'outbound-call'
  | 'outbound-reply';

export interface ILogTwilio {
  _id: string;
  fechaCreacion?: string;
  idCliente?: string;
  phone?: string;
  sid?: string;
  body?: string;
  direction?: TwilioMessageDirection;
  status?: TwilioMessageStatus;
  error?: boolean;
  /// Solo en error
  errorCode?: string;
  errorMessage?: string;
  // Populate
  cliente?: ICliente;
}

////// CREATE
type OmitirCreate = '_id' | 'fechaCreacion' | 'cliente';
export interface ICreateLogTwilio
  extends Omit<Partial<ILogTwilio>, OmitirCreate> {}

////// UPDATE
type OmitirUpdate = '_id' | 'fechaCreacion' | 'cliente';
export interface IUpdateLogTwilio
  extends Omit<Partial<ILogTwilio>, OmitirUpdate> {}
