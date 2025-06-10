import { DireccionV2 } from "../auxiliares";
import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";
import { IEmergenciaMedica } from "./emergencias-medicas";
import { IHospital } from "./hospitales";
import { IPersonalSalud } from "./personal-salud";
import { IUsuario } from "./usuario";

export interface IEventoEmergenciaMedica {
  _id?: string; // UUID del evento
  idCliente?: string;
  idDestinarioAsistencia?: string;
  idEmergencia?: string; // referencia a la emergencia
  idActivo?: string; //referencia al vehículo
  idChofer?: string; //referencia al chofer
  idsMedicos?: string[]; //referencia al medico
  idsEnfermeros?: string[]; //referencia al enfermero
  idHospital?: string;

  //Estado y timestamp
  estado?: EstadoEmergencia;
  timestamp?: string; // ISO timestamp del evento

  //Ubicación de la emergencia
  ubicacionDestino?: DireccionV2;

  //Descripciones
  motivoCancelacion?: string;
  motivoReasignacion?: string;
  observaciones?: string;

  //Populate: Asignaciones
  emergencia?: IEmergenciaMedica;
  destinatarioAsistencia?: IDestinatarioAsistencia;
  activo?: IActivo; //Activo tiene la información de vehículo
  chofer?: IUsuario; //Usuario tiene la información de chofer
  medico?: IPersonalSalud[];
  enfermero?: IPersonalSalud[];
  hospital?: IHospital;
  cliente?: ICliente;
}

type EstadoEmergencia =
  | "Pendiente" // Recién creada
  | "Asignada" // Se asignó vehículo/médico/enfermero
  | "Reasignada" //Se reasignó vehículo/médico/enfermero
  | "En tránsito" // Salió del centro
  | "Llego a destino" // Llegó al lugar de la emergencia
  | "Rumbo a hospital" // Sale hacia hospital
  | "Llegada a hospital" //Llegó al hospital
  | "Finalizada" // La emergencia fue tratada. Ya sea porque se llegó al hospital o no
  | "Cancelada"; // La emergencia se canceló

type OmitirCreate = "_id";

export interface ICreateEventoEmergenciaMedica
  extends Omit<Partial<IEventoEmergenciaMedica>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateEventoEmergenciaMedica
  extends Omit<Partial<IEventoEmergenciaMedica>, OmitirUpdate> {}
