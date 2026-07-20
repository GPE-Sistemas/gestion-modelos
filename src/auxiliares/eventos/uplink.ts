import { z } from "zod";

export const TagsSchema = z.record(z.string(), z.string());
export type Tags = z.infer<typeof TagsSchema>;

export const DeviceInfoSchema = z.object({
  tenantId: z.string().optional(),
  tenantName: z.string().optional(),
  applicationId: z.string().optional(),
  applicationName: z.string().optional(),
  deviceProfileId: z.string().optional(),
  deviceProfileName: z.string().optional(),
  deviceName: z.string().optional(),
  devEui: z.string().optional(),
  deviceClassEnabled: z.string().optional(),
  tags: TagsSchema.optional(),
});
export type DeviceInfo = z.infer<typeof DeviceInfoSchema>;

export const PositioningStatusSchema = z.object({
  id: z.number().optional(),
  statusName: z.string().optional(),
});
export type IPositioningStatus = z.infer<typeof PositioningStatusSchema>;

export const MeasurementValueElementUplinkSchema = z.object({
  mac: z.string().optional(),
  rssi: z.number().optional(),
});
export type IMeasurementValueElementUplink = z.infer<
  typeof MeasurementValueElementUplinkSchema
>;

export const MessageUplinkSchema = z.object({
  measurementValue: z
    .union([
      z.array(MeasurementValueElementUplinkSchema),
      PositioningStatusSchema,
      z.number(),
    ])
    .optional(),
  timestamp: z.number().optional(),
  measurementId: z.string().optional(),
  motionId: z.number().optional(),
  type: z.string().optional(),
});
export type IMessageUplink = z.infer<typeof MessageUplinkSchema>;

export const ObjectUplinkSchema = z.object({
  err: z.number().optional(),
  valid: z.boolean().optional(),
  payload: z.string().optional(),
  messages: z.array(z.array(MessageUplinkSchema)).optional(),
  errMessage: z.string().optional(),
});
export type IObjectUplink = z.infer<typeof ObjectUplinkSchema>;

export const LocationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
export type Location = z.infer<typeof LocationSchema>;

export const RxInfoSchema = z.object({
  gatewayId: z.string().optional(),
  uplinkId: z.number().optional(),
  gwTime: z.string().optional(),
  nsTime: z.string().optional(),
  timeSinceGpsEpoch: z.string().optional(),
  rssi: z.number().optional(),
  snr: z.number().optional(),
  location: LocationSchema.optional(),
  context: z.string().optional(),
  crcStatus: z.string().optional(),
});
export type RxInfo = z.infer<typeof RxInfoSchema>;

export const LoraSchema = z.object({
  bandwidth: z.number().optional(),
  spreadingFactor: z.number().optional(),
  codeRate: z.string().optional(),
});
export type Lora = z.infer<typeof LoraSchema>;

export const ModulationSchema = z.object({
  lora: LoraSchema.optional(),
});
export type Modulation = z.infer<typeof ModulationSchema>;

export const TxInfoSchema = z.object({
  frequency: z.number().optional(),
  modulation: ModulationSchema.optional(),
});
export type TxInfo = z.infer<typeof TxInfoSchema>;

export const UplinkSchema = z.object({
  deduplicationId: z.string().optional(),
  time: z.string().optional(),
  deviceInfo: DeviceInfoSchema.optional(),
  devAddr: z.string().optional(),
  adr: z.boolean().optional(),
  dr: z.number().optional(),
  fCnt: z.number().optional(),
  fPort: z.number().optional(),
  confirmed: z.boolean().optional(),
  data: z.string().optional(),
  object: ObjectUplinkSchema.optional(),
  rxInfo: z.array(RxInfoSchema).optional(),
  txInfo: TxInfoSchema.optional(),
  regionConfigId: z.string().optional(),
});
export type IUplink = z.infer<typeof UplinkSchema>;

export const EXAMPLE_UPLINK: IUplink = {
  deduplicationId: "8dc86175-520c-4b1e-9f12-1bd8fa2756c8",
  time: "2025-04-04T12:34:42.762964+00:00",
  deviceInfo: {
    tenantId: "edfcd90d-91e2-451f-ae92-b8182ba61188",
    tenantName: "Grupo Control",
    applicationId: "d4dd9bfb-cca4-469d-b776-9582331d2908",
    applicationName: "prueba",
    deviceProfileId: "16208f33-dd9c-4f5c-b060-6c65df471087",
    deviceProfileName: "LoRaWAN LC SHUNCOM",
    deviceName: "SHUNCOM_8679",
    devEui: "6af03b46f5628679",
    deviceClassEnabled: "CLASS_C",
    tags: {},
  },
  devAddr: "018c0f49",
  adr: true,
  dr: 5,
  fCnt: 86,
  fPort: 10,
  confirmed: false,
  data: "ER0AAAABBBBkBQQAACAMVj4C0QYoABATiAACoHw=",
  rxInfo: [
    {
      gatewayId: "ac1f09fffe103e25",
      uplinkId: 618823116,
      gwTime: "2025-04-04T12:34:42.762964+00:00",
      nsTime: "2025-04-04T12:34:42.866232204+00:00",
      timeSinceGpsEpoch: "1427805300.762964s",
      rssi: -57,
      snr: 14.0,
      location: { latitude: -35.57379087247274, longitude: -58.01321928243111 },
      context: "AAAAAAAAAAAAswA1TEVsMA==",
      crcStatus: "CRC_OK",
    },
  ],
  txInfo: {
    frequency: 915400000,
    modulation: {
      lora: { bandwidth: 125000, spreadingFactor: 7, codeRate: "CR_4_5" },
    },
  },
  regionConfigId: "au915_0",
};
