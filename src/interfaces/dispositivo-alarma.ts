import { ICamara } from "./camara";
import { ICliente } from "./cliente";
import { estadoCuenta } from "./estado-entidad";
import { IModeloDispositivo } from "./modelo-dispositivo";
import { IUbicacion } from "./ubicacion";

export interface ISim {
  iccid?: string;
  numero?: string;
  operador?: Operador;
  apn?: string;
  usuario?: string;
  password?: string;
}

export interface IUltimaConexion {
  lastIp?: string;
  lastPort?: string;
}

export interface ICamaraAlarma {
  idCamara?: string;
  canal?: string;
  particion?: number;
  zona?: number;
}

export interface IModoDesactivado {
  dispositivoDesactivado?: boolean;
  permanente?: boolean;
  desde?: string;
  hasta?: string;
  codigos?: string[];
  alarma?: {
    particiones?: string[];
    zonas?: {
      particion: string;
      zona: string;
    }[];
  };
}

export interface IParticionZona {
  nombre?: string;
  particion?: number;
  zona?: number;
}

export type Operador = "Personal" | "Claro" | "Movistar" | "Tuenti" | "Otro";
export interface IDispositivoAlarma {
  _id?: string;
  //
  fechaCreacion?: string;
  fechaAlta?: string;
  fechaUltimaComunicacion?: string;
  idComunicador?: string;
  idUnicoComunicador?: string;
  passwordComunicador?: string;
  idModelo?: string;
  idDomicilio?: string;
  idCliente?: string;
  nombre?: string;
  numeroAbonado?: string;
  sim1?: ISim;
  sim2?: ISim;
  idsClientesQuePuedenAtender?: string[];
  idsClientesQuePuedenAtenderEventosTecnicos?: string[];
  camarasPorZona?: ICamaraAlarma[];
  idsCamaras?: string[];
  armado?: boolean;
  armando?: boolean;
  ultimaConexion?: IUltimaConexion;
  modoDesactivado?: IModoDesactivado;
  infoZonas?: IParticionZona[];
  //
  estadoCuenta?: estadoCuenta;
  frecReporte?: number;
  // Populate
  domicilio?: IUbicacion;
  modelo?: IModeloDispositivo;
  cliente?: ICliente;
  comunicador?: IModeloDispositivo;
  camaras?: ICamara[];
}

type OmitirCreate =
  | "_id"
  | "cliente"
  | "modelo"
  | "domicilio"
  | "comunicador "
  | "camaras";

export interface ICreateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirCreate> {}

type OmitirUpdate =
  | "_id"
  | "cliente"
  | "modelo"
  | "domicilio"
  | "comunicador"
  | "camaras";

export interface IUpdateDispositivoAlarma
  extends Omit<Partial<IDispositivoAlarma>, OmitirUpdate> {}
