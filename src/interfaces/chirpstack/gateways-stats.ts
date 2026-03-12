export interface IGatewayStats {
  gatewayId: string;
  time: string;

  rxPacketsReceived: number;
  rxPacketsReceivedOk: number;
  txPacketsReceived: number;
  txPacketsEmitted: number;

  txPacketsPerFrequency: Record<string, number>;
  rxPacketsPerFrequency: Record<string, number>;

  txPacketsPerModulation: IModulationCount[];
  rxPacketsPerModulation: IModulationCount[];

  txPacketsPerStatus: Record<string, number>;
}

export interface IModulationCount {
  modulation: IModulation;
  count: number;
}

export interface IModulation {
  lora?: ILoraModulation;
}

export interface ILoraModulation {
  bandwidth: number;
  spreadingFactor: number;
  codeRate: string;
  polarizationInversion?: boolean;
}

/**
 * Example
 */
export const GatewayStatsExample: IGatewayStats = {
  gatewayId: '0016c001f153a14c',
  time: '2022-08-03T14:37:59Z',

  rxPacketsReceived: 1,
  rxPacketsReceivedOk: 1,
  txPacketsReceived: 1,
  txPacketsEmitted: 1,

  txPacketsPerFrequency: {
    '867300000': 1,
  },

  rxPacketsPerFrequency: {
    '867300000': 1,
  },

  txPacketsPerModulation: [
    {
      modulation: {
        lora: {
          bandwidth: 125000,
          spreadingFactor: 7,
          codeRate: 'CR_4_5',
          polarizationInversion: true,
        },
      },
      count: 1,
    },
  ],

  rxPacketsPerModulation: [
    {
      modulation: {
        lora: {
          bandwidth: 125000,
          spreadingFactor: 7,
          codeRate: 'CR_4_5',
        },
      },
      count: 1,
    },
  ],

  txPacketsPerStatus: {
    OK: 1,
  },
};
