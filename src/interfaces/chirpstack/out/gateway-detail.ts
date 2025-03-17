import joi from 'joi';
import j2s from 'joi-to-swagger';
import { commonLocation, ICommonLocationValidation } from './gateway';

export const IGatewayDetailChirpstackDTOValidation = joi.object<IGatewayDetailChirpstackDTO>({
    createdAt: joi.string(),
    firstSeenAt: joi.string(),
    gateway: joi.object<apiGateway>({
        boards: joi.array().items(joi.object<apiGatewayBoard>({
            fineTimestampKey: joi.string(),
            fpgaID: joi.string(),
        })),
        description: joi.object(),
        discoveryEnabled: joi.boolean(),
        gatewayProfileID: joi.object(),
        id: joi.object(),
        location: ICommonLocationValidation,
        metadata: joi.object(),
        name: joi.object(),
        networkServerID: joi.object(),
        organizationID: joi.object(),
        tags: joi.object(),
    }),
    lastSeenAt: joi.string(),
    updatedAt: joi.string(),
});

export const IGatewayDetailChirpstackDTOSwagger = j2s(IGatewayDetailChirpstackDTOValidation).swagger;

export interface apiGatewayBoard {
    fineTimestampKey: string;
    fpgaID: string;
}

export interface apiGateway {
    boards: apiGatewayBoard[];
    description: string;
    discoveryEnabled: boolean;
    gatewayProfileID: string;
    id: string;
    location: commonLocation;
    metadata: Record<string, any>
    name: string;
    networkServerID: string;
    organizationID: string;
    tags: Record<string, any>
}

export interface IGatewayDetailChirpstackDTO {
    createdAt: string;
    firstSeenAt: string;
    gateway: apiGateway;
    lastSeenAt: string;
    updatedAt: string;
}
