export interface ILoraServer {
  _id?: string;
  nombre?: string;
  url?: string;
  // ChirpStack
  token?: string;
  organizationID?: string;
  serviceProfileID?: string;
  integrationUrl?: string;
}

export type ICreateLoraServer = ILoraServer;
export type IUpdateLoraServer = ILoraServer;
