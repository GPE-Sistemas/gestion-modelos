import { z } from 'zod';
import type { IActivo } from './activo';
import { ClienteSchema, ICliente } from './cliente';
import type { IDispositivoAlarma } from './dispositivo-alarma';
import type { IGrupo } from './grupo';
import type { ILuminaria } from './luminaria';
import { IRol, RolSchema } from './rol';
import type { IModulos, IUsuario, Rol } from './usuario';

export const NivelSchema = z.enum(['Cliente', 'Grupo', 'Entidad']);
export type Nivel = z.infer<typeof NivelSchema>;

export const TipoEntidadPermisoSchema = z.enum([
  'Activo',
  'Vehículo',
  'Colectivo',
  'Luminaria',
  'Alarma',
  'Cámara',
]);
export type TipoEntidadPermiso = z.infer<typeof TipoEntidadPermisoSchema>;

export const VencimientoPermisoUsuarioSchema = z.object({
  // Venicimiento de un permiso con sus respectivas opciones
  fechaVencimiento: z.string().optional(),
  eliminarPermiso: z.boolean().optional(),
  desactivarUsuario: z.boolean().optional(),
  eliminarUsuario: z.boolean().optional(),
});
export type IVencimientoPermisoUsuario = z.infer<
  typeof VencimientoPermisoUsuarioSchema
>;

export const CredencialesSeguridadSchema = z.object({
  usuario: z.string().optional(),
  claveEncriptada: z.string().optional(),
});
export type ICredencialesSeguridad = z.infer<
  typeof CredencialesSeguridadSchema
>;

//Par actualizar credenciales de seguridad vía PUT /:id/credencialesSeguridad, se recibe este DTO con los datos en texto plano
// (la gestion-api-gestion se encarga de cifrar la clave antes de persistir)
export const UpdateCredencialesSeguridadSchema = z.object({
  idCliente: z.string(),
  usuario: z.string(),
  clave: z.string(),
  // _id del permiso al que aplicar las credenciales (antes era el índice en el array de Usuario)
  idPermiso: z.string().optional(),
});
export type IUpdateCredencialesSeguridad = z.infer<
  typeof UpdateCredencialesSeguridadSchema
>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
//
// Metadata de persistencia por `.meta()` — convención documentada arriba de
// `ProveedorSchema` en proveedor.ts.
export const PermisoSchema = z.object({
  _id: z.string().optional(),
  // Vínculo con el usuario: nombre de usuario normalizado (lowercase/trim).
  // El permiso puede existir aunque el usuario todavía no esté registrado.
  nombreUsuario: z.string().optional().meta({ 'x-setter': 'lowercase' }),
  fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
  //
  nivel: NivelSchema.optional(),
  // Para nivel Cliente
  idCliente: z
    .string()
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  includeChildren: z.boolean().optional(),
  idsAncestros: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
  // Para nivel Grupo
  idsGrupos: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'GrupoSchema' }),
  // Para nivel Entidad
  tipoEntidad: TipoEntidadPermisoSchema.optional(),
  // Polimórfico según tipoEntidad (Activo/Luminaria/Alarma/...): sin ref fijo
  // en el legacy (@Prop sin `ref`), por eso sin x-ref acá tampoco.
  idsEntidades: z.array(z.string()).optional().meta({ 'x-bson': 'objectId' }),
  //
  activo: z.boolean().optional(), // Si el permiso está activo o no
  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  vencimiento: VencimientoPermisoUsuarioSchema.optional().meta({
    'x-bson': 'mixed',
  }),
  modulos: z.custom<IModulos>().optional().meta({ 'x-bson': 'mixed' }),

  /**
   * @deprecated El campo 'roles' está en desuso. Se eliminará en futuras versiones. Los reemplaza "idsRoles" y el virtual "Rols"
   */
  roles: z.array(z.custom<Rol>()).optional(),

  idsRoles: z
    .array(z.string())
    .optional()
    .meta({ 'x-bson': 'objectId', 'x-ref': 'RolSchema' }), // IDs de los roles asignados al permiso

  // @Prop({type: Object}) en el legacy: Mixed, Mongoose no castea adentro.
  credencialesSeguridad: CredencialesSeguridadSchema.optional().meta({
    'x-bson': 'mixed',
  }), // Credenciales del sistema de seguridad (AES encriptadas)
  // Virtual GETTER computado (ToJSONVirtuals): no es un campo real ni un
  // populate, lo calcula credencialesSeguridad.claveEncriptada.
  tieneCredencialesSeguridad: z
    .boolean()
    .optional()
    .meta({ 'x-computed': true }), // Virtual: true si el permiso tiene credenciales configuradas

  // Virtual
  usuario: z.custom<IUsuario>().optional().meta({
    'x-populate': {
      ref: 'UsuarioSchema',
      localField: 'nombreUsuario',
      foreignField: 'usuario',
      justOne: true,
    },
  }), // Usuario vinculado, populado por nombreUsuario
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
  grupos: z.array(z.custom<IGrupo>()).optional().meta({
    'x-populate': {
      ref: 'GrupoSchema',
      localField: 'idsGrupos',
      foreignField: '_id',
      justOne: false,
    },
  }),
  activos: z.array(z.custom<IActivo>()).optional().meta({
    'x-populate': {
      ref: 'ActivoSchema',
      localField: 'idsEntidades',
      foreignField: '_id',
      justOne: false,
    },
  }), // Entidades pobladas según el tipoEntidad
  luminarias: z.array(z.custom<ILuminaria>()).optional().meta({
    'x-populate': {
      ref: 'LuminariaSchema',
      localField: 'idsEntidades',
      foreignField: '_id',
      justOne: false,
    },
  }), // Entidades pobladas según el tipoEntidad
  alarmas: z.array(z.custom<IDispositivoAlarma>()).optional().meta({
    'x-populate': {
      ref: 'DispositivoAlarmaSchema',
      localField: 'idsEntidades',
      foreignField: '_id',
      justOne: false,
    },
  }), // Entidades pobladas según el tipoEntidad
  rols: z.array(RolSchema).optional().meta({
    'x-populate': {
      ref: 'RolSchema',
      localField: 'idsRoles',
      foreignField: '_id',
      justOne: false,
    },
  }), // Roles poblados según idsRoles
}).meta({ 'x-collection': 'permisos' });

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IPermiso {
  _id?: string;
  // Vínculo con el usuario: nombre de usuario normalizado (lowercase/trim).
  // El permiso puede existir aunque el usuario todavía no esté registrado.
  nombreUsuario?: string;
  fechaCreacion?: string;
  //
  nivel?: Nivel;
  // Para nivel Cliente
  idCliente?: string;
  includeChildren?: boolean;
  idsAncestros?: string[];
  // Para nivel Grupo
  idsGrupos?: string[];
  // Para nivel Entidad
  tipoEntidad?: TipoEntidadPermiso;
  idsEntidades?: string[];
  //
  activo?: boolean; // Si el permiso está activo o no
  vencimiento?: IVencimientoPermisoUsuario;
  modulos?: IModulos;

  /**
   * @deprecated El campo 'roles' está en desuso. Se eliminará en futuras versiones. Los reemplaza "idsRoles" y el virtual "Rols"
   */
  roles?: Rol[];

  idsRoles?: string[]; // IDs de los roles asignados al permiso

  credencialesSeguridad?: ICredencialesSeguridad; // Credenciales del sistema de seguridad (AES encriptadas)
  tieneCredencialesSeguridad?: boolean; // Virtual: true si el permiso tiene credenciales configuradas

  // Virtual
  usuario?: IUsuario; // Usuario vinculado, populado por nombreUsuario
  cliente?: ICliente;
  ancestros?: ICliente[];
  grupos?: IGrupo[];
  activos?: IActivo[]; // Entidades pobladas según el tipoEntidad
  luminarias?: ILuminaria[]; // Entidades pobladas según el tipoEntidad
  alarmas?: IDispositivoAlarma[]; // Entidades pobladas según el tipoEntidad
  rols?: IRol[]; // Roles poblados según idsRoles
}

type OmitirVirtuals =
  | 'usuario'
  | 'cliente'
  | 'ancestros'
  | 'grupos'
  | 'activos'
  | 'luminarias'
  | 'alarmas'
  | 'rols'
  | 'tieneCredencialesSeguridad';

type OmitirCreate = '_id' | 'fechaCreacion' | OmitirVirtuals;

export const CreatePermisoSchema = PermisoSchema.omit({
  _id: true,
  fechaCreacion: true,
  usuario: true,
  cliente: true,
  ancestros: true,
  grupos: true,
  activos: true,
  luminarias: true,
  alarmas: true,
  rols: true,
  tieneCredencialesSeguridad: true,
});
export interface ICreatePermiso
  extends Omit<Partial<IPermiso>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'fechaCreacion' | OmitirVirtuals;

export const UpdatePermisoSchema = PermisoSchema.omit({
  _id: true,
  fechaCreacion: true,
  usuario: true,
  cliente: true,
  ancestros: true,
  grupos: true,
  activos: true,
  luminarias: true,
  alarmas: true,
  rols: true,
  tieneCredencialesSeguridad: true,
});
export interface IUpdatePermiso
  extends Omit<Partial<IPermiso>, OmitirUpdate> {}
