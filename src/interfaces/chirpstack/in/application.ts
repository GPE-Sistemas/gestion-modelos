import joi from "joi";
import j2s from "joi-to-swagger";

export const IApplicationChirpstackValidation =
  joi.object<IApplicationChirpstack>({
    application: joi.object({
      description: joi.string(),
      id: joi.string(),
      name: joi.string(),
      organizationID: joi.string(),
      payloadCodec: joi.string(),
      payloadDecoderScript: joi.string(),
      payloadEncoderScript: joi.string(),
      serviceProfileID: joi.string(),
    }),
  });

export const IApplicationChirpstackSwagger = j2s(
  IApplicationChirpstackValidation
).swagger;

export interface IApplicationChirpstack {
  application: {
    description: string;
    id?: string;
    name: string;
    organizationID: string;
    payloadCodec?: string;
    payloadDecoderScript?: string;
    payloadEncoderScript?: string;
    serviceProfileID: string;
  };
}
