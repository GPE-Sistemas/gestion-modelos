import joi from 'joi';
import j2s from 'joi-to-swagger';
import { commonLocation, ICommonLocationValidation } from './gateway';

export const IDeviceDetailChirpstackDTOValidation = joi.object<IDeviceDetailChirpstackDTO>({
    device: joi.object<apiDevice>({
        applicationID: joi.string(),
        description: joi.string(),
        devEUI: joi.string(),
        deviceProfileID: joi.string(),
        isDisabled: joi.boolean(),
        name: joi.string(),
        referenceAltitude: joi.number(),
        skipFCntCheck: joi.boolean(),
        tags: joi.object(),
        variables: joi.object(),
    }),
    deviceStatusBattery: joi.number(),
    deviceStatusMargin: joi.number(),
    lastSeenAt: joi.string(),
    location: ICommonLocationValidation
});

export const IDeviceDetailChirpstackDTOSwagger = j2s(IDeviceDetailChirpstackDTOValidation).swagger;

export interface apiDevice {
    applicationID: string;
    description: string;
    devEUI: string;
    deviceProfileID: string;
    isDisabled: boolean;
    name: string;
    referenceAltitude: number;
    skipFCntCheck: boolean;
    tags: Record<string, any>
    variables: Record<string, any>
}

export interface IDeviceDetailChirpstackDTO {
    device: apiDevice;
    deviceStatusBattery: number;
    deviceStatusMargin: number;
    lastSeenAt: string;
    location: commonLocation;
}
