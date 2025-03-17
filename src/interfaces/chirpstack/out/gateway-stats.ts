import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IGatewayStatsChirpstackDTOValidation = joi.object<IGatewayStatsChirpstackDTO>({
    result: joi.object({
        rxPacketsReceived: joi.number(),
        rxPacketsReceivedOK: joi.number(),
        timestamp: joi.string(),
        txPacketsEmitted: joi.number(),
        txPacketsReceived: joi.number(),
    })
});

export const IGatewayStatsChirpstackDTOSwagger = j2s(IGatewayStatsChirpstackDTOValidation).swagger;

export interface apiGatewayStats {
    rxPacketsReceived: number;
    rxPacketsReceivedOK: number;
    timestamp: string;
    txPacketsEmitted: number;
    txPacketsReceived: number;
}

export interface IGatewayStatsChirpstackDTO {
    result: apiGatewayStats[];
}