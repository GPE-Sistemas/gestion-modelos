import { IGeoJSONPoint } from '../auxiliares';

export interface IRoadSpeedCache {
  _id?: string;
  fechaCreacion?: string;
  geojson?: IGeoJSONPoint;
  geohash?: string;
  maxspeed?: number; // km/h ya normalizado
  unidad?: string; // 'km/h' | 'mph' (unidad original de la fuente)
  desconocido?: boolean; // true si no se pudo determinar ningún límite usable
  confianza?: string; // 'explicito' | 'inferido' (informativo, no configurable)
  fuente?: string; // 'tomtom' | 'osm' | 'fallback'
}

type OmitirCreate = '_id';

export interface ICreateRoadSpeedCache
  extends Omit<Partial<IRoadSpeedCache>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdateRoadSpeedCache
  extends Omit<Partial<IRoadSpeedCache>, OmitirUpdate> {}
