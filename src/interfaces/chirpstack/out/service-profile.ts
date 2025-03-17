import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IServiceProfileChirpstackDTOValidation = joi.object<IServiceProfileChirpstackDTO>({
    result: joi.object({
        createdAt: joi.string(),
        id: joi.string(),
        name: joi.string(),
        networkServerID: joi.string(),
        networkServerName: joi.string(),
        organizationID: joi.string(),
        updatedAt: joi.string(),
    }),
    totalCount: joi.string(),
});

export const IServiceProfileChirpstackDTOSwagger = j2s(IServiceProfileChirpstackDTOValidation).swagger;

export interface apiServiceProfileListItem  {
    createdAt: string;
    id: string;
    name: string;
    networkServerID: string;
    networkServerName: string;
    organizationID: string;
    updatedAt: string;
}

export interface IServiceProfileChirpstackDTO {
    result: apiServiceProfileListItem [];
    totalCount: string;
}
