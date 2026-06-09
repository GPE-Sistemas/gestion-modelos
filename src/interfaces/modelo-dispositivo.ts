import { ICliente } from './cliente';
import { ICodigosDispositivo, TipoDispositivo } from './codigos-dispositivo';

export type FormatosMensajeComunicador =
  | 'Garnet-Titanium'
  | 'TECHNO 123'
  | 'Netio'
  | 'Nanocomm ED5200'
  | 'Garnet'
  | 'Dahua'
  | 'Hikvision'
  | 'Intelbras'
  // UNICOM "WiFi DUO": comunicador WiFi (AVR128 + ESP32) que habla MQTT
  // contra el broker propio de IRIX. NO usa SIM/GPRS (sim1/sim2/numeroAbonado
  // quedan vacíos); su identidad es el devid en idUnicoComunicador.
  | 'UNICOM';

export type NivelDimerizacion =
  | 'dim10'
  | 'dim20'
  | 'dim30'
  | 'dim40'
  | 'dim50'
  | 'dim60'
  | 'dim70'
  | 'dim80'
  | 'dim90'
  | 'dim100';

// Punto de la curva: en un nivel de dimerización dado, valores eléctricos
// esperados y sus margenes bidireccionales de tolerancia.
export interface IPuntoCurvaLuminaria {
  potencia?: number; // W a un determinado dimming (Wd)
  factorPotencia?: number; // cfidim a este dim (0..1). También llamado cosφ.

  margenPotenciaSuperior?: number; // alarma si W >= Wd * (1 + potencia/100)
  margenPotenciaInferior?: number; // alarma si W <= Wd * (1 - potencia/100)
  margenFactorPotenciaSuperior?: number; // delta abs — alarma si cosφ > cfidim + margen
  margenFactorPotenciaInferior?: number; // delta abs — alarma si cosφ < cfidim - margen
}

export type ICurvaDimerizacionLuminaria = {
  [K in NivelDimerizacion]?: IPuntoCurvaLuminaria;
};

// Voltaje: independiente del dim.
export interface IConfigVoltajeLuminaria {
  nominalV?: number; // Vn (típicamente 230)
  margenSuperiorV?: number; // Θv — alarma si V >= Vn + Θv
  margenInferiorV?: number; // alarma si V <= Vn - margenInferiorV
}

export interface IDetallesLuminarias {
  horasVida?: number;

  voltaje?: IConfigVoltajeLuminaria;
  dimerizacion?: ICurvaDimerizacionLuminaria;
}

export interface IModeloDispositivo {
  _id?: string;

  //
  tipo?: TipoDispositivo;
  marca?: string;
  modelo?: string;
  formatoMensaje?: FormatosMensajeComunicador;
  idCodigos?: string;
  idCliente?: string;
  idsAncestros?: string[];

  //Datos técnicos para luminarias
  luminarias?: IDetallesLuminarias;
  global?: boolean;
  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  codigos?: ICodigosDispositivo;
}

type OmitirCreate = '_id' | 'codigos' | 'cliente';

export interface ICreateModeloDispositivo extends Omit<
  Partial<IModeloDispositivo>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'codigos' | 'cliente';

export interface IUpdateModeloDispositivo extends Omit<
  Partial<IModeloDispositivo>,
  OmitirUpdate
> {}

export interface IModeloDispositivoCache extends Omit<
  IModeloDispositivo,
  'cliente' | 'ancestros' | 'codigos'
> {}
