import { z } from "zod";
import { CoordenadasSchema } from "./coordenadas";

export const DireccionV2Schema = z.object({
  calle: z.string().optional(),
  entreCalles: z.string().optional(),
  numero: z.string().optional(),
  piso: z.string().optional(),
  depto: z.string().optional(),
  barrio: z.string().optional(),
  localidad: z.string().optional(),
  partido: z.string().optional(),
  provincia: z.string().optional(),
  direccion: z.string().optional(),
  coordenadas: CoordenadasSchema.optional(),
});
export type DireccionV2 = z.infer<typeof DireccionV2Schema>;
