import { ICoordenadaOL, ICoordenadas, IGeoJSONPolygon } from "../auxiliares";
import { ICliente } from "./cliente";

export interface ITerminal {
  _id?: string;
  idCliente?: string;
  nombre?: string;
  geojson?: IGeoJSONPolygon;
  color?: string;
  // Populate
  cliente?: ICliente;
  coordenadas?: ICoordenadas[];
  coordenadasOl?: ICoordenadaOL[];
}

type OmitirCreate = "_id" | "cliente" | "terminal" | "terminalOl";

export interface ICreateTerminal
  extends Omit<Partial<ITerminal>, OmitirCreate> {
  terminalOl?: ICoordenadaOL[];
}

type OmitirUpdate = "_id" | "cliente" | "terminal" | "terminalOl";

export interface IUpdateTerminal
  extends Omit<Partial<ITerminal>, OmitirUpdate> {
  terminalOl?: ICoordenadaOL[];
}
