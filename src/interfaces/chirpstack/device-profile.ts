import { z } from 'zod';

export const GetDeviceProfileChirpstackSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  name: z.string().optional(),
  region: z.string().optional(),
  macVersion: z.string().optional(),
  regParamsRevision: z.string().optional(),
  supportsOtaa: z.boolean().optional(),
  supportsClassB: z.boolean().optional(),
  supportsClassC: z.boolean().optional(),
});
export type IGetDeviceProfileChirpstack = z.infer<
  typeof GetDeviceProfileChirpstackSchema
>;

export const CreateUpdateDeviceProfileChirpstackSchema = z.object({
  deviceProfile: z
    .object({
      abpRx1Delay: z.number().optional(),
      abpRx1DrOffset: z.number().optional(),
      abpRx2Dr: z.number().optional(),
      abpRx2Freq: z.number().optional(),
      adrAlgorithmID: z.string().optional(),
      allowRoaming: z.boolean().optional(),
      autoDetectMeasurements: z.boolean().optional(),
      classBPingSlotDr: z.number().optional(),
      classBPingSlotFreq: z.number().optional(),
      classBPingSlotNbK: z.number().optional(),
      classBTimeout: z.number().optional(),
      classCTimeout: z.number().optional(),
      description: z.string().optional(),
      deviceStatusReqInterval: z.number().optional(),
      flushQueueOnActivate: z.boolean().optional(),
      id: z.string().optional(),
      isRelay: z.boolean().optional(),
      isRelayEd: z.boolean().optional(),
      macVersion: z.string().optional(),
      measurements: z
        .record(
          z.string(),
          z.object({ kind: z.string(), name: z.string() }),
        )
        .optional(),
      name: z.string().optional(),
      payloadCodecRuntime: z.string().optional(),
      payloadCodecScript: z.string().optional(),
      regParamsRevision: z.string().optional(),
      region: z.string().optional(),
      regionConfigId: z.string().optional(),
      relayCadPeriodicity: z.string().optional(),
      relayDefaultChannelIndex: z.number().optional(),
      relayEdActivationMode: z.string().optional(),
      relayEdBackOff: z.number().optional(),
      relayEdRelayOnly: z.boolean().optional(),
      relayEdSmartEnableLevel: z.number().optional(),
      relayEdUplinkLimitBucketSize: z.number().optional(),
      relayEdUplinkLimitReloadRate: z.number().optional(),
      relayEnabled: z.boolean().optional(),
      relayGlobalUplinkLimitBucketSize: z.number().optional(),
      relayGlobalUplinkLimitReloadRate: z.number().optional(),
      relayJoinReqLimitBucketSize: z.number().optional(),
      relayJoinReqLimitReloadRate: z.number().optional(),
      relayNotifyLimitBucketSize: z.number().optional(),
      relayNotifyLimitReloadRate: z.number().optional(),
      relayOverallLimitBucketSize: z.number().optional(),
      relayOverallLimitReloadRate: z.number().optional(),
      relaySecondChannelAckOffset: z.string().optional(),
      relaySecondChannelDr: z.number().optional(),
      relaySecondChannelFreq: z.number().optional(),
      rx1Delay: z.number().optional(),
      supportsClassB: z.boolean().optional(),
      supportsClassC: z.boolean().optional(),

      //////////////////////////////////////////////////////////
      supportsOtaa: z.boolean().optional(),
      /////////////////////////////////////////////////////////

      tags: z.record(z.string(), z.string()).optional(),
      tenantId: z.string().optional(),
      uplinkInterval: z.number().optional(),
    })
    .optional(),
});
export type ICreateUpdateDeviceProfileChirpstack = z.infer<
  typeof CreateUpdateDeviceProfileChirpstackSchema
>;
