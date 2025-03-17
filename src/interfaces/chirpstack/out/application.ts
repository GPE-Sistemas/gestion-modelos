import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IApplicationChirpstackDTOValidation = joi.object<IApplicationChirpstackDTO>({
    result: joi.object({
        description: joi.string(),
        id: joi.string(),
        name: joi.string(),
        organizationID: joi.string(),
        serviceProfileID: joi.string(),
        serviceProfileName: joi.string(),
    }),
    totalCount: joi.string(),
});

export const IApplicationChirpstackDTOSwagger = j2s(IApplicationChirpstackDTOValidation).swagger;

export interface apiApplicationListItem  {
    description: string;
    id: string;
    name: string;
    organizationID: string;
    serviceProfileID: string;
    serviceProfileName: string;
}

export interface IApplicationChirpstackDTO {
    result: apiApplicationListItem [];
    totalCount: string;
}
