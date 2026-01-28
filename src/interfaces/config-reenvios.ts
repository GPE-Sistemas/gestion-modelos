import { ICliente } from './cliente';
import { IDispositivoAlarma } from './dispositivo-alarma';
import { ITracker } from './tracker';

export type MetodoReenvio = 'Básico' | 'Seguridad Evento Externo' | 'Soflex';
export type Protocolo = 'UDP' | 'TCP';
export type IAgrupacionReenvio =
  | 'Todos los trackers del cliente'
  | 'Todas las alarmas del cliente'
  | 'Entidad';
export interface IOpcionesReenvio {
  metodo?: MetodoReenvio;
  host?: string;
  puerto?: number;
  apikey?: string;
  usuario?: string;
  contrasena?: string;
  usaReglaReenvio?: boolean;
  reglasReenvio?: IReglaReenvio[]; //Especifica condiciones de cómo reenviar, dependiendo de cómo llegó la data recibida
  opcionesSoflex?: ISoflexConfig;
}

export interface IReglaReenvio {
  puertoEntrada?: number; // Puerto por el cual llegó la data recibida. Para Trackers: TRAX (5031), GTO6 (5023), GPS103 (5001)
  protocoloEntrada?: Protocolo;
  puertoSalida?: number; // Puerto al cual se reenviará la data (definido por el usuario)
  protocoloSalida?: Protocolo;
  hostSalida?: string; // Host al cual se reenviará la data (definido por el usuario)
}
export interface ISoflexConfig {
  providerid?: string;
  version?: string; // v.X.X dice la documentación
}

export interface IConfigReenvio {
  _id?: string;
  activo?: boolean;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  // Configuracion
  agrupacionReenvio?: IAgrupacionReenvio;
  idClienteReenvio?: string;
  idEntidadReenvio?: string;
  opcionesReenvio?: IOpcionesReenvio;
  reenviarHijos?: boolean; /// solo para trackers o alarmas de clientes hijos del cliente reenvio -- tambien se reenvian los propios

  // Virtual
  cliente?: ICliente;
  ancestros?: ICliente[];
  clienteReenvio?: ICliente;
  dispositivoAlarma?: IDispositivoAlarma;
  tracker?: ITracker;
}

type OmitirCreate = '_id' | 'cliente' | 'dispositivoAlarma' | 'tracker';
export interface ICreateConfigReenvio extends Omit<
  Partial<IConfigReenvio>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente' | 'dispositivoAlarma' | 'tracker';
export interface IUpdateConfigReenvio extends Omit<
  Partial<IConfigReenvio>,
  OmitirUpdate
> {}

export interface IConfigReenvioCache extends Omit<
  IConfigReenvio,
  'cliente' | 'ancestros' | 'clienteReenvio' | 'dispositivoAlarma' | 'tracker'
> {}
