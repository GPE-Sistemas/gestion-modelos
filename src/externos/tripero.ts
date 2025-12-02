/**
 * Interfaces para Tripero - Sistema de detección de viajes
 */

/**
 * Viaje actual en progreso
 */
export interface ICurrentTrip {
  tripId: string;
  startTime: string;
  duration: number;
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  odometerAtStart: number;
  startLat?: number;
  startLon?: number;
}

/**
 * Estado completo del tracker
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

/**
 * Respuesta del endpoint /tripero/status/:id
 */
export interface ITrackerStatusResponse {
  success: boolean;
  data: ITrackerStatus;
}
