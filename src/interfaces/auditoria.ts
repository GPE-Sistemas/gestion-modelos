import { ICliente } from './cliente';
import { IUsuario } from './usuario';

export type AccionAuditoria = 'Crear' | 'Editar' | 'Eliminar';

export interface IAuditoria {
  _id?: string;
  idCliente?: string;
  idsAncestros?: string[];
  fechaCreacion?: string;
  idUsuario?: string;
  nombreUsuario?: string; // se persiste por si se borra el usuario
  entidad?: string; // 'activos', 'usuarios', 'clientes', etc.
  idEntidad?: string; // ID del documento afectado
  accion?: AccionAuditoria;
  cambios?: Record<string, unknown>; // { campo: valorNuevo }
  camposModificados?: string[]; // ['nombre', 'descripcion'] — indexable

  // Populate
  usuario?: IUsuario;
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'fechaCreacion';
export interface ICreateAuditoria extends Omit<
  Partial<IAuditoria>,
  OmitirCreate
> {}

/// LAS AUDITORIAS SON INMUTABLES, FER.
