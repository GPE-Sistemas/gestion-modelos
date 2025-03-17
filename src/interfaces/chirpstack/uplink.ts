export interface IUplinkChirpstack {
    applicationID: string;
    applicationName: string;
    deviceName: string;
    devEUI: string;
    rxInfo: {
        gatewayID: string;
        time: string;
        timeSinceGPSEpoch: null;
        rssi: number;
        loRaSNR: number;
        channel: number;
        rfChain: number;
        board: number;
        antenna: number;
        location: {
            latitude: number;
            longitude: number;
            altitude: number
        };
        fineTimestampType: string;
        context: string;
        uplinkID: string
    }[];
    txInfo: {
        frequency: number;
        modulation: string;
        loRaModulationInfo: {
            bandwidth: number;
            spreadingFactor: number;
            codeRate: string;
            polarizationInversion: boolean;
        };
    };
    adr: boolean;
    dr: number;
    fCnt: string;
    fPort: number;
    data: string;
    objectJSON: string;
    tags: {
        [key: string]: string;
    };
}