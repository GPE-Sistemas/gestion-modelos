import joi from "joi";
import j2s from "joi-to-swagger";

export const IOrganizationChirpstackValidation =
  joi.object<IOrganizationChirpstack>({
    organization: joi.object({
      canHaveGateways: joi.boolean(),
      displayName: joi.string(),
      id: joi.string(),
      maxDeviceCount: joi.number(),
      maxGatewayCount: joi.number(),
      name: joi.string(),
    }),
  });

export const IOrganizationChirpstackSwagger = j2s(
  IOrganizationChirpstackValidation
).swagger;

export interface IOrganizationChirpstack {
  organization: {
    canHaveGateways: boolean;
    displayName: string;
    id?: string;
    maxDeviceCount: number;
    maxGatewayCount: number;
    name: string;
  };
}
