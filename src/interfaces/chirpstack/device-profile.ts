import joi from "joi";
import j2s from "joi-to-swagger";

export const IDeviceProfileChirpstackValidation =
  joi.object<IDeviceProfileChirpstack>({
    deviceProfile: joi.object({
      classBTimeout: joi.number(),
      classCTimeout: joi.number(),
      factoryPresetFreqs: joi.array().items(joi.number()),
      geolocBufferTTL: joi.number(),
      geolocMinBufferSize: joi.number(),
      id: joi.string(),
      macVersion: joi.string(),
      maxDutyCycle: joi.number(),
      maxEIRP: joi.number(),
      name: joi.string(),
      networkServerID: joi.string(),
      organizationID: joi.string(),
      payloadCodec: joi.string(),
      payloadDecoderScript: joi.string(),
      payloadEncoderScript: joi.string(),
      pingSlotDR: joi.number(),
      pingSlotFreq: joi.number(),
      pingSlotPeriod: joi.number(),
      regParamsRevision: joi.string(),
      rfRegion: joi.string(),
      rxDROffset1: joi.number(),
      rxDataRate2: joi.number(),
      rxDelay1: joi.number(),
      rxFreq2: joi.number(),
      supports32BitFCnt: joi.boolean(),
      supportsClassB: joi.boolean(),
      supportsClassC: joi.boolean(),
      supportsJoin: joi.boolean(),
      tags: joi.object(),
      uplinkInterval: joi.string(),
    }),
  });
