import joi from 'joi';
import j2s from 'joi-to-swagger';

export const IDeviceProfileDetailChirpstackDTOValidation = joi.object<IDeviceProfileDetailChirpstackDTO>({
    createdAt: joi.string(),
    updatedAt: joi.string(),
    deviceProfile: joi.object<apiDeviceProfile>({
        classBTimeout: joi.number(),
        classCTimeout: joi.number(),
        factoryPresetFreqs: joi.array().items(joi.number()),
        geolocBufferTTL: joi.number(),
        geolocMinBufferSize: joi.number(),
        id: joi.string(),
        macVersion: joi.string(),
        maxDutyCycle: joi.number(),
        maxEIRP: joi.number(),
        name: joi.string(),
        networkServerID: joi.string(),
        organizationID: joi.string(),
        payloadCodec: joi.string(),
        payloadDecoderScript: joi.string(),
        payloadEncoderScript: joi.string(),
        pingSlotDR: joi.number(),
        pingSlotFreq: joi.number(),
        pingSlotPeriod: joi.number(),
        regParamsRevision: joi.string(),
        rfRegion: joi.string(),
        rxDROffset1: joi.number(),
        rxDataRate2: joi.number(),
        rxDelay1: joi.number(),
        rxFreq2: joi.number(),
        supports32BitFCnt: joi.boolean(),
        supportsClassB: joi.boolean(),
        supportsClassC: joi.boolean(),
        supportsJoin: joi.boolean(),
        tags: joi.object(),
        uplinkInterval: joi.string(),
    }),
});

export const IDeviceProfileDetailChirpstackDTOSwagger = j2s(IDeviceProfileDetailChirpstackDTOValidation).swagger;

export interface apiDeviceProfile {
    classBTimeout: number;
    classCTimeout: number;
    factoryPresetFreqs: number[];
    geolocBufferTTL: number;
    geolocMinBufferSize: number;
    id: string;
    macVersion: string;
    maxDutyCycle: number;
    maxEIRP: number;
    name: string;
    networkServerID: string;
    organizationID: string;
    payloadCodec: string;
    payloadDecoderScript: string;
    payloadEncoderScript: string;
    pingSlotDR: number;
    pingSlotFreq: number;
    pingSlotPeriod: number;
    regParamsRevision: string;
    rfRegion: string;
    rxDROffset1: number;
    rxDataRate2: number;
    rxDelay1: number;
    rxFreq2: number;
    supports32BitFCnt: boolean;
    supportsClassB: boolean;
    supportsClassC: boolean;
    supportsJoin: boolean;
    tags: Record<string, any>
    uplinkInterval: string;
}

export interface IDeviceProfileDetailChirpstackDTO {
    createdAt: string;
    deviceProfile: apiDeviceProfile;
    updatedAt: string;
}
