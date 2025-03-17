import joi from "joi";
import j2s from "joi-to-swagger";

export const INetworkServerChirpstackValidation =
  joi.object<INetworkServerChirpstack>({
    networkServer: joi.object({
      caCert: joi.string(),
      gatewayDiscoveryDR: joi.number(),
      gatewayDiscoveryEnabled: joi.boolean(),
      gatewayDiscoveryInterval: joi.number(),
      gatewayDiscoveryTXFrequency: joi.number(),
      id: joi.string(),
      name: joi.string(),
      routingProfileCACert: joi.string(),
      routingProfileTLSCert: joi.string(),
      routingProfileTLSKey: joi.string(),
      server: joi.string(),
      tlsCert: joi.string(),
      tlsKey: joi.string(),
    }),
  });

export const INetworkServerChirpstackSwagger = j2s(
  INetworkServerChirpstackValidation
).swagger;

export interface INetworkServerChirpstack {
  networkServer: {
    caCert?: string;
    gatewayDiscoveryDR?: number;
    gatewayDiscoveryEnabled?: boolean;
    gatewayDiscoveryInterval?: number;
    gatewayDiscoveryTXFrequency?: number;
    id?: string;
    name: string;
    routingProfileCACert?: string;
    routingProfileTLSCert?: string;
    routingProfileTLSKey?: string;
    server: string;
    tlsCert?: string;
    tlsKey?: string;
  };
}
