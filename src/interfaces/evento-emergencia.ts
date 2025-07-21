import { DireccionV2 } from "../auxiliares";
import { IActivo } from "./activo";
import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";
import { IEmergencia, IEmergenciaMedica } from "./emergencias";
import { IHospital } from "./hospitales";
import { IPersonalSalud } from "./personal-salud";
import { IUsuario } from "./usuario";

export interface IEventoEmergencia {
  _id?: string; // UUID del evento
  idCliente?: string;
  idDestinarioAsistencia?: string;
  idEmergencia?: string; // referencia a la emergencia

  idActivo?: string; //referencia al vehículo
  idChofer?: string; //referencia al chofer

  //Exclusivas de emergencias médicas
  idsMedicos?: string[]; //referencia al medico
  idsEnfermeros?: string[]; //referencia al enfermero
  idHospital?: string;

  //Estado y timestamp
  estado?: EstadoEmergenciaMedica | EstadoEmergenciaBomberos;
  idUsuarioResponsable?: string; //Usuario que creó el evento
  timestamp?: string; // ISO timestamp del evento

  //Ubicación de la emergencia
  ubicacionDestino?: DireccionV2;

  //Descripciones
  motivoCancelacion?: string;
  motivoReasignacion?: string;
  observaciones?: string;
  diagnostico?: string;

  //Populate: Asignaciones
  emergencia?: IEmergencia;
  destinatarioAsistencia?: IDestinatarioAsistencia;
  activo?: IActivo; //Activo tiene la información de vehículo
  chofer?: IUsuario; //Usuario tiene la información de chofer
  medicos?: IPersonalSalud[];
  enfermeros?: IPersonalSalud[];
  hospital?: IHospital;
  cliente?: ICliente;
  usuarioResponsable?: IUsuario;
}

export type EstadoEmergenciaMedica =
  //LLAMADAS DE EMERGENCIA
  | "Atendida" //La llamada se atendió exitosamente

  //AUXILIOS
  | "Pendiente" // Auxilio recién creado
  | "Asignada" // Se asignó vehículo/médico/enfermero
  | "Reasignada" //Se reasignó vehículo/médico/enfermero
  | "En tránsito" // El vehículo salió del centro
  | "Llegó a destino" // El vehículo llegó al lugar de la emergencia
  | "Rumbo a hospital" // El vehículo sale hacia el hospital
  | "Llegada a hospital" //El vehículo Llegó al hospital
  | "Finalizada" // La emergencia fue tratada. Ya sea porque se llegó al hospital o no
  | "Cancelada"; // La emergencia se canceló

export type EstadoEmergenciaBomberos =
  //LLAMADAS DE EMERGENCIA
  | "Atendida" //La llamada se atendió exitosamente

  //AUXILIOS
  | "Pendiente" // Auxilio recién creado
  | "Asignada" // Se asignó vehículo
  | "Reasignada" //Se reasignó vehículo
  | "En tránsito" // El vehículo salió del centro
  | "Llegó a destino" // El vehículo llegó al lugar de la emergencia
  | "Finalizada" // La emergencia fue tratada
  | "Cancelada"; // La emergencia se canceló

type OmitirCreate = "_id";

export interface ICreateEventoEmergencia
  extends Omit<Partial<IEventoEmergencia>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdateEventoEmergencia
  extends Omit<Partial<IEventoEmergencia>, OmitirUpdate> {}
