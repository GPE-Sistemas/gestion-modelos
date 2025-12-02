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
  idVehiculo: string;
  from: string;
  to: string;
}

/**
 * Viaje actual en progreso (desde Tripero)
 */
export interface ICurrentTrip {
  tripId: string;
  startTime: string;
  duration: number;
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  odometerAtStart: number;
}

/**
 * Estado del tracker (desde Tripero)
 */
export interface ITrackerStatus {
  trackerId: string;
  deviceId: string;
  odometer: {
    total: number;
    totalKm: number;
    currentTrip?: number;
    currentTripKm?: number;
  };
  currentState: {
    state: 'STOPPED' | 'IDLE' | 'MOVING' | 'UNKNOWN' | 'OFFLINE';
    since: string;
    duration: number;
  };
  lastPosition?: {
    timestamp: string;
    latitude: number;
    longitude: number;
    speed: number;
    ignition: boolean;
    heading: number;
    altitude: number;
    age: number;
  };
  currentTrip?: ICurrentTrip;
  statistics: {
    totalTrips: number;
    totalDrivingTime: number;
    totalDrivingHours: number;
    totalIdleTime: number;
    totalIdleHours: number;
    totalStops: number;
    firstSeen: string;
    lastSeen: string;
    daysActive: number;
  };
  health: {
    status: 'online' | 'offline' | 'stale';
    lastSeenAgo: number;
  };
  powerDiagnostic?: {
    powerType: 'permanent' | 'switched' | 'unknown';
    overnightGapCount: number;
    lastOvernightGapAt?: string;
    hasPowerIssue: boolean;
    recommendation?: string;
  };
}

export interface ITrackerStatusResponse {
  success: boolean;
  data: ITrackerStatus;
}

/**
 * @todo Usar estas otras a través del sistema
 */
