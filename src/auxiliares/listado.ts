import { z } from "zod";

// Interface genérica: se mantiene como tipo (la factory de abajo es el schema)
export interface IListado<T> {
  totalCount?: number;
  datos: T[];
  duration?: number;
  executionStats?: object;
}

/**
 * Factory de schema para listados paginados.
 *
 * @example ListadoSchema(ActivoSchema).safeParse(res)
 */
export const ListadoSchema = <T extends z.ZodTypeAny>(inner: T) =>
  z.object({
    totalCount: z.number().optional(),
    datos: z.array(inner),
    duration: z.number().optional(),
    executionStats: z.record(z.string(), z.any()).optional(),
  });
