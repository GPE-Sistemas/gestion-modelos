export interface ICreateDeviceKeysChirpstack {
  deviceKeys: {
    appkey: string;
    deveui: string;
    genAppKey?: string;
    nwkKey: string;
    joineui?: string;
  };
}
