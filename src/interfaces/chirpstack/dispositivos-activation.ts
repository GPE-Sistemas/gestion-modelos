import { z } from 'zod';

export const CreateUpdateDeviceActivationSchema = z.object({
  deviceActivation: z
    .object({
      description: z.string().optional(),
      aFCntDown: z.number().optional(),
      appSKey: z.string().optional(),
      devAddr: z.string().optional(),
      fCntUp: z.number().optional(),
      fNwkSIntKey: z.string().optional(),
      nFCntDown: z.number().optional(),
      nwkSEncKey: z.string().optional(),
      sNwkSIntKey: z.string().optional(),
    })
    .optional(),
});
export type ICreateUpdateDeviceActivation = z.infer<
  typeof CreateUpdateDeviceActivationSchema
>;
