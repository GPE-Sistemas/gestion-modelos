import {
  ICoordenadaOL,
  ICoordenadas,
  IGeoJSONLineString,
  IGeoJSONPoint,
} from '../auxiliares';
import { ICliente } from './cliente';
import { IGrupo } from './grupo';
import { IUbicacion } from './ubicacion';

export type ITipoParada = 'refugio' | 'parada';

export interface IParada {
  _id?: string;
  /**
   * @deprecated Se usa ubicacionOl.
   */
  ubicacion?: ICoordenadas;
  ubicacionOl?: ICoordenadaOL;
  geojson?: IGeoJSONPoint;
  nombre?: string;
  direccion?: string;
  destino?: string;
  por?: string;
  subida?: boolean;
  bajada?: boolean;
  tipo?: ITipoParada;
  /**
   * Tiempo que se suma al recorrido, es lo que se estima que tarda el colectivo en esa parada
   */
  tiempoParada?: number;
}

export interface IFranjaHoraria {
  dia?: number; // Número de 0 a 6, siendo 0 el domingo
  desde?: string;
  hasta?: string;
  frecuenciaMinutos?: number;
}

export interface IRecorrido {
  _id?: string;
  idCliente?: string;
  //
  idExterno?: string;
  idGrupo?: string;
  nombreFlota?: string;
  nombre?: string;
  geojson?: IGeoJSONLineString;
  paradas?: IParada[];
  franjaHoraria?: IFranjaHoraria[];
  destino?: string;
  por?: string;
  color?: string;
  duracion?: number;
  idsUbicaciones?: string[];
  // Populate
  cliente?: ICliente;
  grupo?: IGrupo;
  recorrido?: ICoordenadas[];
  recorridoOl?: ICoordenadaOL[];
  ubicaciones?: IUbicacion[];
}

type OmitirCreate =
  | '_id'
  | 'cliente'
  | 'grupo'
  | 'recorrido'
  | 'recorridoOl'
  | 'ubicaciones';

export interface ICreateRecorrido
  extends Omit<Partial<IRecorrido>, OmitirCreate> {
  recorridoOl?: ICoordenadaOL[];
}

type OmitirUpdate =
  | '_id'
  | 'cliente'
  | 'grupo'
  | 'recorrido'
  | 'recorridoOl'
  | 'ubicaciones';

export interface IUpdateRecorrido
  extends Omit<Partial<IRecorrido>, OmitirUpdate> {
  recorridoOl?: ICoordenadaOL[];
}
