import { z } from "zod";

export const DownlinkSchema = z.object({
  deveui: z.string().optional(),
  puerto: z.number().optional(),
  payload: z.string().optional(),
  // ===== Opciones Chirpstack =====
  // Expira en la cola de Chirpstack si el NS no entrega antes. Útil para evitar que cuando un device vuelve online reciba comandos viejos zombies.
  expiresAt: z.string().optional(),
  // Si es true, vacía la cola pendiente del device en Chirpstack antes de encolar este downlink. Usado en acciones de control inmediato (Encender, Apagar) donde solo importa el último.
  flushQueue: z.boolean().optional(),
  // Class C confirmed downlink. Por defecto false.
  confirmed: z.boolean().optional(),
});
export type IDownlink = z.infer<typeof DownlinkSchema>;
