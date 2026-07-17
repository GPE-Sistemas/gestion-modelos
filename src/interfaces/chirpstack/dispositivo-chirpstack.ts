import { z } from 'zod';

export const DeviceInfoChirpstackSchema = z.object({
  applicationId: z.string().optional(),
  description: z.string().optional(),
  devEui: z.string().optional(),
  deviceProfileId: z.string().optional(),
  isDisabled: z.boolean().optional(),
  joinEui: z.string().optional(),
  name: z.string().optional(),
  skipFcntCheck: z.boolean().optional(),
  tags: z.record(z.string(), z.string()).optional(),
  variables: z.record(z.string(), z.string()).optional(),
});
export type IDeviceInfo = z.infer<typeof DeviceInfoChirpstackSchema>;

export const CreateUpdateDeviceChirpstackSchema = z.object({
  device: DeviceInfoChirpstackSchema.optional(),
});
export type ICreateUpdateDeviceChirpstack = z.infer<
  typeof CreateUpdateDeviceChirpstackSchema
>;

export const DeviceStatusSchema = z.object({
  batteryLevel: z.number().optional(),
  externalPowerSource: z.boolean().optional(),
  margin: z.number().optional(),
});
export type IDeviceStatus = z.infer<typeof DeviceStatusSchema>;

export const DeviceChirpstackSchema = z.object({
  classEnabled: z.string().optional(),
  createdAt: z.string().optional(),
  lastSeenAt: z.string().optional(),
  updatedAt: z.string().optional(),
  device: DeviceInfoChirpstackSchema.optional(),
  deviceStatus: DeviceStatusSchema.optional(),
});
export type IDeviceChirpstack = z.infer<typeof DeviceChirpstackSchema>;
