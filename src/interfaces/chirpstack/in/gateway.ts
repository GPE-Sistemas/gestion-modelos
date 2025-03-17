import joi from "joi";
import j2s from "joi-to-swagger";

export const IGatewayChirpstackValidation = joi.object<IGatewayChirpstack>({
  gateway: joi.object({
    boards: joi.array().items(
      joi.object({
        fineTimestampKey: joi.string(),
        fpgaID: joi.string(),
      })
    ),
    description: joi.string(),
    discoveryEnabled: joi.boolean(),
    gatewayProfileID: joi.string(),
    id: joi.string(),
    location: joi.object({
      accuracy: joi.number(),
      altitude: joi.number(),
      latitude: joi.number(),
      longitude: joi.number(),
      source: joi
        .string()
        .valid(
          "UNKNOWN",
          "GPS",
          "CONFIG",
          "GEO_RESOLVER_TDOA",
          "GEO_RESOLVER_RSSI",
          "GEO_RESOLVER_GNSS",
          "GEO_RESOLVER_WIFI"
        ),
    }),
    metadata: joi.object(),
    name: joi.string(),
    networkServerID: joi.string(),
    organizationID: joi.string(),
    tags: joi.object(),
  }),
});

export const IGatewayChirpstackSwagger = j2s(
  IGatewayChirpstackValidation
).swagger;

export interface IGatewayChirpstack {
  gateway: {
    boards?: {
      fineTimestampKey: string;
      fpgaID: string;
    }[];
    description?: string;
    discoveryEnabled?: boolean;
    gatewayProfileID?: string;
    id: string;
    location: {
      accuracy?: number;
      altitude?: number;
      latitude?: number;
      longitude?: number;
      source:
        | "UNKNOWN"
        | "GPS"
        | "CONFIG"
        | "GEO_RESOLVER_TDOA"
        | "GEO_RESOLVER_RSSI"
        | "GEO_RESOLVER_GNSS"
        | "GEO_RESOLVER_WIFI";
    };
    metadata?: Record<string, string>;
    name: string;
    networkServerID: string;
    organizationID: string;
    tags?: Record<string, string>;
  };
}
