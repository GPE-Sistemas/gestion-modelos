import { ICliente } from "./cliente";
import { IModoDesactivado } from "./dispositivo-alarma";
import { estadoCuenta } from "./estado-entidad";
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

export type FuncionActivo =
  | "Transporte"
  | "Bomberos"
  | "Mantenimiento"
  | "Policia"
  | "Particular"
  | "Ambulancia"
  | "Seguridad Privada"
  | "Servicio Técnico"
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
  //
  idExterno?: string;
  // Populate
  chofer?: IUsuario;
  recorrido?: IRecorrido;
  recorridos?: IRecorrido[];
}

export interface IActivo {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  idGrupo?: string;
  idTracker?: string;
  ///alta de activo
  fechaAlta?: string;
  imagenes?: string[];
  /**
   * El id del tracker asignado en la plataforma traccar para obtener el vehiculo rapido con los reportes de traccar
   */
  idUnicoTraccar?: number;
  identificacion?: string;
  categoria?: ICategoriaActivo;
  funcion?: FuncionActivo;
  vehiculo?: IVehiculo;
  idsClientesQuePuedenAtender?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  modoDesactivado?: IModoDesactivado;

  estadoCuenta?: estadoCuenta;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  tracker?: ITracker;
  grupo?: IGrupo;
}

type OmitirCreate = "_id" | "cliente" | "tracker";

export interface ICreateActivo extends Omit<Partial<IActivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente" | "tracker";

export interface IUpdateActivo extends Omit<Partial<IActivo>, OmitirUpdate> {}
