import { z } from 'zod';

/**
 * Interfaces para Tripero - Sistema de detección de viajes
 */

/**
 * Viaje actual en progreso
 */
export const CurrentTripSchema = z.object({
  tripId: z.string(),
  startTime: z.string(),
  duration: z.number(),
  distance: z.number(),
  avgSpeed: z.number(),
  maxSpeed: z.number(),
  odometerAtStart: z.number(),
  startLat: z.number().optional(),
  startLon: z.number().optional(),
});
export type ICurrentTrip = z.infer<typeof CurrentTripSchema>;

/**
 * Estado completo del tracker
 */
export const TrackerStatusSchema = z.object({
  trackerId: z.string(),
  deviceId: z.string(),
  odometer: z.object({
    total: z.number(),
    totalKm: z.number(),
    currentTrip: z.number().optional(),
    currentTripKm: z.number().optional(),
  }),
  currentState: z.object({
    state: z.enum(['STOPPED', 'IDLE', 'MOVING', 'UNKNOWN', 'OFFLINE']),
    since: z.string(),
    duration: z.number(),
  }),
  lastPosition: z
    .object({
      timestamp: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      speed: z.number(),
      ignition: z.boolean(),
      heading: z.number(),
      altitude: z.number(),
      age: z.number(),
    })
    .optional(),
  currentTrip: CurrentTripSchema.optional(),
  statistics: z.object({
    totalTrips: z.number(),
    totalDrivingTime: z.number(),
    totalDrivingHours: z.number(),
    totalIdleTime: z.number(),
    totalIdleHours: z.number(),
    totalStops: z.number(),
    firstSeen: z.string(),
    lastSeen: z.string(),
    daysActive: z.number(),
  }),
  health: z.object({
    status: z.enum(['online', 'offline', 'stale']),
    lastSeenAgo: z.number(),
  }),
  powerDiagnostic: z
    .object({
      powerType: z.enum(['permanent', 'switched', 'unknown']),
      overnightGapCount: z.number(),
      lastOvernightGapAt: z.string().optional(),
      hasPowerIssue: z.boolean(),
      recommendation: z.string().optional(),
    })
    .optional(),
});
export type ITrackerStatus = z.infer<typeof TrackerStatusSchema>;

/**
 * Respuesta del endpoint /tripero/status/:id
 */
export const TrackerStatusResponseSchema = z.object({
  success: z.boolean(),
  data: TrackerStatusSchema,
});
export type ITrackerStatusResponse = z.infer<
  typeof TrackerStatusResponseSchema
>;

export const TripSchema = z.object({
  deviceId: z.number().optional(),
  deviceName: z.string().optional(),
  maxSpeed: z.number().optional(),
  averageSpeed: z.number().optional(),
  distance: z.number().optional(),
  spentFuel: z.number().optional(),
  duration: z.number().optional(),
  startTime: z.string().optional(),
  startAddress: z.string().optional(),
  startLat: z.number().optional(),
  startLon: z.number().optional(),
  endTime: z.string().optional(),
  endAddress: z.string().optional(),
  endLat: z.number().optional(),
  endLon: z.number().optional(),
  driverUniqueId: z.number().optional(),
  driverName: z.string().optional(),
});
export type Trip = z.infer<typeof TripSchema>;

export const StopSchema = z.object({
  deviceId: z.number().optional(),
  deviceName: z.string().optional(),
  distance: z.number().optional(),
  averageSpeed: z.number().optional(),
  maxSpeed: z.number().optional(),
  spentFuel: z.number().optional(),
  startOdometer: z.number().optional(),
  endOdometer: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  positionId: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  duration: z.number().optional(),
  engineHours: z.number().optional(),
});
export type Stop = z.infer<typeof StopSchema>;

export const QueryTriperoSchema = z.object({
  idVehiculo: z.string(),
  from: z.string(),
  to: z.string(),
  limit: z.number().optional(),
});
export type IQueryTripero = z.infer<typeof QueryTriperoSchema>;
