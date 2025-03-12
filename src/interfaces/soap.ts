import { ICliente } from "./cliente";

export interface ISoap {
  _id?: string;
  idCliente?: string;
  fechaCreacion?: string;

  alta?: ISoapAlta;
  create?: ISoapCreate;
  altaChofer?: ISoapAltaChofer;
  obtenerChoferes?: ISoapObtenerChoferes;
  altaPorMinuta?: ISoapAltaPorMinuta;
  altaPorMinutaChofer?: ISoapAltaPorMinutaChofer;
  baja?: ISoapBaja;

  // Populate
  cliente?: ICliente;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateSoap extends Omit<Partial<ISoap>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateSoap extends Omit<Partial<ISoap>, OmitirUpdate> {}

export interface ISoapAlta {
  grupoEconomico?: number;
  empresa?: number;
  linea?: number;
  nroInterno?: number;
  legajoChofer?: number;
  salidaDateTime?: string;
  codigoRamal?: number;
  sentido?: number;
  llegadaDateTime?: string;
  numeroVueltaTurno?: number;
  idDiagramaDaz?: number;
  idTurnoDaz?: number;
  turno?: string;
  seccionadoCsv?: string;
}

export interface ISoapCreate {
  grupoEconomico?: Int16Array;
  empresa?: Int16Array;
  linea?: Int16Array;
  nroInterno?: Int16Array;
  legajoChofer?: Int16Array;
  salida?: string; //dateTimeInt16Array;
  codigoRamal?: Int16Array;
  sentido?: Int16Array;
  llegada?: string; //dateTimeInt16Array;
  numeroVueltaTurno?: Int16Array;
  idDiagramaDaz?: Int16Array;
  idTurnoDaz?: Int16Array;
  turno?: number; //charInt16Array;
  seccionado?: string; //ArrayOfKeyValuePairOfInt32DateTimeInt16Array;
}

export interface ISoapAltaChofer {
  grupoEconomico?: number;
  empresa?: number;
  linea?: number;
  legajoChofer?: number;
  NombreChofer?: string;
}

export interface ISoapObtenerChoferes {
  grupoEconomico?: number;
  empresa?: number;
  linea?: number;
}

export interface ISoapAltaPorMinuta {
  grupoEconomico?: number;
  empresa?: number;
  linea?: number;
  nroInterno?: number;
  legajoChofer?: number;
  salidaDateTime?: string;
  idMinutaSauron?: number;
}

export interface ISoapAltaPorMinutaChofer {
  grupoEconomico?: number;
  empresa?: number;
  linea?: number;
  nroInterno?: number;
  legajoChofer?: number;
  salidaDateTime?: string;
  idMinutaSauron?: number;
  nombreChofer?: string;
  dniChofer?: string;
}

export interface ISoapBaja {
  idHorarioOjoSauron?: number;
  motivo?: number;
  descripcionMotivo?: string;
  lineaDaz?: number;
  nroInterno?: number;
}
