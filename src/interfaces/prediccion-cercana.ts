import { ICoordenadas } from '../auxiliares';
import { IParada } from './recorrido';

/**
 * Interfaz para la predicción de llegada de un vehículo a una parada
 */
export interface ICercana {
  /**
   * Tiempo estimado de llegada en segundos (solo viaje)
   */
  tiempo?: number;
  /**
   * Tiempo procesado en segundos (viaje + tiempos de parada)
   */
  tiempoProcesado?: number;
  /**
   * Paradas restantes antes de llegar al destino
   */
  paradasRestantes?: IParada[];
  /**
   * Distancia en metros hasta la parada destino
   */
  distancia?: number;
  /**
   * Geometría de la ruta calculada
   */
  ruta?: ICoordenadas[];
  /**
   * Información del vehículo
   */
  vehiculo?: {
    /**
     * Ubicación actual del vehículo
     */
    ubicacionActual?: ICoordenadas;
    /**
     * Identificación del vehículo
     */
    identificacion?: string;
    /**
     * Dominio del vehículo (patente)
     */
    dominio?: string;
  };
  /**
   * Información del último trackeo registrado
   */
  trackeo?: {
    /**
     * Fecha del último trackeo
     */
    fecha?: string;
    /**
     * Nombre de la última parada registrada
     */
    parada?: string;
  };
  /**
   * Mensaje en caso de no haber vehículos disponibles
   */
  mensaje?: string;
}

/**
 * Interfaz para la respuesta del endpoint de predicciones cercanas
 *
 * Diseñada para totems/pantallas en estaciones de transporte que muestran
 * información de múltiples líneas/recorridos. Siempre retorna las paradas
 * cercanas (radio 50m), mostrando solo la parada más cercana por recorrido.
 * La predicción es opcional y solo está presente cuando hay vehículos disponibles.
 */
export interface IPrediccionCercana {
  /**
   * Información de la parada más cercana del recorrido
   */
  parada: IParada;
  /**
   * Información resumida del recorrido
   */
  recorrido: {
    /**
     * ID del recorrido
     */
    _id: string;
    /**
     * Nombre/número del recorrido
     */
    nombre: string;
    /**
     * Destino del recorrido
     */
    destino?: string;
    /**
     * Color del recorrido (para UI)
     */
    color?: string;
    /**
     * Nombre de la flota/línea (ej: "518")
     */
    nombreFlota?: string;
    /**
     * Información del grupo/línea al que pertenece el recorrido
     */
    grupo?: {
      /**
       * ID del grupo
       */
      _id?: string;
      /**
       * Nombre del grupo/línea
       */
      nombre?: string;
      /**
       * Color del grupo/línea
       */
      color?: string;
    };
  };
  /**
   * Predicción de llegada del próximo vehículo (opcional)
   * Solo presente cuando hay un vehículo disponible en el recorrido.
   * Si no hay predicción, el totem puede mostrar "No disponible" o similar.
   */
  prediccion?: ICercana;
}
