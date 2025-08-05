import { ICliente } from './cliente';

export interface IPersonalSalud {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];

  fechaCreacion?: string;
  nombre?: string; // Nombre completo
  rol?: 'Médico' | 'Enfermero';
  matricula?: string; // Matrícula profesional
  dni?: string;
  telefono?: string;
  email?: string;
  activo?: boolean; // Disponibilidad laboral

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id';

export interface ICreatePersonalSalud
  extends Omit<Partial<IPersonalSalud>, OmitirCreate> {}

type OmitirUpdate = '_id';

export interface IUpdatePersonalSalud
  extends Omit<Partial<IPersonalSalud>, OmitirUpdate> {}
