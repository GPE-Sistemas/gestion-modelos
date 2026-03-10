import { IActivo } from './activo';
import { ICliente } from './cliente';
import { IDocumentacion } from './documentacion';
import { IUsuario } from './usuario';

export type TipoRecordatorio = 'km' | 'fecha';
export type CategoriaRecordatorio = 'Colectivo' | 'Vehiculo';
export type SubcategoriaRecordatorio =
  | 'Cambio de aceite y filtro'
  | 'Cambio de aceite de caja'
  | 'Cambio de líquido refrigerante'
  | 'Cambio de filtro de combustible'
  | 'Cambio de filtro de aire'
  | 'Cambio de filtro de habitáculo'
  | 'Cambio de batería'
  | 'Cambio de cubiertas'
  | 'Cambio de luces'
  | 'Cambio de líquido de frenos'
  | 'Cambio de pastillas de freno'
  | 'Cambio de bujías'
  | 'Otro';

//RECORDATORIOS DE MANTENIMIENTO
//- Se generan desde los módulos de vehículos o colectivos en el front end
// -Pueden ser por km o por fecha (o ambos)
//- Tienen subcategorias (cambio de aceite, cambio de cubiertas, etc)
// -Pueden ser repetibles o no (si son repetibles, cada vez que se cumple el recordatorio, se vuelve a crear otro con la misma frecuencia)
// -Los km y las fechas se chequean en el cron. En el caso de los km se chequean cada hora

//RECORDATORIOS DE DOCUMENTACIÓN
//- Son aquellos que tienen idDocumentación
//- La documentación puede ser seguro o licencia
//- Solo son recordatorios por fecha (vencimiento)
// - Las fechas se chequean en el cron
//- La documentación de seguro es para vehículos y colectivos, se crean cuando se crea documentación desde vehículo/colectivo >> detalles >> documentos
//- La documentación de licencia/seguro es para choferes y conductores, se crean desde el listado de choferes/conductores en la acción documentos

//💡💡💡 Creo que esto de los recordatorios debería ser mas genérico porque podría servir para otras entidades. Además, actualmente es confuso porque se mezclan recordatorios de mantenimiento con los de documentación. Podríamos agregar un campo "tipo" que indique si es un recordatorio de mantenimiento o de documentación, y así podríamos tener campos específicos para cada tipo sin que queden confusos.
export interface IRecordatorio {
  _id?: string;
  categoria?: CategoriaRecordatorio;
  subcategoria?: SubcategoriaRecordatorio;
  idCliente?: string;
  idsAncestros?: string[];
  idUsuario?: string;
  tipo?: TipoRecordatorio[];
  notificado?: boolean;
  fechaLimite?: string;
  fechaCreacion?: string;
  kmLimite?: number;
  idActivo?: string;
  idDocumentacion?: string;
  detallesDelMantenimiento?: string;
  repetible?: boolean;
  frecuenciaKm?: number;
  frecuenciaDia?: number;

  // Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
  usuario?: IUsuario;
  activo?: IActivo;
  documentacion?: IDocumentacion;
}

type OmitirCreate = '_id' | 'cliente' | 'activo' | 'documentacion' | 'usuario';

export interface ICreateRecordatorio extends Omit<
  Partial<IRecordatorio>,
  OmitirCreate
> {}

type OmitirUpdate = '_id' | 'cliente' | 'activo' | 'documentacion' | 'usuario';

export interface IUpdateRecordatorio extends Omit<
  Partial<IRecordatorio>,
  OmitirUpdate
> {}
