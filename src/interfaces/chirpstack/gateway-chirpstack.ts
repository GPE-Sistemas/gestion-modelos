import { z } from 'zod';

export const LocationGatewaySchema = z.object({
  accuracy: z.number().optional(),
  altitude: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  source: z.string().optional(),
});
export type ILocationGateway = z.infer<typeof LocationGatewaySchema>;

export const GatewayInfoSchema = z.object({
  description: z.string().optional(),
  gatewayId: z.string().optional(), //Este es el gatewayEui
  location: LocationGatewaySchema.optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  name: z.string().optional(),
  statsInterval: z.number().optional(),
  tags: z.record(z.string(), z.string()).optional(),
  tenantId: z.string().optional(),
});
export type IGatewayInfo = z.infer<typeof GatewayInfoSchema>;

export const CreateUpdateGatewayChirpstackSchema = z.object({
  gateway: GatewayInfoSchema.optional(),
});
export type ICreateUpdateGatewayChirpstack = z.infer<
  typeof CreateUpdateGatewayChirpstackSchema
>;

export const GatewayChirpstackSchema = GatewayInfoSchema.omit({
  metadata: true,
  tags: true,
  statsInterval: true,
}).extend({
  createdAt: z.string().optional(),
  lastSeenAt: z.string().optional(),
  updatedAt: z.string().optional(),
  properties: z.record(z.string(), z.string()).optional(),
  state: z.string(),
});
export type IGatewayChirpstack = z.infer<typeof GatewayChirpstackSchema>;
