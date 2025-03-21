export interface ICreateDeviceChirpstack {
  device: {
    tenantId?: string;
    applicationId?: string;
    description?: string;
    devEui?: string;
    deviceProfileId?: string;
    isDisabled?: boolean;
    joinEui?: string;
    name?: string;
    skipFcntCheck?: boolean;
    tags?: Record<string, string>;
    variables?: Record<string, string>;
  };
}
