import { ICliente } from "./cliente";
import { IModeloDispositivo } from "./modelo-dispositivo";
import { IModoLuminaria, IReporteDispositivo } from "./reporte-dispositivo";

//Notas: En el caso de estos dispositivos:
// Potencia de dispositivo GPE = consumo instantáneo (W)
// Energía de dispositivo GPE = Reactive Power de dispositivo Wellness = Consumo acumulado (kWh)

export interface IConfigDispositivoLuminaria {
  // TODO: Definir los tipos de las propiedades cuando sean conocidos
  [key: string]: any;
}

//Si se trata de una luminaria Wellness, esta es la info que se va a cargar en la config del dispositivo
export interface IDispositivoLuminariaGPE {
  //Datos de configuración (llegan al inicio del firmware o por pedido de downlink)
  limLuzInferior?: number;
  limLuzSuperior?: number;
  offsetGPSAmanecer?: number;
  offsetGPSAtardecer?: number;
  timeZone?: number;
  frecReporte?: number;
  dataRate?: number;

  //Datos de estado (llegan cada 10 minutos)
  mode?: IModoLuminaria;
  estadoRele?: boolean;
  dimmerHabilitado?: boolean;
  energiaExterna?: boolean;
  adrHabilitado?: boolean;
  alarma?: string;

  //Datos de consumo (llegan cada 1 hora)
  corriente?: number; //mA
  voltaje?: number; //V
  potencia?: number; //W
  energia?: number; //kWh
  energiaTotal?: number; //kWh
  factorPotencia?: number;
}
export interface IDispositivoLuminariaWellness {
  mode?: IModoLuminaria;
  activePowerTotal?: number; // kWh - acumulada (A pesar de que digen power, realmente son energía)
  reactivePowerTotal?: number; // kWh - acumulada
  turnOnOffStatus?: boolean; // True: Encendido, False: Apagado
  alarma?: string;
}

export type TipoDispositivoLorawan = "Luminaria GPE" | "Luminaria Wellness";

export interface IDispositivoLorawan {
  _id?: string;
  idCliente?: string;
  idModeloDispositivo?: string;
  fechaCreacion?: string; // Dafault: Date.now
  config?: IConfigDispositivoLuminaria;
  fechaUltimaComunicacion?: string;
  ultimoReporte?: IReporteDispositivo;
  frecReporte?: number;
  tipo?: TipoDispositivoLorawan;

  // Datos para el lora server
  deveui?: string;
  joineui?: string;
  description?: string;
  name?: string;
  tags?: Record<string, string>;
  applicationId?: string;
  deviceProfileId?: string;
  variables?: Record<string, string>;
  isDisabled?: boolean;
  skipFcntCheck?: boolean;

  // Datos para OTAA
  appkey?: string; //Con esta se completa tanto el appKey y el nwkKey para deviceKeys

  //Datos para ABP
  devAddr?: string;
  appSKey?: string;
  fCntUp?: number;
  nFCntDown?: number;
  nwkskey?: string; //Con esta se completa fNwkSIntKey, nwkSEncKey y sNwkSIntKey para activationKeys

  //Populate
  cliente?: ICliente;
  modeloDispositivo?: IModeloDispositivo;
}

type OmitirCreate = "_id" | "cliente";

export interface ICreateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirCreate> {}

type OmitirUpdate = "_id" | "cliente";

export interface IUpdateDispositivoLorawan
  extends Omit<Partial<IDispositivoLorawan>, OmitirUpdate> {}
