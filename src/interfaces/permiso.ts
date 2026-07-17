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
export const PermisoSchema = z.object({
  _id: z.string().optional(),
  // Vínculo con el usuario: nombre de usuario normalizado (lowercase/trim).
  // El permiso puede existir aunque el usuario todavía no esté registrado.
  nombreUsuario: z.string().optional(),
  fechaCreacion: z.string().optional(),
  //
  nivel: NivelSchema.optional(),
  // Para nivel Cliente
  idCliente: z.string().optional(),
  includeChildren: z.boolean().optional(),
  idsAncestros: z.array(z.string()).optional(),
  // Para nivel Grupo
  idsGrupos: z.array(z.string()).optional(),
  // Para nivel Entidad
  tipoEntidad: TipoEntidadPermisoSchema.optional(),
  idsEntidades: z.array(z.string()).optional(),
  //
  activo: z.boolean().optional(), // Si el permiso está activo o no
  vencimiento: VencimientoPermisoUsuarioSchema.optional(),
  modulos: z.custom<IModulos>().optional(),

  /**
   * @deprecated El campo 'roles' está en desuso. Se eliminará en futuras versiones. Los reemplaza "idsRoles" y el virtual "Rols"
   */
  roles: z.array(z.custom<Rol>()).optional(),

  idsRoles: z.array(z.string()).optional(), // IDs de los roles asignados al permiso

  credencialesSeguridad: CredencialesSeguridadSchema.optional(), // Credenciales del sistema de seguridad (AES encriptadas)
  tieneCredencialesSeguridad: z.boolean().optional(), // Virtual: true si el permiso tiene credenciales configuradas

  // Virtual
  usuario: z.custom<IUsuario>().optional(), // Usuario vinculado, populado por nombreUsuario
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  grupos: z.array(z.custom<IGrupo>()).optional(),
  activos: z.array(z.custom<IActivo>()).optional(), // Entidades pobladas según el tipoEntidad
  luminarias: z.array(z.custom<ILuminaria>()).optional(), // Entidades pobladas según el tipoEntidad
  alarmas: z.array(z.custom<IDispositivoAlarma>()).optional(), // Entidades pobladas según el tipoEntidad
  rols: z.array(RolSchema).optional(), // Roles poblados según idsRoles
});

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
