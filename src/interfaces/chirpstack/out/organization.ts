import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IOrganizationChirpstackDTOValidation = joi.object<IOrganizationChirpstackDTO>({
    result: joi.object({
        canHaveGateways: joi.boolean(),
        createdAt: joi.string(),
        displayName: joi.string(),
        id: joi.string(),
        name: joi.string(),
        updatedAt: joi.string(),
    }),
    totalCount: joi.string(),
});

export const IOrganizationChirpstackDTOSwagger = j2s(IOrganizationChirpstackDTOValidation).swagger;

export interface apiOrganizationListItem {
    canHaveGateways: boolean;
    createdAt: string;
    displayName: string;
    id: string;
    name: string;
    updatedAt: string;
}

export interface IOrganizationChirpstackDTO {
    result: apiOrganizationListItem [];
    totalCount: string;
}
