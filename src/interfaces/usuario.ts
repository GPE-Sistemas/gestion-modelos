import { z } from 'zod';
import { ClienteSchema, ICliente } from './cliente';
import type { IPermiso } from './permiso';

// Nota: no se llama RolSchema porque rol.ts ya exporta ese nombre (para el
// type IRol) y el barrel `export *` daría TS2308.
export const RolUsuarioSchema = z.enum([
  'Administrador',
  'Operador',
  'Conductor',
  'Chofer Colectivo',
  'Consultor',
  'Técnico',
  'Final',
  'Administrador Emergencias', //Puede crear/editar emergencias, hospitales, choferes, solicitantes, centros de atención, destinatarios asistencia, personal de salud.
  // Puede ver todas las solapas del módulo de emergencias.
  'Registrador Emergencias', //Puede crear/editar emergencias y solicitantes
  //Puede ver todas las solapas del módulo emergencias, menos el dashboard con estadísticas
  'Móvil Emergencias', //Usuario de la aplicación móvil, puede editar los eventos de emergencias (seguimiento)
  //Puede ver todo lo que está en el módulo de emergencias de la aplicación móvil.
]);
export type Rol = z.infer<typeof RolUsuarioSchema>;

export const ModulosSchema = z.object({
  moduloColectivos: z.boolean().optional(),
  moduloAlarmasDomiciliarias: z.boolean().optional(),
  moduloCamaras: z.boolean().optional(),
  moduloLuminarias: z.boolean().optional(),
  moduloEmergenciasMedicas: z.boolean().optional(),
  moduloEmergenciasBomberos: z.boolean().optional(),
  moduloActivos: z.boolean().optional(),
  moduloAdministracion: z.boolean().optional(),
  moduloEventosTecnicos: z.boolean().optional(),
  moduloVehiculos: z.boolean().optional(),
  moduloLogs: z.boolean().optional(),
  moduloIntegraciones: z.boolean().optional(),
  moduloSirenas: z.boolean().optional(),
  moduloAlertasSeguridad: z.boolean().optional(),
});
export type IModulos = z.infer<typeof ModulosSchema>;

export const DatosPersonalesSchema = z.object({
  nombre: z.string().optional(),
  dni: z.string().optional(),
  sexo: z.boolean().optional(),
  email: z.string().optional(),
  direccion: z.string().optional(),
  pais: z.string().optional(),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  foto: z.string().optional(),
});
export type IDatosPersonales = z.infer<typeof DatosPersonalesSchema>;

export const ClaveUsuarioAlarmaSchema = z.object({
  idAlarma: z.string().optional(),
  clave: z.string().optional(),
});
export type IClaveUsuarioAlarma = z.infer<typeof ClaveUsuarioAlarmaSchema>;

export const ConfigUsuarioSchema = z.object({
  notasEnPrimerPlano: z.boolean().optional(),
  cantMapasVehiculos: z.number().optional(),
  noMostrarGuardarClaveAlarma: z.boolean().optional(),
  clavesAlarma: z.array(ClaveUsuarioAlarmaSchema).optional(),
});
export type IConfigUsuario = z.infer<typeof ConfigUsuarioSchema>;

// Populates intra-SCC como z.custom (import type-only): un schema real acá
// arrastra el shape completo del ciclo y revienta la serialización de
// declarations (TS7056) acá y en los consumidores NestJS.
export const UsuarioSchema = z.object({
  _id: z.string().optional(),
  identificacionInterna: z.string().optional(),
  /**
   * @deprecated El cliente del usuario se resuelve por su Permiso
   * (Permiso.nombreUsuario === Usuario.usuario → Permiso.idCliente), no por este
   * campo. No usar para agrupar/scopear por cliente: los auto-registrados lo
   * tienen vacío.
   */
  idCliente: z.string().optional(),
  /** @deprecated Deriva de {@link idCliente} (deprecado). Usar el permiso. */
  idsAncestros: z.array(z.string()).optional(),
  //
  idExterno: z.string().optional(),
  fechaCreacion: z.string().optional(),
  usuario: z.string().optional(),
  hash: z.string().optional(),
  datosPersonales: DatosPersonalesSchema.optional(),
  config: ConfigUsuarioSchema.optional(),
  // Estadísticas de uso (actividad). Se actualizan en cada login exitoso
  // (grant password o Google / auto-registro), NO en los refresh de token.
  // Detalle temporal (DAU/WAU/MAU, series) vive en la colección LoginEvento.
  ultimoLogin: z.string().optional(),
  primerLogin: z.string().optional(),
  cantidadLogins: z.number().optional(),
  // Populate / Virtual
  cliente: ClienteSchema.optional(),
  ancestros: z.array(ClienteSchema).optional(),
  // Permisos del usuario. Ya no es un array embebido: es un virtual poblado
  // desde la colección Permiso por match de nombreUsuario (Permiso.nombreUsuario === Usuario.usuario).
  permisos: z.array(z.custom<IPermiso>()).optional(),
});

/**
 * Interface hand-written (misma forma que el schema): los tipos de entidad del
 * SCC no usan z.infer para no arrastrar el ciclo en el declaration emit.
 */
export interface IUsuario {
  _id?: string;
  identificacionInterna?: string;
  /**
   * @deprecated El cliente del usuario se resuelve por su Permiso
   * (Permiso.nombreUsuario === Usuario.usuario → Permiso.idCliente), no por este
   * campo. No usar para agrupar/scopear por cliente: los auto-registrados lo
   * tienen vacío.
   */
  idCliente?: string;
  /** @deprecated Deriva de {@link idCliente} (deprecado). Usar el permiso. */
  idsAncestros?: string[];
  //
  idExterno?: string;
  fechaCreacion?: string;
  usuario?: string;
  hash?: string;
  datosPersonales?: IDatosPersonales;
  config?: IConfigUsuario;
  // Estadísticas de uso (actividad). Se actualizan en cada login exitoso
  // (grant password o Google / auto-registro), NO en los refresh de token.
  // Detalle temporal (DAU/WAU/MAU, series) vive en la colección LoginEvento.
  ultimoLogin?: string;
  primerLogin?: string;
  cantidadLogins?: number;
  // Populate / Virtual
  cliente?: ICliente;
  ancestros?: ICliente[];
  // Permisos del usuario. Ya no es un array embebido: es un virtual poblado
  // desde la colección Permiso por match de nombreUsuario (Permiso.nombreUsuario === Usuario.usuario).
  permisos?: IPermiso[];
}

// Las métricas de uso las escribe internamente el registro de login, nunca el
// cliente: se excluyen del create/update público (anti mass-assignment).
type CamposStats = 'ultimoLogin' | 'primerLogin' | 'cantidadLogins';

type OmitirCreate = '_id' | 'cliente' | 'fechaCreacion' | CamposStats;

export const CreateUsuarioSchema = UsuarioSchema.omit({
  _id: true,
  cliente: true,
  fechaCreacion: true,
  ultimoLogin: true,
  primerLogin: true,
  cantidadLogins: true,
});
export interface ICreateUsuario extends Omit<Partial<IUsuario>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente' | 'fechaCreacion' | CamposStats;

export const UpdateUsuarioSchema = UsuarioSchema.omit({
  _id: true,
  cliente: true,
  fechaCreacion: true,
  ultimoLogin: true,
  primerLogin: true,
  cantidadLogins: true,
});
export interface IUpdateUsuario extends Omit<Partial<IUsuario>, OmitirUpdate> {}
