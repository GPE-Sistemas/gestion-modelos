import { ICoordenadas } from './coordenadas';

export interface DireccionV2 {
  calle?: string;
  numero?: string;
  barrio?: string;
  localidad?: string;
  partido?: string;
  provincia?: string;
  direccion?: string;
  coordenadas?: ICoordenadas;
}
