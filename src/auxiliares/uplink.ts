export interface IUplink {
  deduplicationId?: string;
  time?: Date;
  deviceInfo?: DeviceInfo;
  devAddr?: string;
  adr?: boolean;
  dr?: number;
  fCnt?: number;
  fPort?: number;
  confirmed?: boolean;
  data?: string;
  rxInfo?: RxInfo[];
  txInfo?: TxInfo;
  regionConfigId?: string;
}

export interface DeviceInfo {
  tenantId?: string;
  tenantName?: string;
  applicationId?: string;
  applicationName?: string;
  deviceProfileId?: string;
  deviceProfileName?: string;
  deviceName?: string;
  devEui?: string;
  deviceClassEnabled?: string;
  tags?: Tags;
}

export interface Tags {
  [key: string]: string;
}

export interface RxInfo {
  gatewayId?: string;
  uplinkId?: number;
  gwTime?: Date;
  nsTime?: Date;
  timeSinceGpsEpoch?: string;
  rssi?: number;
  snr?: number;
  location?: Location;
  context?: string;
  crcStatus?: string;
}

export interface Location {
  latitude?: number;
  longitude?: number;
}

export interface TxInfo {
  frequency?: number;
  modulation?: Modulation;
}

export interface Modulation {
  lora?: Lora;
}

export interface Lora {
  bandwidth?: number;
  spreadingFactor?: number;
  codeRate?: string;
}
