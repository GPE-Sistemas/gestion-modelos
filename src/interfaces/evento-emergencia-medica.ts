import { DireccionV2 } from "../auxiliares";
import { IActivo, IVehiculo } from "./activo";
import { ICliente } from "./cliente";
import { IDestinatarioAsistencia } from "./destinatario-asistencia";
import { IEmergenciaMedica } from "./emergencias-medicas";
import { IHospital } from "./hospitales";
import { IPersonalSalud } from "./personal-salud";

export interface IEventoEmergenciaMedica {
  _id?: string; // UUID del evento
  idCliente?: string;
  idEmergencia?: string; // referencia a la emergencia
  idActivo?: string; //referencia al vehículo
  idChofer?: string; //referencia al chofer
  idMedico?: string; //referencia al medico
  idEnfermero?: string; //referencia al enfermero
  idHospital?: string;

  //Estado y fecha
  estado?: EstadoEmergencia;
  timestamp?: string; // ISO timestamp del evento

  //Ubicaciones
  ubicacionActual?: DireccionV2;
  ubicacionDestino?: DireccionV2;

  //Descripciones
  motivoCancelacion?: string;
  motivoReasignacion?: string;
  observaciones?: string;

  //Populate: Asignaciones
  emergencia?: IEmergenciaMedica;
  paciente?: IDestinatarioAsistencia;
  activo?: IActivo; //Activo tiene la información de vehículo, y este a su vez, tiene la información de chofer también
  medico?: IPersonalSalud;
  enfermero?: IPersonalSalud;
  hospital?: IHospital;
  cliente?: ICliente;
}

type EstadoEmergencia =
  | "Pendiente" // Recién creada
  | "Asignada" // Se asignó vehículo/médico/enfermero
  | "Reasignada" //Se reasignó vehículo/médico/enfermero
  | "En transito" // Salió del centro
  | "Llego a destino" // Llegó al lugar de la emergencia
  | "Rumbo a hospital" // Sale hacia hospital
  | "Llegada a hospital" //Llegó al hospital
  | "Finalizada" // La emergencia fue tratada. Ya sea porque se llegó al hospital o no
  | "Cancelada"; // La emergencia se canceló
