import { z } from "zod";

export const SocketMessageSchema = z.object({
  /**
   * Las entidades modificadas (clientes, usuarios, etc)
   */
  paths: z.array(z.string()).optional(),
  /**
   * Metodo HTTP ejecutado (post, put, delete)
   */
  method: z.string().optional(),
  /**
   * El id del usuario que ejecutó la accion
   */
  idUser: z.string().optional(),
  /**
   * El id del cliente del usuario que ejecutó la accion
   */
  idCliente: z.string().optional(),
  /**
   * El body que se devolvio al usuario
   * En caso de post o put, el body es el nuevo objeto
   * En caso de delete, el body es un objeto { _id: "id del objeto eliminado" }
   */
  body: z.record(z.string(), z.any()).optional(),
  /**
   * Por que el usuario recibio el mensaje (para debug mas que nada)
   */
  motivo: z.string().optional(),
  /**
   * La aplicacion que envio el mensaje
   */
  aplicacion: z.string().optional(),
});
export type ISocketMessage = z.infer<typeof SocketMessageSchema>;
