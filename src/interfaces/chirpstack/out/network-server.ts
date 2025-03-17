import joi from 'joi';
import j2s from 'joi-to-swagger';

export const INetworkServerChirpstackDTOValidation = joi.object<INetworkServerChirpstackDTO>({
    result: joi.object({
        createdAt: joi.string(),
        id: joi.string(),
        name: joi.string(),
        server: joi.string(),
        updatedAt: joi.string(),
    }),
    totalCount: joi.string(),
});

export const INetworkServerChirpstackDTOSwagger = j2s(INetworkServerChirpstackDTOValidation).swagger;

export interface apiListNetworkServerResponse {
    createdAt: string;
    id: string;
    name: string;
    server: string;
    updatedAt: string;
}

export interface INetworkServerChirpstackDTO {
    result: apiListNetworkServerResponse[];
    totalCount: string;
}
