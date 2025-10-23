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
     * Identificación del vehículo (patente)
     */
    identificacion?: string;
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
 */
export interface IPrediccionCercana {
  /**
   * Información de la parada
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
  };
  /**
   * Predicción de llegada del próximo vehículo
   */
  prediccion: ICercana;
}
