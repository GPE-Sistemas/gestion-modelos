export interface Trip {
  deviceId?: number;
  deviceName?: string;
  maxSpeed?: number;
  averageSpeed?: number;
  distance?: number;
  spentFuel?: number;
  duration?: number;
  startTime?: string;
  startAddress?: string;
  startLat?: number;
  startLon?: number;
  endTime?: string;
  endAddress?: string;
  endLat?: number;
  endLon?: number;
  driverUniqueId?: number;
  driverName?: string;
}

export interface Stop {
  deviceId?: number;
  deviceName?: string;
  distance?: number;
  averageSpeed?: number;
  maxSpeed?: number;
  spentFuel?: number;
  startOdometer?: number;
  endOdometer?: number;
  startTime?: string;
  endTime?: string;
  positionId?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  duration?: number;
  engineHours?: number;
}

export interface IQueryTraccar {
  idColectivo: string;
  from: string;
  to: string;
}

/**
 * @todo Usar estas otras a través del sistema
 */
