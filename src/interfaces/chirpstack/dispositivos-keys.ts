import { z } from 'zod';

export const CreateUpdateDeviceKeysChirpstackSchema = z.object({
  deviceKeys: z
    .object({
      appKey: z.string().optional(),
      nwkKey: z.string().optional(), //Ambas Keys son lo mismo, pero cambian el nombre según la versión del dispositivo Lorawan
    })
    .optional(),
});
export type ICreateUpdateDeviceKeysChirpstack = z.infer<
  typeof CreateUpdateDeviceKeysChirpstackSchema
>;
