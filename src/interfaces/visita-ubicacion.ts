export type RolEnVisita = 'arribo' | 'partida' | 'contiene' | 'durante';

export interface IVisitaTrip {
  tripId?: string;
  startTime?: string;
  endTime?: string;
  distance?: number;
  duration?: number;
  maxSpeed?: number;
  avgSpeed?: number;
  startLat?: number;
  startLon?: number;
  endLat?: number;
  endLon?: number;
  rolEnVisita?: RolEnVisita;
}

export interface IVisitaUbicacion {
  entrada?: string;
  salida?: string;
  permanenciaSegundos?: number;
  cantidadReportes?: number;
  yaEstabaAlInicio?: boolean;
  seguiaAlFinal?: boolean;
  trips?: IVisitaTrip[];
}

export interface IQueryVisitasUbicacion {
  idVehiculo?: string;
  from?: string;
  to?: string;
  gapMin?: number;
}
