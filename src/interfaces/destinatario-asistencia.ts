import { z } from "zod";
import { ClienteSchema, ICliente } from "./cliente";
import { DireccionV2, DireccionV2Schema } from "../auxiliares";
import type { TipoEmergencia } from "./emergencias";

export const InfoAdicionalSchema = z.object({
  descripcion: z.string().optional(),
  adjuntos: z.array(z.string()).optional(), // Array de URLs de archivos adjuntos
});
export type IInfoAdicional = z.infer<typeof InfoAdicionalSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const DestinatarioAsistenciaSchema = z.object({
  _id: z.string().optional(), // ID único del destinatario
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),

  fechaCreacion: z.string().optional(),
  nombre: z.string().optional(),
  tipoEmergencia: z.custom<TipoEmergencia>().optional(),
  apellido: z.string().optional(),
  sexo: z.enum(["M", "F", "X"]).optional(),
  dni: z.string().optional(),
  edad: z.number().optional(),
  obraSocial: z.string().optional(),
  infoAdicional: InfoAdicionalSchema.optional(), // Información adicional del destinatario
  telefono: z.string().optional(), // Teléfono del destinatario
  email: z.string().optional(), // Correo electrónico del destinatario
  telefonoAlternativo: z.string().optional(),
  ubicacion: DireccionV2Schema.optional(), // Ubicación del destinatario

  //Populate
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IDestinatarioAsistencia {
  _id?: string; // ID único del destinatario
  idCliente?: string;
  idsAncestros?: string[];

  fechaCreacion?: string;
  nombre?: string;
  tipoEmergencia?: TipoEmergencia;
  apellido?: string;
  sexo?: "M" | "F" | "X";
  dni?: string;
  edad?: number;
  obraSocial?: string;
  infoAdicional?: IInfoAdicional; // Información adicional del destinatario
  telefono?: string; // Teléfono del destinatario
  email?: string; // Correo electrónico del destinatario
  telefonoAlternativo?: string;
  ubicacion?: DireccionV2; // Ubicación del destinatario

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = "_id";

export const CreateDestinatarioAsistenciaSchema =
  DestinatarioAsistenciaSchema.omit({ _id: true });
export interface ICreateDestinatarioAsistencia
  extends Omit<Partial<IDestinatarioAsistencia>, OmitirCreate> {}

type OmitirUpdate = "_id";

export const UpdateDestinatarioAsistenciaSchema =
  DestinatarioAsistenciaSchema.omit({ _id: true });
export interface IUpdateDestinatarioAsistencia
  extends Omit<Partial<IDestinatarioAsistencia>, OmitirUpdate> {}
