import { ICliente } from "./cliente";
import { ICategoriaEvento } from "./categoria-evento";

export interface ICodigoDispositivoEntrada {
  codigo?: string;
  descripcion?: string;
  idCategoriaEvento?: string;
  // Populate
  categoriaEvento?: ICategoriaEvento;
}

export interface ICodigoDispositivo {
  codigo?: string;
  descripcion?: string;
  idCategoriaEvento?: string;
  mostrarZona?: boolean;
  mostrarUsuario?: boolean;
  armado?: boolean;
  desarmado?: boolean;
  detonacion?: boolean;
  test?: boolean;
  minutosEsperaAutomatica?: number; // Los eventos generados se ponen en espera automaticamente por este tiempo
  cierraCodigosEventos?: string[]; // Si se genera un evento con este codigo, se cierran los eventos con estos codigos del array
  // Populate
  categoriaEvento?: ICategoriaEvento;
}

export type TipoDispositivo =
  | "Tracker"
  | "Alarma"
  | "Comunicador"
  | "Cámara"
  | "Luminaria"
  | "DispositivoLorawan"
  | "BotonBLE";

export interface ICodigosDispositivo {
  _id?: string;
  //
  nombre?: string;
  tipo?: TipoDispositivo;
  codigos?: ICodigoDispositivo[];
  codigosEntrada?: ICodigoDispositivoEntrada[];
  idCliente?: string;
  idsAncestros?: string[];
  global?: boolean;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateCodigosDispositivo
  extends Omit<Partial<ICodigosDispositivo>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateCodigosDispositivo
  extends Omit<Partial<ICodigosDispositivo>, OmitirUpdate> {}
