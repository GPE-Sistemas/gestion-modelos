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
export const DestinatarioAsistenciaSchema = z
  .object({
    _id: z.string().optional(), // ID único del destinatario
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),

    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    nombre: z.string().optional(),
    tipoEmergencia: z.custom<TipoEmergencia>().optional(),
    apellido: z.string().optional(),
    sexo: z.enum(["M", "F", "X"]).optional(),
    dni: z.string().optional(),
    edad: z.number().optional(),
    obraSocial: z.string().optional(),
    // @Prop({type: Object, default: {}}) en el legacy: Mixed.
    infoAdicional: InfoAdicionalSchema.optional().meta({ 'x-bson': 'mixed' }), // Información adicional del destinatario
    telefono: z.string().optional(), // Teléfono del destinatario
    email: z.string().optional(), // Correo electrónico del destinatario
    telefonoAlternativo: z.string().optional(),
    // @Prop({type: Object, default: {}, required: true}) en el legacy: Mixed
    // pese a tener un schema DireccionV2 tipado en zod.
    ubicacion: DireccionV2Schema.optional().meta({ 'x-bson': 'mixed' }), // Ubicación del destinatario

    //Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
      },
    }),
  })
  .meta({ 'x-collection': 'destinatarioasistencias' });

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
