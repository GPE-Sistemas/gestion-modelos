import { z } from 'zod';
import { GeoJSONSchema, IGeoJSON } from '../auxiliares';
import { ClienteSchema, ICliente } from './cliente';
import { TipoEmergenciaSchema, TipoEmergencia } from './emergencias';

/* ────────────────────────────────────────────────
 *  CATEGORÍAS
 * ────────────────────────────────────────────────*/

export const CategoriaUbicacionSchema = z.enum([
  'Terminal',
  'Domicilio',
  'Activos',
  'Centro de Atención',
  'Hospital',
  'Destino Emergencia',
  'Vehiculos',
  'Luminarias',
]);
// Discriminante de la union IUbicacion: DEBE ser un type alias de literales
// plano, NO z.infer<typeof CategoriaUbicacionSchema>. TS no reconoce el tipo
// inferido de z.enum como discriminante válido para narrowear una
// discriminatedUnion, y los consumidores que tipan un campo Mongoose con
// ICategoriaUbicacion y lo asignan a IUbicacion (ej. api-datos ubicacion/
// service.ts) fallan (TS2322). El schema runtime sigue siendo z.enum abajo.
export type ICategoriaUbicacion =
  | 'Terminal'
  | 'Domicilio'
  | 'Activos'
  | 'Centro de Atención'
  | 'Hospital'
  | 'Destino Emergencia'
  | 'Vehiculos'
  | 'Luminarias';

/* ────────────────────────────────────────────────
 *  VALORES POR CATEGORÍA
 * ────────────────────────────────────────────────*/

//Por ahora estarán vacíos
export const ValoresUbicacionTerminalSchema = z.object({});
// Tipo hand-written (no z.infer): participa como valores de un miembro de la
// union discriminada IUbicacion; z.infer rompe el narrowing por categoria en
// consumidores (doc Mongoose → IUbicacion). Ver ICategoriaUbicacion.
export interface IValoresUbicacionTerminal {}

export const ValoresUbicacionDomicilioSchema = z.object({});
// Tipo hand-written (no z.infer): participa como valores de un miembro de la
// union discriminada IUbicacion; z.infer rompe el narrowing por categoria en
// consumidores (doc Mongoose → IUbicacion). Ver ICategoriaUbicacion.
export interface IValoresUbicacionDomicilio {}

export const ValoresUbicacionActivosSchema = z.object({});
// Tipo hand-written (no z.infer): participa como valores de un miembro de la
// union discriminada IUbicacion; z.infer rompe el narrowing por categoria en
// consumidores (doc Mongoose → IUbicacion). Ver ICategoriaUbicacion.
export interface IValoresUbicacionActivos {}

export const ValoresUbicacionDestinoEmergenciaSchema = z.object({});
// Tipo hand-written (no z.infer): participa como valores de un miembro de la
// union discriminada IUbicacion; z.infer rompe el narrowing por categoria en
// consumidores (doc Mongoose → IUbicacion). Ver ICategoriaUbicacion.
export interface IValoresUbicacionDestinoEmergencia {}

export const ValoresUbicacionVehiculosSchema = z.object({});
// Tipo hand-written (no z.infer): participa como valores de un miembro de la
// union discriminada IUbicacion; z.infer rompe el narrowing por categoria en
// consumidores (doc Mongoose → IUbicacion). Ver ICategoriaUbicacion.
export interface IValoresUbicacionVehiculos {}

export const ValoresUbicacionLuminariasSchema = z.object({});
// Tipo hand-written (no z.infer): participa como valores de un miembro de la
// union discriminada IUbicacion; z.infer rompe el narrowing por categoria en
// consumidores (doc Mongoose → IUbicacion). Ver ICategoriaUbicacion.
export interface IValoresUbicacionLuminarias {}

export const ValoresUbicacionCentroAtencionSchema = z.object({
  telefono: z.string().optional(),
  email: z.string().optional(),
  // Referencia directa (ya no getter): emergencias no tiene imports de valor
  // intra-SCC en V2, así que este import no forma ciclo runtime.
  tipoEmergencia: TipoEmergenciaSchema.optional(),
  activo: z.boolean().optional(),
});
export interface IValoresUbicacionCentroAtencion {
  telefono?: string;
  email?: string;
  tipoEmergencia?: TipoEmergencia;
  activo?: boolean;
}

export const ValoresUbicacionHospitalSchema = z.object({
  telefono: z.string().optional(),
  email: z.string().optional(),
  gestion: z.enum(['Público', 'Privado', 'Público-privado']).optional(),
  activo: z.boolean().optional(),
});
export interface IValoresUbicacionHospital {
  telefono?: string;
  email?: string;
  gestion?: 'Público' | 'Privado' | 'Público-privado';
  activo?: boolean;
}

/* ────────────────────────────────────────────────
 *  MAPA CATEGORÍA → VALORES
 * ────────────────────────────────────────────────*/

export type MapaValoresUbicacion = {
  Terminal: IValoresUbicacionTerminal;
  Domicilio: IValoresUbicacionDomicilio;
  Activos: IValoresUbicacionActivos;
  'Centro de Atención': IValoresUbicacionCentroAtencion;
  Hospital: IValoresUbicacionHospital;
  'Destino Emergencia': IValoresUbicacionDestinoEmergencia;
  Vehiculos: IValoresUbicacionVehiculos;
  Luminarias: IValoresUbicacionLuminarias;
};

/* ────────────────────────────────────────────────
 *  BASE GENÉRICA
 * ────────────────────────────────────────────────*/

export interface IUbicacionBase<T extends keyof MapaValoresUbicacion> {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  identificacion?: string;
  fechaCreacion?: string;
  categoria?: T;
  direccion?: string;
  geojson?: IGeoJSON;
  fotos?: string[];
  color?: string;
  valores?: MapaValoresUbicacion[T];
  // Virtuals
  cliente?: ICliente;
  ancestros?: ICliente[];
}

// Campos comunes a todas las variantes (sin categoria/valores, que discriminan)
const UbicacionCamposSchema = z.object({
  _id: z.string().optional(),
  //
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  identificacion: z.string().optional(),
  fechaCreacion: z.string().optional(),
  direccion: z.string().optional(),
  geojson: GeoJSONSchema.optional(),
  fotos: z.array(z.string()).optional(),
  color: z.string().optional(),
  // Virtuals
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
});

const VarianteUbicacionTerminal = UbicacionCamposSchema.extend({
  categoria: z.literal('Terminal').optional(),
  valores: ValoresUbicacionTerminalSchema.optional(),
});
const VarianteUbicacionDomicilio = UbicacionCamposSchema.extend({
  categoria: z.literal('Domicilio').optional(),
  valores: ValoresUbicacionDomicilioSchema.optional(),
});
const VarianteUbicacionActivos = UbicacionCamposSchema.extend({
  categoria: z.literal('Activos').optional(),
  valores: ValoresUbicacionActivosSchema.optional(),
});
const VarianteUbicacionCentroAtencion = UbicacionCamposSchema.extend({
  categoria: z.literal('Centro de Atención').optional(),
  valores: ValoresUbicacionCentroAtencionSchema.optional(),
});
const VarianteUbicacionHospital = UbicacionCamposSchema.extend({
  categoria: z.literal('Hospital').optional(),
  valores: ValoresUbicacionHospitalSchema.optional(),
});
const VarianteUbicacionDestinoEmergencia = UbicacionCamposSchema.extend({
  categoria: z.literal('Destino Emergencia').optional(),
  valores: ValoresUbicacionDestinoEmergenciaSchema.optional(),
});
const VarianteUbicacionVehiculos = UbicacionCamposSchema.extend({
  categoria: z.literal('Vehiculos').optional(),
  valores: ValoresUbicacionVehiculosSchema.optional(),
});
const VarianteUbicacionLuminarias = UbicacionCamposSchema.extend({
  categoria: z.literal('Luminarias').optional(),
  valores: ValoresUbicacionLuminariasSchema.optional(),
});

/* ────────────────────────────────────────────────
 *  TIPO DISCRIMINADO - READ
 * ────────────────────────────────────────────────*/

export const UbicacionSchema = z.union([
  VarianteUbicacionTerminal,
  VarianteUbicacionDomicilio,
  VarianteUbicacionActivos,
  VarianteUbicacionCentroAtencion,
  VarianteUbicacionHospital,
  VarianteUbicacionDestinoEmergencia,
  VarianteUbicacionVehiculos,
  VarianteUbicacionLuminarias,
]);

/**
 * Tipo hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer porque los ciclos de aliases mutuos disparan TS2589.
 */
export type IUbicacion =
  | IUbicacionBase<'Terminal'>
  | IUbicacionBase<'Domicilio'>
  | IUbicacionBase<'Activos'>
  | IUbicacionBase<'Centro de Atención'>
  | IUbicacionBase<'Hospital'>
  | IUbicacionBase<'Destino Emergencia'>
  | IUbicacionBase<'Vehiculos'>
  | IUbicacionBase<'Luminarias'>;

/* ────────────────────────────────────────────────
 *  CREATE / UPDATE
 * ────────────────────────────────────────────────*/

const camposOmitidos: { _id: true; cliente: true; ancestros: true } = {
  _id: true,
  cliente: true,
  ancestros: true,
};

export const CreateUbicacionSchema = z.union([
  VarianteUbicacionTerminal.omit(camposOmitidos),
  VarianteUbicacionDomicilio.omit(camposOmitidos),
  VarianteUbicacionActivos.omit(camposOmitidos),
  VarianteUbicacionCentroAtencion.omit(camposOmitidos),
  VarianteUbicacionHospital.omit(camposOmitidos),
  VarianteUbicacionDestinoEmergencia.omit(camposOmitidos),
  VarianteUbicacionVehiculos.omit(camposOmitidos),
  VarianteUbicacionLuminarias.omit(camposOmitidos),
]);

type Omitir = '_id' | 'cliente' | 'ancestros';

export type ICreateUbicacion =
  | Omit<IUbicacionBase<'Terminal'>, Omitir>
  | Omit<IUbicacionBase<'Domicilio'>, Omitir>
  | Omit<IUbicacionBase<'Activos'>, Omitir>
  | Omit<IUbicacionBase<'Centro de Atención'>, Omitir>
  | Omit<IUbicacionBase<'Hospital'>, Omitir>
  | Omit<IUbicacionBase<'Destino Emergencia'>, Omitir>
  | Omit<IUbicacionBase<'Vehiculos'>, Omitir>
  | Omit<IUbicacionBase<'Luminarias'>, Omitir>;

export const UpdateUbicacionSchema = z.union([
  VarianteUbicacionTerminal.omit(camposOmitidos).required({ categoria: true }),
  VarianteUbicacionDomicilio.omit(camposOmitidos).required({ categoria: true }),
  VarianteUbicacionActivos.omit(camposOmitidos).required({ categoria: true }),
  VarianteUbicacionCentroAtencion.omit(camposOmitidos).required({
    categoria: true,
  }),
  VarianteUbicacionHospital.omit(camposOmitidos).required({ categoria: true }),
  VarianteUbicacionDestinoEmergencia.omit(camposOmitidos).required({
    categoria: true,
  }),
  VarianteUbicacionVehiculos.omit(camposOmitidos).required({ categoria: true }),
  VarianteUbicacionLuminarias.omit(camposOmitidos).required({
    categoria: true,
  }),
]);

export type IUpdateUbicacion =
  | ({ categoria: 'Terminal' } & Partial<
      Omit<IUbicacionBase<'Terminal'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Domicilio' } & Partial<
      Omit<IUbicacionBase<'Domicilio'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Activos' } & Partial<
      Omit<IUbicacionBase<'Activos'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Centro de Atención' } & Partial<
      Omit<IUbicacionBase<'Centro de Atención'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Hospital' } & Partial<
      Omit<IUbicacionBase<'Hospital'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Destino Emergencia' } & Partial<
      Omit<IUbicacionBase<'Destino Emergencia'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Vehiculos' } & Partial<
      Omit<IUbicacionBase<'Vehiculos'>, Omitir | 'categoria'>
    >)
  | ({ categoria: 'Luminarias' } & Partial<
      Omit<IUbicacionBase<'Luminarias'>, Omitir | 'categoria'>
    >);

/* ────────────────────────────────────────────────
 *  CACHE (sin virtuals)
 * ────────────────────────────────────────────────*/

const camposOmitidosCache: { cliente: true; ancestros: true } = {
  cliente: true,
  ancestros: true,
};

export const UbicacionCacheSchema = z.union([
  VarianteUbicacionTerminal.omit(camposOmitidosCache),
  VarianteUbicacionDomicilio.omit(camposOmitidosCache),
  VarianteUbicacionActivos.omit(camposOmitidosCache),
  VarianteUbicacionCentroAtencion.omit(camposOmitidosCache),
  VarianteUbicacionHospital.omit(camposOmitidosCache),
  VarianteUbicacionDestinoEmergencia.omit(camposOmitidosCache),
  VarianteUbicacionVehiculos.omit(camposOmitidosCache),
  VarianteUbicacionLuminarias.omit(camposOmitidosCache),
]);

export type IUbicacionCache = Omit<IUbicacion, 'cliente' | 'ancestros'>;
