import { ICliente } from "./cliente";
import { IGrupo } from "./grupo";
import { IRecorrido } from "./recorrido";
import { ITracker } from "./tracker";
import { IUsuario } from "./usuario";

export type TipoVehiculo =
  | "Colectivo"
  | "Camion"
  | "Moto"
  | "Auto"
  | "Grua"
  | "Otro";

export type FuncionVehiculo =
  | "Transporte"
  | "Bomberos"
  | "Mantenimiento"
  | "Policia"
  | "Particular"
  | "Ambulancia"
  | "Seguridad Privada"
  | "Otro";

export type EstadoVehiculo =
  | "Operativo"
  | "En mantenimiento"
  | "Fuera de servicio";

export type ICategoriaActivo = "Normal" | "Vehículo";

export interface IVehiculo {
  tipo?: TipoVehiculo;
  patente?: string;
  estado?: EstadoVehiculo;
  modelo?: string;
  marca?: string;
  anio?: string;
  //
  idChofer?: string;
  idRecorrido?: string;
  idsRecorridos?: string[];
  // Populate
  chofer?: IUsuario;
  recorrido?: IRecorrido;
  recorridos?: IRecorrido[];
}

export interface IActivo {
  _id?: string;
  //
  idCliente?: string;
  idGrupo?: string;
  idTracker?: string;
  /**
   * El id del tracker asignado en la plataforma traccar para obtener el vehiculo rapido con los reportes de traccar
   */
  idUnicoTraccar?: number;
  identificacion?: string;
  categoria?: ICategoriaActivo;
  funcion?: FuncionVehiculo;
  vehiculo?: IVehiculo;
  idsClientesQuePuedenAtender?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  // Populate
  cliente?: ICliente;
  tracker?: ITracker;
  grupo?: IGrupo;
}

type OmitirCreate = "_id" | "cliente" | "tracker";

export interface ICreateActivo extends Omit<Partial<IActivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "tracker";

export interface IUpdateActivo extends Omit<Partial<IActivo>, OmitirUpdate> {}
