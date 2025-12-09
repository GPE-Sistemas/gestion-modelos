export interface IMetricasGateways {
  rxPackets: IMetricaItem;
  rxPacketsPerDr: IMetricaItem;
  rxPacketsPerFreq: IMetricaItem;
  txPackets: IMetricaItem;
  txPacketsPerDr: IMetricaItem;
  txPacketsPerFreq: IMetricaItem;
  txPacketsPerStatus: IMetricaItem;
}

export interface IMetricaItem {
  datasets: IMetricaDataset[];
  kind: string;
  name: string;
  timestamps: string[];
}

export interface IMetricaDataset {
  data: number[];
  label: string;
}

export type aggregationGatewaysMetrics = 'HOUR' | 'DAY' | 'MONTH' | 'MINUTE';
