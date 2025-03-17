import joi from 'joi';
import j2s from 'joi-to-swagger';

export const INetworkServerDetailChirpstackDTOValidation = joi.object<INetworkServerDetailChirpstackDTO>({
    createdAt: joi.string(),
    networkServer: joi.object<apiNetworkServer>({
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
    region: joi.string(),
    updatedAt: joi.string(),
    version: joi.string(),
});

export const INetworkServerDetailChirpstackDTOSwagger = j2s(INetworkServerDetailChirpstackDTOValidation).swagger;

export interface apiNetworkServer {
    caCert: string;
    gatewayDiscoveryDR: number;
    gatewayDiscoveryEnabled: boolean;
    gatewayDiscoveryInterval: number;
    gatewayDiscoveryTXFrequency: number;
    id: string;
    name: string;
    routingProfileCACert: string;
    routingProfileTLSCert: string;
    routingProfileTLSKey: string;
    server: string;
    tlsCert: string;
    tlsKey: string;
}

export interface INetworkServerDetailChirpstackDTO {
    createdAt: string;
    networkServer: apiNetworkServer;
    region: string;
    updatedAt: string;
    version: string;
}
