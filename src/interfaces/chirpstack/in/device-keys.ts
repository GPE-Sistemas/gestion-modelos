import joi from "joi";
import j2s from "joi-to-swagger";

export const IDeviceKeysChirpstackValidation =
  joi.object<IDeviceKeysChirpstack>({
    deviceKeys: joi.object({
      appKey: joi.string(),
      devEUI: joi.string(),
      genAppKey: joi.string(),
      nwkKey: joi.string(),
    }),
  });

export const IDeviceKeysChirpstackSwagger = j2s(
  IDeviceKeysChirpstackValidation
).swagger;

export interface IDeviceKeysChirpstack {
  deviceKeys: {
    appKey: string;
    devEUI: string;
    genAppKey?: string;
    nwkKey: string;
  };
}
