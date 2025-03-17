export interface IStatusChirpstack {
    applicationID: string;
    applicationName: string;
    deviceName: string;
    devEUI: string;
    margin: number;
    externalPowerSource: boolean;
    batteryLevelUnavailable: boolean;
    batteryLevel: number;
    tags: {
        [key: string]: string;
    };
}
