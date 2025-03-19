export interface ICreateDeviceChirpstack {
  device: {
    applicationID?: string;
    description?: string;
    devEui?: string;
    deviceProfileId?: string;
    isDisabled?: boolean;
    joinEui?: string;
    name?: string;
    skipFCntCheck?: boolean;
    tags?: Record<string, string>;
    variables?: Record<string, string>;
  };
}
