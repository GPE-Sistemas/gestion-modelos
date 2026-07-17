import { z } from 'zod';

/**
 * @todo Usar estas otras a través del sistema
 */

export const DrivingSideSchema = z.enum([
  'left',
  'right',
  'slight left',
  'straight',
]);
export type DrivingSide = z.infer<typeof DrivingSideSchema>;

export const ModeSchema = z.enum(['driving']);
export type Mode = z.infer<typeof ModeSchema>;

export const IntersectionSchema = z.object({
  out: z.number().optional(),
  entry: z.array(z.boolean()),
  bearings: z.array(z.number()),
  location: z.array(z.number()),
  in: z.number().optional(),
});
export type Intersection = z.infer<typeof IntersectionSchema>;

export const ManeuverSchema = z.object({
  bearing_after: z.number(),
  type: z.string(),
  modifier: DrivingSideSchema.optional(),
  bearing_before: z.number(),
  location: z.array(z.number()),
});
export type Maneuver = z.infer<typeof ManeuverSchema>;

export const StepSchema = z.object({
  intersections: z.array(IntersectionSchema),
  driving_side: DrivingSideSchema,
  geometry: z.string(),
  mode: ModeSchema,
  duration: z.number(),
  maneuver: ManeuverSchema,
  weight: z.number(),
  distance: z.number(),
  name: z.string(),
});
export type Step = z.infer<typeof StepSchema>;

export const LegSchema = z.object({
  steps: z.array(StepSchema),
  distance: z.number(),
  duration: z.number(),
  summary: z.string(),
  weight: z.number(),
});
export type Leg = z.infer<typeof LegSchema>;

export const RouteSchema = z.object({
  legs: z.array(LegSchema),
  distance: z.number(),
  duration: z.number(),
  weight_name: z.string(),
  weight: z.number(),
  geometry: z.object({
    type: z.string(),
    coordinates: z.array(z.array(z.number())),
  }),
});
export type Route = z.infer<typeof RouteSchema>;

export const WaypointSchema = z.object({
  hint: z.string(),
  distance: z.number(),
  name: z.string(),
  location: z.array(z.number()),
});
export type Waypoint = z.infer<typeof WaypointSchema>;

export const RouteResponseSchema = z.object({
  code: z.string().optional(),
  routes: z.array(RouteSchema).optional(),
  waypoints: z.array(WaypointSchema).optional(),
  message: z.string().optional(),
});
export type IRouteResponse = z.infer<typeof RouteResponseSchema>;

export const TracepointSchema = WaypointSchema.extend({
  //   matchings_index: Index to the Route object in matchings the sub-trace was matched to.
  // waypoint_index: Index of the waypoint inside the matched route.
  // alternatives_count: Number of probable alternative matchings for this trace point. A value of zero indicate that this point was matched unambiguously. Split the trace at these points for incremental map matching.
  matchings_index: z.number().optional(),
  waypoint_index: z.number().optional(),
  alternatives_count: z.number().optional(),
});
export type Tracepoint = z.infer<typeof TracepointSchema>;

export const MatchingsSchema = RouteSchema.extend({
  // confidence: Confidence of the matching. float value between 0 and 1. 1 is very confident that the matching is correct.
  confidence: z.number().optional(),
});
export type Matchings = z.infer<typeof MatchingsSchema>;

export const MatchResponseSchema = z.object({
  code: z.string().optional(),
  tracepoints: z.array(TracepointSchema).optional(),
  matchings: z.array(MatchingsSchema).optional(),
});
export type IMatchResponse = z.infer<typeof MatchResponseSchema>;

export const NearestSchema = z.object({
  hint: z.string(),
  distance: z.number(),
  name: z.string(),
  location: z.array(z.number()),
});
export type INearest = z.infer<typeof NearestSchema>;

export const NearestResponseSchema = z.object({
  waypoints: z.array(NearestSchema),
  code: z.string(),
});
export type INearestResponse = z.infer<typeof NearestResponseSchema>;
