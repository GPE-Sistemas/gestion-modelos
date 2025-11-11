export interface IGeoCache {
  _id?: string;
  fechaCreacion?: string;
  geojson?: {
    type?: 'Point';
    coordinates?: [number, number]; // [lon, lat]
  };
  geohash?: string;
  direccion?: string;
  fuente?: string; // Fuente de los datos (ej. Google Maps, OpenStreetMap, etc.)
}

type OmitirCreate = '_id';

export interface ICreateGeoCache
  extends Omit<Partial<IGeoCache>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdateGeoCache
  extends Omit<Partial<IGeoCache>, OmitirUpdate> {}
