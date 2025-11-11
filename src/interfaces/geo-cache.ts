export interface IGeoCache {
  _id?: string;
  fechaCreacion?: string;
  geojson?: {
    type?: 'Point';
    coordinates?: [number, number]; // [lon, lat]
  };
  geohash?: string;
  direccion?: string;
}
