export interface IUplink {
  deduplicationId?: string;
  time?: Date;
  deviceInfo?: IDeviceUplinkInfo;
  devAddr?: string;
  adr?: boolean;
  dr?: number;
  fCnt?: number;
  fPort?: number;
  confirmed?: boolean;
  data?: string;
  object?: IObjectUplink;
  rxInfo?: RxInfoUplink[];
  txInfo?: TxInfoUplink;
  regionConfigId?: string;
}

export interface IDeviceUplinkInfo {
  tenantId?: string;
  tenantName?: string;
  applicationId?: string;
  applicationName?: string;
  deviceProfileId?: string;
  deviceProfileName?: string;
  deviceName?: string;
  devEui?: string;
  deviceClassEnabled?: string;
  tags?: Record<string, string>;
}

export interface IObjectUplink {
  err?: number;
  valid?: boolean;
  payload?: string;
  messages?: Array<IMessageUplink[]>;
}

export interface IMessageUplink {
  measurementValue?: IMeasurementValueElementUplink[] | number;
  timestamp?: number;
  measurementId?: string;
  motionId?: number;
  type?: string;
}

//Esto es para cuando hay wifi
export interface IMeasurementValueElementUplink {
  mac?: string;
  rssi?: number;
}

export interface RxInfoUplink {
  gatewayId?: string;
  uplinkId?: number;
  gwTime?: Date;
  nsTime?: Date;
  timeSinceGpsEpoch?: string;
  rssi?: number;
  snr?: number;
  location?: ILocationUplink;
  context?: string;
  crcStatus?: string;
}

export interface ILocationUplink {
  latitude?: number;
  longitude?: number;
}

export interface TxInfoUplink {
  frequency?: number;
  modulation?: IModulationUplink;
}

export interface IModulationUplink {
  lora?: ILoraUplink;
}

export interface ILoraUplink {
  bandwidth?: number;
  spreadingFactor?: number;
  codeRate?: string;
}
