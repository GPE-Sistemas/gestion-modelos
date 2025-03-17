export interface IDispositivo {
  _id?: string;
  devEUI?: string;
  description?: string;
  name?: string;
  tags?: Record<string, string>;
  applicationID?: string;
  appKey?: string;
  genAppKey?: string;
  nwkKey?: string;
  deviceProfileID?: string;
  activationMethod?: "OTAA" | "ABP";
}

export interface IDeviceProfile {
  createdAt?: string;
  id?: string;
  macVersion?: string;
  name: string;
  regParamsRevision?: string;
  region?: string;
  supportsClassB?: boolean;
  supportsClassC?: boolean;
  supportsOtaa?: boolean;
  updatedAt?: string;
  vendorID?: string;
}
