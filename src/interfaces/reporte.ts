import { ICoordenadaOL, ICoordenadas, IGeoJSONPoint } from '../auxiliares';
import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IFlota } from './flota';
import { IRecorrido } from './recorrido';
import { ITracker } from './tracker';
import { IUsuario } from './usuario';

export interface IReporte {
  _id?: string;
  //
  idCliente?: string;
  idFlota?: string;
  idTracker?: string;
  idActivo?: string;
  idRecorrido?: string;
  idChofer?: string;
  fechaCreacion?: string;
  // Datos compartidos
  geojson?: IGeoJSONPoint;
  fechaDevice?: string;
  fechaServer?: string;
  // Datos de traccar
  traccarUniqueId?: string;
  velocidad?: number;
  reporteTraccar?: Record<string, any>;
  // Datos de Qualcomm
  serialNumber?: string;
  tipoMensaje?: string;
  locationTechType?: string;
  horizontalUncertainity?: number;
  deviceReportId?: number;
  fechaLectura?: string;
  reporteQualcomm?: Record<string, any>;
  // Populate
  cliente?: ICliente;
  flota?: IFlota;
  tracker?: ITracker;
  activo?: IActivo;
  recorrido?: IRecorrido;
  chofer?: IUsuario;
  ubicacion?: ICoordenadas;
  ubicacionOl?: ICoordenadaOL;
}

type OmitirCreate =
  | '_id'
  | 'fechaCreacion'
  | 'cliente'
  | 'tracker'
  | 'activo'
  | 'recorrido'
  | 'flota'
  | 'chofer'
  | 'ubicacion'
  | 'ubicacionOl';

export interface ICreateReporte extends Omit<Partial<IReporte>, OmitirCreate> {}

type OmitirUpdate =
  | '_id'
  | 'fechaCreacion'
  | 'cliente'
  | 'tracker'
  | 'activo'
  | 'recorrido'
  | 'flota'
  | 'chofer'
  | 'ubicacion'
  | 'ubicacionOl';

export interface IUpdateReporte extends Omit<Partial<IReporte>, OmitirUpdate> {}
