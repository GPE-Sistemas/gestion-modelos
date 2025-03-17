export interface IAckChirpstack {
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
    acknowledged: boolean;
    fCnt: string;
    tags: {
        [key: string]: string;
    };
}