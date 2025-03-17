import joi from 'joi';
import j2s from 'joi-to-swagger';

export const ICommonLocationValidation = joi.object<commonLocation>({
    accuracy: joi.number(),
    altitude: joi.number(),
    latitude: joi.number(),
    longitude: joi.number(),
    source: joi.string().valid('UNKNOWN', 'GPS', 'CONFIG', 'GEO_RESOLVER_TDOA', 'GEO_RESOLVER_RSSI', 'GEO_RESOLVER_GNSS', 'GEO_RESOLVER_WIFI'),
});

export interface commonLocation {
    accuracy: number;
    altitude: number;
    latitude: number;
    longitude: number;
    source: 'UNKNOWN' | 'GPS' | 'CONFIG' | 'GEO_RESOLVER_TDOA' | 'GEO_RESOLVER_RSSI' | 'GEO_RESOLVER_GNSS' | 'GEO_RESOLVER_WIFI';
}

export const IGatewayChirpstackDTOValidation = joi.object<IGatewayChirpstackDTO>({
    result: joi.object({
        createdAt: joi.string(),
        description: joi.string(),
        firstSeenAt: joi.string(),
        id: joi.string(),
        lastSeenAt: joi.string(),
        location: ICommonLocationValidation,
        name: joi.string(),
        networkServerID: joi.string(),
        networkServerName: joi.string(),
        organizationID: joi.string(),
        updatedAt: joi.string(),
    }),
    totalCount: joi.string(),
});

export const IGatewayChirpstackDTOSwagger = j2s(IGatewayChirpstackDTOValidation).swagger;

export interface apiGatewayListItem {
    createdAt: string;
    description: string;
    firstSeenAt: string;
    id: string;
    lastSeenAt: string;
    location: commonLocation;
    name: string;
    networkServerID: string;
    networkServerName: string;
    organizationID: string;
    updatedAt: string;
}

export interface IGatewayChirpstackDTO {
    result: apiGatewayListItem[];
    totalCount: string;
}
