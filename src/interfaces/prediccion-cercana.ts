import { z } from 'zod';
import { CoordenadasSchema } from '../auxiliares';
import { ParadaSchema } from './recorrido';

/**
 * Interfaz para la predicción de llegada de un vehículo a una parada
 */
export const CercanaSchema = z.object({
  /**
   * Tiempo estimado de llegada en segundos (solo viaje)
   */
  tiempo: z.number().optional(),
  /**
   * Tiempo procesado en segundos (viaje + tiempos de parada)
   */
  tiempoProcesado: z.number().optional(),
  /**
   * Paradas restantes antes de llegar al destino
   */
  paradasRestantes: z.array(ParadaSchema).optional(),
  /**
   * Distancia en metros hasta la parada destino
   */
  distancia: z.number().optional(),
  /**
   * Geometría de la ruta calculada
   */
  ruta: z.array(CoordenadasSchema).optional(),
  /**
   * Información del vehículo
   */
  vehiculo: z
    .object({
      /**
       * Ubicación actual del vehículo
       */
      ubicacionActual: CoordenadasSchema.optional(),
      /**
       * Identificación del vehículo
       */
      identificacion: z.string().optional(),
      /**
       * Dominio del vehículo (patente)
       */
      dominio: z.string().optional(),
    })
    .optional(),
  /**
   * Información del último trackeo registrado
   */
  trackeo: z
    .object({
      /**
       * Fecha del último trackeo
       */
      fecha: z.string().optional(),
      /**
       * Nombre de la última parada registrada
       */
      parada: z.string().optional(),
    })
    .optional(),
  /**
   * Mensaje en caso de no haber vehículos disponibles
   */
  mensaje: z.string().optional(),
});
export type ICercana = z.infer<typeof CercanaSchema>;

/**
 * Interfaz para la respuesta del endpoint de predicciones cercanas
 *
 * Diseñada para totems/pantallas en estaciones de transporte que muestran
 * información de múltiples líneas/recorridos. Siempre retorna las paradas
 * cercanas (radio 50m), mostrando solo la parada más cercana por recorrido.
 * La predicción es opcional y solo está presente cuando hay vehículos disponibles.
 */
export const PrediccionCercanaSchema = z.object({
  /**
   * Información de la parada más cercana del recorrido
   */
  parada: ParadaSchema,
  /**
   * Información resumida del recorrido
   */
  recorrido: z.object({
    /**
     * ID del recorrido
     */
    _id: z.string(),
    /**
     * Nombre/número del recorrido
     */
    nombre: z.string(),
    /**
     * Destino del recorrido
     */
    destino: z.string().optional(),
    /**
     * Color del recorrido (para UI)
     */
    color: z.string().optional(),
    /**
     * Nombre de la flota/línea (ej: "518")
     */
    nombreFlota: z.string().optional(),
    /**
     * Información del grupo/línea al que pertenece el recorrido
     */
    grupo: z
      .object({
        /**
         * ID del grupo
         */
        _id: z.string().optional(),
        /**
         * Nombre del grupo/línea
         */
        nombre: z.string().optional(),
        /**
         * Color del grupo/línea
         */
        color: z.string().optional(),
      })
      .optional(),
  }),
  /**
   * Predicción de llegada del próximo vehículo (opcional)
   * Solo presente cuando hay un vehículo disponible en el recorrido.
   * Si no hay predicción, el totem puede mostrar "No disponible" o similar.
   */
  prediccion: CercanaSchema.optional(),
});
export type IPrediccionCercana = z.infer<typeof PrediccionCercanaSchema>;
