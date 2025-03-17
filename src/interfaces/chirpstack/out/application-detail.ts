import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IApplicationDetailChirpstackDTOValidation = joi.object<IApplicationDetailChirpstackDTO>({
    application: joi.object<apiApplication>({
        description: joi.string(),
        id: joi.string(),
        name: joi.string(),
        organizationID: joi.string(),
        payloadCodec: joi.string(),
        payloadDecoderScript: joi.string(),
        payloadEncoderScript: joi.string(),
        serviceProfileID: joi.string(),
    }),
});

export const IApplicationDetailChirpstackDTOSwagger = j2s(IApplicationDetailChirpstackDTOValidation).swagger;

export interface apiApplication {
    description: string;
    id: string;
    name: string;
    organizationID: string;
    payloadCodec: string;
    payloadDecoderScript: string;
    payloadEncoderScript: string;
    serviceProfileID: string;
}

export interface IApplicationDetailChirpstackDTO {
    application: apiApplication
}
