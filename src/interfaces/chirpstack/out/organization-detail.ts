import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IOrganizationDetailChirpstackDTOValidation = joi.object<IOrganizationDetailChirpstackDTO>({
    createdAt: joi.string(),
    organization: joi.object<apiOrganization>({
        canHaveGateways: joi.boolean(),
        displayName: joi.string(),
        id: joi.string(),
        maxDeviceCount: joi.number(),
        maxGatewayCount: joi.number(),
        name: joi.string(),
    }),
    updatedAt: joi.string(),
});

export const IOrganizationDetailChirpstackDTOSwagger = j2s(IOrganizationDetailChirpstackDTOValidation).swagger;

export interface apiOrganization {
    canHaveGateways: boolean;
    displayName: string;
    id: string;
    maxDeviceCount: number;
    maxGatewayCount: number;
    name: string;
}

export interface IOrganizationDetailChirpstackDTO {
    createdAt: string;
    organization: apiOrganization;
    updatedAt: string;
}
