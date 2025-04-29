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
