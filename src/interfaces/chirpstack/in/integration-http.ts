import joi from "joi";
import j2s from "joi-to-swagger";

export const IIntegrationHTTPChirpstackValidation =
  joi.object<IIntegrationHTTPChirpstack>({
    integration: joi.object({
      ackNotificationURL: joi.string(),
      applicationID: joi.string(),
      errorNotificationURL: joi.string(),
      eventEndpointURL: joi.string(),
      headers: joi.array().items(
        joi.object({
          key: joi.string(),
          value: joi.string(),
        })
      ),
      integrationNotificationURL: joi.string(),
      joinNotificationURL: joi.string(),
      locationNotificationURL: joi.string(),
      marshaler: joi.string().valid("JSON", "PROTOBUF", "JSON_V3"),
      statusNotificationURL: joi.string(),
      txAckNotificationURL: joi.string(),
      uplinkDataURL: joi.string(),
    }),
  });

export const IIntegrationHTTPChirpstackSwagger = j2s(
  IIntegrationHTTPChirpstackValidation
).swagger;

export interface IIntegrationHTTPChirpstack {
  integration: {
    ackNotificationURL?: string;
    applicationID: string;
    errorNotificationURL?: string;
    eventEndpointURL: string;
    headers?: {
      key: string;
      value: string;
    }[];
    integrationNotificationURL?: string;
    joinNotificationURL?: string;
    locationNotificationURL?: string;
    marshaler?: "JSON" | "PROTOBUF" | "JSON_V3";
    statusNotificationURL?: string;
    txAckNotificationURL?: string;
    uplinkDataURL?: string;
  };
}
