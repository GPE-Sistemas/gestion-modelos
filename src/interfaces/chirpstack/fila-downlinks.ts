import { z } from 'zod';

// Un item de la fila de downlinks de un device en el Network Server
// (GET /api/devices/{deveui}/queue de Chirpstack).
//
// La fila del NS es el ÚLTIMO tramo antes del aire: cuando un downlink sale de
// nuestra fila todavía no está transmitido, queda acá esperando que el device
// abra una ventana de recepción. Si el device es clase B/C y no tiene ruta de
// downlink (nadie lo escuchó últimamente), el scheduler de Chirpstack falla al
// elegir gateway ANTES de mirarle el `expiresAt`: el item no se entrega, no
// vence y no se borra solo.
export const ItemFilaNSSchema = z.object({
  // id del queue-item en Chirpstack (uuid).
  id: z.string().optional(),
  devEui: z.string().optional(),
  // Pide ACK de capa MAC. Hoy el secuenciador manda todo confirmado.
  confirmed: z.boolean().optional(),
  fCntDown: z.number().optional(),
  fPort: z.number().optional(),
  // Payload en HEX (Chirpstack lo devuelve en base64; lo convertimos nosotros
  // para que sea comparable con lo que se ve en comandos y en la cronología).
  payloadHex: z.string().optional(),
  // Ya se le asignó fCnt y está esperando la confirmación del device.
  isPending: z.boolean().optional(),
  // Vencimiento que le pusimos al encolar.
  expiresAt: z.string().optional(),
  // Derivado: expiresAt ya pasó. Un item vencido que sigue en la fila es basura
  // por nuestra propia definición: nadie lo va a querer entregar.
  vencido: z.boolean().optional(),
  // Derivado: el item NO tiene `expiresAt`. Son los PEORES, no los mejores:
  // sin vencimiento, Chirpstack no los va a descartar nunca por su cuenta, ni
  // siquiera cuando el device recupere ruta de downlink. Los encoló un camino
  // que no seteaba `expiresAt` (hoy todos lo setean, así que son anteriores a
  // esa política).
  //
  // Ojo al tratarlos: NO son "vigentes". Un item sin vencimiento es tan
  // descartable como uno vencido —más, porque es el único que no se va solo—.
  sinVencimiento: z.boolean().optional(),
});
export type IItemFilaNS = z.infer<typeof ItemFilaNSSchema>;

// Fila completa de un device, tal como se muestra en el detalle del dispositivo
// LoRaWAN (solapa exclusiva de cliente nivel 0).
export const FilaNSSchema = z.object({
  deveui: z.string(),
  totalItems: z.number(),
  // Cuántos de esos items ya vencieron.
  itemsVencidos: z.number(),
  // De esos, cuántos no tienen `expiresAt` (ver `sinVencimiento` del item).
  itemsSinVencimiento: z.number(),
  // Clase del device según su device profile en Chirpstack. El bucle de
  // "gateway rx history is empty after filtering" SÓLO existe para clase B/C:
  // el scheduler de clase A no agenda contra devices que no acaban de hablar.
  claseBC: z.boolean().optional(),
  // Motivo por el que el device está offline, si lo está (mismo criterio que el
  // gate de envío: `tiempoLimiteComunicacion` o el fallback de 24 h).
  offline: z.boolean().optional(),
  motivoOffline: z.string().optional(),
  items: z.array(ItemFilaNSSchema),
});
export type IFilaNS = z.infer<typeof FilaNSSchema>;

// Resultado del barrido de filas huérfanas (cron). Un "sucio" es un device
// offline clase B/C con items en la fila; se flushea sólo si NINGÚN item tiene
// valor (todos vencidos o sin vencimiento), para no tirar un downlink que
// todavía tiene sentido entregar.
export const ResultadoBarridoFilaNSSchema = z.object({
  candidatos: z.number(),
  revisados: z.number(),
  sucios: z.number(),
  flusheados: z.number(),
  itemsBorrados: z.number(),
  // Devices sucios que NO se flushearon porque tenían algún item VIGENTE (con
  // vencimiento en el futuro). Los que sólo tienen items vencidos o sin
  // vencimiento no cuentan acá: ésos se flushean.
  omitidosPorVigentes: z.number(),
  errores: z.number(),
  deveuisFlusheados: z.array(z.string()),
});
export type IResultadoBarridoFilaNS = z.infer<
  typeof ResultadoBarridoFilaNSSchema
>;

// Una fila del panel general de filas del NS: un device con downlinks sin
// entregar. Es el mismo dato que `IFilaNS` pero sin los items, porque el panel
// escanea el parque entero y mandar cada payload multiplicaría la respuesta.
export const FilaNSDeviceSchema = z.object({
  idDispositivo: z.string(),
  deveui: z.string(),
  name: z.string().optional(),
  tipo: z.string().optional(),
  claseBC: z.boolean().optional(),
  offline: z.boolean().optional(),
  motivoOffline: z.string().optional(),
  fechaUltimaComunicacion: z.string().optional(),
  totalItems: z.number(),
  itemsVencidos: z.number(),
  itemsSinVencimiento: z.number(),
  // Ningún item tiene valor: todos vencieron o no tienen vencimiento ⇒ vaciar
  // la fila no puede perder nada útil. Es la condición que usa el barrido
  // automático y la que habilita el "vaciar todas".
  todosDescartables: z.boolean(),
});
export type IFilaNSDevice = z.infer<typeof FilaNSDeviceSchema>;

// Panel general (listado de dispositivos LoRaWAN, acción de cabecera, nivel 0).
export const ResumenFilasNSSchema = z.object({
  // Devices cuya fila se consultó en el NS.
  escaneados: z.number(),
  // De esos, cuántos tenían al menos un item.
  conItems: z.number(),
  totalItems: z.number(),
  totalVencidos: z.number(),
  totalSinVencimiento: z.number(),
  // Cuántos quedaron sin revisar por el tope de la pasada.
  errores: z.number(),
  devices: z.array(FilaNSDeviceSchema),
});
export type IResumenFilasNS = z.infer<typeof ResumenFilasNSSchema>;

// Resultado del vaciado masivo desde el panel general.
export const ResultadoFlushMasivoSchema = z.object({
  pedidos: z.number(),
  flusheados: z.number(),
  itemsBorrados: z.number(),
  errores: z.number(),
  detalle: z.array(
    z.object({
      deveui: z.string(),
      ok: z.boolean(),
      itemsBorrados: z.number(),
      error: z.string().optional(),
    }),
  ),
});
export type IResultadoFlushMasivo = z.infer<typeof ResultadoFlushMasivoSchema>;
