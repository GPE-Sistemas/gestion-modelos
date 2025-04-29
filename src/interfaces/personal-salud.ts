export interface IPersonalSalud {
  _id?: string;
  nombre?: string; // Nombre completo
  rol?: "medico" | "enfermero";
  matricula?: string; // Matrícula profesional
  dni?: string;
  telefono?: string;
  email?: string;
  activo: boolean; // Disponibilidad laboral
}

type OmitirCreate = "_id";

export interface ICreatePersonalSalud
  extends Omit<Partial<IPersonalSalud>, OmitirCreate> {}

type OmitirUpdate = "_id";

export interface IUpdatePersonalSalud
  extends Omit<Partial<IPersonalSalud>, OmitirUpdate> {}
