import joi from "joi";
import j2s from "joi-to-swagger";

export const IDeviceChirpstackValidation = joi.object<IDeviceChirpstack>({
  device: joi.object({
    applicationID: joi.string(),
    description: joi.string(),
    devEUI: joi.string(),
    deviceProfileID: joi.string(),
    isDisabled: joi.boolean(),
    name: joi.string(),
    referenceAltitude: joi.number(),
    skipFCntCheck: joi.boolean(),
    tags: joi.object(),
    variables: joi.object(),
  }),
});

export const IDeviceChirpstackSwagger = j2s(
  IDeviceChirpstackValidation
).swagger;

export interface IDeviceChirpstack {
  device: {
    applicationID: string;
    description: string;
    devEUI: string;
    deviceProfileID: string;
    isDisabled?: boolean;
    name: string;
    referenceAltitude?: number;
    skipFCntCheck?: boolean;
    tags?: Record<string, string>;
    variables?: Record<string, string>;
  };
}
