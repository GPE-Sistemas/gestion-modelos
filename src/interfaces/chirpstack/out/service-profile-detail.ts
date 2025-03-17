import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IServiceProfileDetailChirpstackDTOValidation = joi.object<IServiceProfileDetailChirpstackDTO>({
    createdAt: joi.string(),
    updatedAt: joi.string(),
    serviceProfile: joi.object<apiServiceProfile>({
        addGWMetaData: joi.boolean(),
        channelMask: joi.string(),
        devStatusReqFreq: joi.number(),
        dlBucketSize: joi.number(),
        dlRate: joi.number(),
        dlRatePolicy: joi.string().valid('DROP', 'MARK'),
        drMax: joi.number(),
        drMin: joi.number(),
        hrAllowed: joi.boolean(),
        id: joi.string(),
        minGWDiversity: joi.number(),
        name: joi.string(),
        networkServerID: joi.string(),
        nwkGeoLoc: joi.boolean(),
        organizationID: joi.string(),
        prAllowed: joi.boolean(),
        raAllowed: joi.boolean(),
        reportDevStatusBattery: joi.boolean(),
        reportDevStatusMargin: joi.boolean(),
        targetPER: joi.number(),
        ulBucketSize: joi.number(),
        ulRate: joi.number(),
        ulRatePolicy: joi.string().valid('DROP', 'MARK'),
    }),
});

export const IServiceProfileDetailChirpstackDTOSwagger = j2s(IServiceProfileDetailChirpstackDTOValidation).swagger;

export interface apiServiceProfile {
    addGWMetaData: boolean;
    channelMask: string;
    devStatusReqFreq: number;
    dlBucketSize: number;
    dlRate: number;
    dlRatePolicy: 'DROP' | 'MARK';
    drMax: number;
    drMin: number;
    hrAllowed: boolean;
    id: string;
    minGWDiversity: number;
    name: string;
    networkServerID: string;
    nwkGeoLoc: boolean;
    organizationID: string;
    prAllowed: boolean;
    raAllowed: boolean;
    reportDevStatusBattery: boolean;
    reportDevStatusMargin: boolean;
    targetPER: number;
    ulBucketSize: number;
    ulRate: number;
    ulRatePolicy: 'DROP' | 'MARK';
}

export interface IServiceProfileDetailChirpstackDTO {
    createdAt: string;
    serviceProfile: apiServiceProfile
    updatedAt: string;
}
