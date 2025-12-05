import { ICliente } from './cliente';
import { IGeoJSONPoint } from '../auxiliares';

export interface IGateway {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  nombre?: string;
  description?: string;
  gatewayEui?: string;
  statsInterval?: number;
  ubicacion?: IGeoJSONPoint;
  tags?: Record<string, string>;
  metadata?: Record<string, string>;

  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id';

export interface ICreateGateway extends Omit<Partial<IGateway>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdateGateway extends Omit<Partial<IGateway>, OmitirUpdate> {}
