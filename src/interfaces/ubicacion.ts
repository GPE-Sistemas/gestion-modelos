import { IGeoJSON } from '../auxiliares';
import { ICliente } from './cliente';
import { Dia, Frecuencia } from './config-evento-usuario';

export type ICategoriaUbicacion =
  | 'Normal'
  | 'Zona'
  | 'Terminal'
  | 'Domicilio'
  | 'Activos'
  | 'Centro de Atención'
  | 'Hospital'
  | 'Vehiculos';

export interface IUbicacion {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  identificacion?: string;
  fechaCreacion?: string;
  categoria?: ICategoriaUbicacion;
  direccion?: string;
  geojson?: IGeoJSON;
  fotos?: string[];
  color?: string;
  excepcionesEvento?: {
    genera?: boolean; // Si genera o no evento
    // Agrupaciones temporales
    frecuencia?: Frecuencia;
    // Fechas de vigencia para generar los eventos
    validaDesde?: string;
    validaHasta?: string;
    // Frecuencia de generacion de eventos
    generarSoloUnaVez?: boolean;
    // Si pasa el periodo y sigue activa se genera el evento
    generarSiNoSeCumple?: boolean;
    // Dentro del cronograma
    dias?: Dia[];
    horaInicio?: string;
    horaFin?: string;
    // Minutos que se agregan a los periodos de vigencia
    minutosDeGracia?: number;
  };
  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'cliente';
export interface ICreateUbicacion extends Omit<
  Partial<IUbicacion>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente';
export interface IUpdateUbicacion extends Omit<
  Partial<IUbicacion>,
  OmitirUpdate
> {}

export interface IUbicacionCache extends Omit<
  IUbicacion,
  'cliente' | 'ancestros'
> {}
