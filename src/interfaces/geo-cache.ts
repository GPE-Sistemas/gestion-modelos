import { IGeoJSONPoint } from '../auxiliares';

export interface IPartesDireccion {
  calle?: string;
  numero?: string;
  barrio?: string;
  ciudad?: string;
  partido?: string;
  provincia?: string;
  pais?: string;
  codigoPostal?: string;
}

export interface IGeoCache {
  _id?: string;
  fechaCreacion?: string;
  geojson?: IGeoJSONPoint;
  geohash?: string;
  direccion?: string;
  partes?: IPartesDireccion;
  fuente?: string; // Fuente de los datos (ej. Google Maps, OpenStreetMap, etc.)
}

type OmitirCreate = '_id';

export interface ICreateGeoCache
  extends Omit<Partial<IGeoCache>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdateGeoCache
  extends Omit<Partial<IGeoCache>, OmitirUpdate> {}
