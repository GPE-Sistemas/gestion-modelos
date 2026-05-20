export interface IDownlink {
  deveui?: string;
  puerto?: number;
  payload?: string;
  // ===== Opciones Chirpstack =====
  expiresAt?: string; // Expira en la cola de Chirpstack si el NS no entrega antes. Útil para evitar que cuando un device vuelve online reciba comandos viejos zombies.
  flushQueue?: boolean; // Si es true, vacía la cola pendiente del device en Chirpstack antes de encolar este downlink. Usado en acciones de control inmediato (Encender, Apagar) donde solo importa el último.
  confirmed?: boolean; // Class C confirmed downlink. Por defecto false.
}
