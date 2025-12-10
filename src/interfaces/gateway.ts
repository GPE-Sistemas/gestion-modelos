import { ICliente } from './cliente';
import { IGeoJSONPoint } from '../auxiliares';

//Esta es la interfaz del gateway que se va a guardar en nuestra base de datos. Va a requerir que ya exista creado el gateway en Chirpstack
export interface IGateway {
  //Propios de nuestra base de datos
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  nombre?: string;
  /** true si fue creado automáticamente por el cron de métricas */
  autoCreado?: boolean;
  //Propios de Chirpstack
  fechaCreacionChirpstack?: string; //Fecha de creación en Chirpstack
  gatewayEui?: string;
  nombreChirpstack?: string;
  description?: string;
  statsInterval?: number;
  ubicacion?: IGeoJSONPoint; //De Chirpstack vienen en otro formato, pero acá lo guardamos como GeoJSON Point
  tags?: Record<string, string>;
  metadata?: Record<string, string>;

  cliente?: ICliente;
  ancestros?: ICliente[];

  // Estadísticas calculadas por cron (actualización horaria)
  /** ToA promedio por canal en ms de la última hora */
  toaPromedioHora?: number;
  /** Estado de salud basado en ToA: ok (<5%), warning (5-17%), error (>17%) */
  estadoSalud?: 'ok' | 'warning' | 'error';
  /** Fecha de última actualización de estadísticas */
  estadisticasActualizadas?: string;
}

type OmitirCreate = '_id';

export interface ICreateGateway extends Omit<Partial<IGateway>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdateGateway extends Omit<Partial<IGateway>, OmitirUpdate> {}
