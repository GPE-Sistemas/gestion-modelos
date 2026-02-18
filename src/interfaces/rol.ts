import { ICliente } from './cliente';

export type AccionesRol =
  // *******************************************
  // EVENTOS
  // *******************************************
  | 'Eventos - Ver eventos'
  | 'Eventos - Atender eventos'
  | 'Eventos - Finalizar eventos'
  // *******************************************
  // LOGS
  // *******************************************
  | 'Logs - Ver logs http'
  | 'Logs - Ver logs eventos lora'
  | 'Logs - Ver logs despachos'
  | 'Logs - Ver logs eventos trackers test'
  | 'Logs - Ver logs reenvios'
  // *******************************************
  // MODULO ADMINISTRACIÓN
  // *******************************************
  // Clientes
  | 'Administración - Ver clientes'
  | 'Administración - Crear clientes'
  | 'Administración - Editar clientes'
  | 'Administración - Eliminar clientes'
  | 'Administración - Deshabilitar / habilitar clientes'
  // Usuarios
  | 'Administración - Ver usuarios'
  | 'Administración - Crear usuarios'
  | 'Administración - Editar usuarios'
  | 'Administración - Eliminar usuarios'
  // Técnicos
  | 'Administración - Ver técnicos'
  | 'Administración - Crear técnicos'
  | 'Administración - Editar técnicos'
  | 'Administración - Eliminar técnicos'
  // Dispositivos Lorawan
  | 'Administración - Ver dispositivos Lorawan'
  | 'Administración - Crear dispositivos Lorawan'
  | 'Administración - Editar dispositivos Lorawan'
  | 'Administración - Eliminar dispositivos Lorawan'
  // Gateways
  | 'Administración - Ver gateways'
  | 'Administración - Crear gateways'
  | 'Administración - Editar gateways'
  | 'Administración - Eliminar gateways'
  // Botones Ble
  | 'Administración - Ver botones Ble'
  | 'Administración - Eliminar botones Ble'
  // Trackers
  | 'Administración - Ver trackers'
  | 'Administración - Crear trackers'
  | 'Administración - Editar trackers'
  | 'Administración - Eliminar trackers'
  // Servicios Ofrecidos
  | 'Administración - Ver servicios ofrecidos'
  | 'Administración - Crear servicios ofrecidos'
  | 'Administración - Editar servicios ofrecidos'
  | 'Administración - Eliminar servicios ofrecidos'
  // Apikeys
  | 'Administración - Ver apikeys'
  | 'Administración - Crear apikeys'
  | 'Administración - Editar apikeys'
  | 'Administración - Eliminar apikeys'
  // Config. de reenvios
  | 'Administración - Ver configuraciones de reenvíos'
  | 'Administración - Crear configuraciones de reenvíos'
  | 'Administración - Editar configuraciones de reenvíos'
  | 'Administración - Eliminar configuraciones de reenvíos'
  // Integraciones
  | 'Administración - Ver integraciones'
  | 'Administración - Crear integraciones'
  // Roles
  | 'Administración - Ver roles'
  | 'Administración - Crear roles'
  | 'Administración - Editar roles'
  | 'Administración - Eliminar roles'
  // *******************************************
  // CONFIGURACIONES
  // *******************************************
  | 'Configuraciones - Configurar cliente'
  | 'Configuraciones - Crear eventos personalizados'
  | 'Configuraciones - Editar eventos personalizados'
  | 'Configuraciones - Eliminar eventos personalizados'
  | 'Configuraciones - Crear categorias eventos'
  | 'Configuraciones - Editar categorias eventos'
  | 'Configuraciones - Eliminar categorias eventos'
  | 'Configuraciones - Crear tipos eventos'
  | 'Configuraciones - Editar tipos eventos'
  | 'Configuraciones - Eliminar tipos eventos'
  | 'Configuraciones - Crear codigos alarmas'
  | 'Configuraciones - Editar codigos alarmas'
  | 'Configuraciones - Eliminar codigos alarmas'
  | 'Configuraciones - Crear modelos alarmas'
  | 'Configuraciones - Editar modelos alarmas'
  | 'Configuraciones - Eliminar modelos alarmas'
  | 'Configuraciones - Crear codigos comunicadores'
  | 'Configuraciones - Editar codigos comunicadores'
  | 'Configuraciones - Eliminar codigos comunicadores'
  | 'Configuraciones - Crear modelos comunicadores'
  | 'Configuraciones - Editar modelos comunicadores'
  | 'Configuraciones - Eliminar modelos comunicadores'
  | 'Configuraciones - Crear modelos cámaras'
  | 'Configuraciones - Editar modelos cámaras'
  | 'Configuraciones - Eliminar modelos cámaras'
  | 'Configuraciones - Crear codigos sirenas'
  | 'Configuraciones - Editar codigos sirenas'
  | 'Configuraciones - Eliminar codigos sirenas'
  | 'Configuraciones - Crear modelos sirenas'
  | 'Configuraciones - Editar modelos sirenas'
  | 'Configuraciones - Eliminar modelos sirenas'
  | 'Configuraciones - Crear modelos luminarias'
  | 'Configuraciones - Editar modelos luminarias'
  | 'Configuraciones - Eliminar modelos luminarias'
  | 'Configuraciones - Crear perfiles luminarias'
  | 'Configuraciones - Editar perfiles luminarias'
  | 'Configuraciones - Eliminar perfiles luminarias'
  | 'Configuraciones - Crear codigos dispositivos lorawan'
  | 'Configuraciones - Editar codigos dispositivos lorawan'
  | 'Configuraciones - Eliminar codigos dispositivos lorawan'
  | 'Configuraciones - Crear modelos dispositivos lorawan'
  | 'Configuraciones - Editar modelos dispositivos lorawan'
  | 'Configuraciones - Eliminar modelos dispositivos lorawan'
  | 'Configuraciones - Crear codigos botones BLE'
  | 'Configuraciones - Editar codigos botones BLE'
  | 'Configuraciones - Eliminar codigos botones BLE'
  | 'Configuraciones - Crear modelos botones BLE'
  | 'Configuraciones - Editar modelos botones BLE'
  | 'Configuraciones - Eliminar modelos botones BLE'
  | 'Configuraciones - Crear codigos trackers'
  | 'Configuraciones - Editar codigos trackers'
  | 'Configuraciones - Eliminar codigos trackers'
  | 'Configuraciones - Crear modelos trackers'
  | 'Configuraciones - Editar modelos trackers'
  | 'Configuraciones - Eliminar modelos trackers'
  | 'Configuraciones - Crear iconos vehículos'
  | 'Configuraciones - Editar iconos vehículos'
  | 'Configuraciones - Eliminar iconos vehículos'
  // *******************************************
  // MODULO SERVICIO TECNICO
  // *******************************************
  | 'Servicio Técnico - Ver solicitudes'
  | 'Servicio Técnico - Crear solicitudes'
  | 'Servicio Técnico - Editar solicitudes'
  | 'Servicio Técnico - Eliminar solicitudes'
  | 'Servicio Técnico - Reasignar solicitudes'
  | 'Servicio Técnico - Atender solicitudes'
  // *******************************************
  // MODULO ALARMAS
  // *******************************************
  | 'Alarmas - Crear'
  | 'Alarmas - Editar'
  | 'Alarmas - Eliminar'
  | 'Alarmas - Exportar eventos'
  | 'Alarmas - Dar de alta'
  | 'Alarmas - Actualizar imágenes'
  | 'Alarmas - Cambiar de cliente'
  | 'Alarmas - Configurar comunicador'
  | 'Alarmas - Solicitar servicio técnico'
  | 'Alarmas - Cambiar estado de cuenta'
  | 'Alarmas - Cambiar modo desactivado'
  | 'Alarmas - Editar control horario'
  | 'Alarmas - Editar contactos '
  | 'Alarmas - Editar notas'
  | 'Alarmas - Asignar cámaras'
  | 'Alarmas - Enviar comandos'
  // *******************************************
  // MODULO VEHÍCULOS
  // *******************************************
  // Vehículos
  | 'Vehículos - Crear'
  | 'Vehículos - Editar'
  | 'Vehículos - Eliminar'
  | 'Vehículos - Exportar eventos'
  | 'Vehículos - Exportar Reportes'
  | 'Vehículos - Dar de alta'
  | 'Vehículos - Actualizar imágenes'
  | 'Vehículos - Modo estacionado'
  | 'Vehículos - Cambiar modo desactivado'
  | 'Vehículos - Cambiar de cliente'
  | 'Vehículos - Solicitar servicio técnico'
  | 'Vehículos - Enviar comandos'
  | 'Vehículos - Editar contactos '
  | 'Vehículos - Editar notas'
  | 'Vehículos - Editar documentos vehículo'
  // Conductores
  | 'Vehículos - Crear conductor'
  | 'Vehículos - Editar conductor'
  | 'Vehículos - Eliminar conductor'
  | 'Vehículos - Asignar conductor'
  | 'Vehículos - Crear documentos conductor'
  | 'Vehículos - Editar documentos conductor'
  | 'Vehículos - Eliminar documentos conductor'
  // zonas, recorridos, flotas, recordatorios, servicios y proveedores
  | 'Vehículos - Crear zonas'
  | 'Vehículos - Editar zonas'
  | 'Vehículos - Eliminar zonas'
  | 'Vehículos - Crear recorridos'
  | 'Vehículos - Editar recorridos'
  | 'Vehículos - Eliminar recorridos'
  | 'Vehículos - Crear flotas'
  | 'Vehículos - Editar flotas'
  | 'Vehículos - Eliminar flotas'
  | 'Vehículos - Crear recordatorios'
  | 'Vehículos - Editar recordatorios'
  | 'Vehículos - Eliminar recordatorios'
  | 'Vehículos - Crear servicios'
  | 'Vehículos - Editar servicios'
  | 'Vehículos - Eliminar servicios'
  | 'Vehículos - Crear proveedores'
  | 'Vehículos - Editar proveedores'
  | 'Vehículos - Eliminar proveedores'
  // *******************************************
  // MODULO LUMINARIAS
  // *******************************************
  | 'Luminarias - Crear'
  | 'Luminarias - Editar'
  | 'Luminarias - Eliminar'
  | 'Luminarias - Enviar comandos'
  | 'Luminarias - Solicitar servicio técnico'
  | 'Luminarias - Editar contactos '
  | 'Luminarias - Editar notas'
  // Agrupaciones
  | 'Luminarias - Crear agrupaciones'
  | 'Luminarias - Editar agrupaciones'
  | 'Luminarias - Eliminar agrupaciones'
  // *******************************************
  // MODULO ACTIVOS
  // *******************************************
  // Activos
  | 'Activos - Crear'
  | 'Activos - Editar'
  | 'Activos - Eliminar'
  | 'Activos - Exportar eventos'
  | 'Activos - Exportar Reportes'
  // | 'Activos - Dar de alta' // No esta implementado pero quizá se implemente en un futuro
  // | 'Activos - Actualizar imágenes' // No esta implementado pero quizá se implemente en un futuro
  | 'Activos - Cambiar modo desactivado'
  | 'Activos - Cambiar de cliente'
  | 'Activos - Cambiar estado de cuenta'
  | 'Activos - Solicitar servicio técnico'
  // | 'Activos - Enviar comandos' // No esta implementado pero quizá se implemente en un futuro
  | 'Activos - Editar contactos '
  | 'Activos - Editar notas'
  // Ubicaciones, agrupaciones
  | 'Activos - Crear ubicaciones'
  | 'Activos - Editar ubicaciones'
  | 'Activos - Eliminar ubicaciones'
  | 'Activos - Crear agrupaciones'
  | 'Activos - Editar agrupaciones'
  | 'Activos - Eliminar agrupaciones'
  // *******************************************
  // MODULO TRASNPORTE PUBLICO / COLECTIVOS
  // *******************************************
  // Colectivos
  | 'Colectivos - Crear'
  | 'Colectivos - Editar'
  | 'Colectivos - Eliminar'
  | 'Colectivos - Exportar eventos'
  | 'Colectivos - Exportar Reportes'
  // | 'Colectivos - Dar de alta' // No esta implementado pero quizá se implemente en un futuro
  // | 'Colectivos - Actualizar imágenes' // No esta implementado pero quizá se implemente en un futuro
  | 'Colectivos - Cambiar modo desactivado'
  // | 'Colectivos - Cambiar de cliente' // No esta implementado pero quizá se implemente en un futuro
  | 'Colectivos - Solicitar servicio técnico'
  | 'Colectivos - Setear odómetro'
  // | 'Colectivos - Enviar comandos' // No esta implementado pero quizá se implemente en un futuro
  | 'Colectivos - Editar contactos '
  | 'Colectivos - Editar notas'
  | 'Colectivos - Editar documentos colectivo'
  // Recorridos, terminales, líneas, choferes, cronogramas, recordatorios, servicios y proveedores
  | 'Colectivos - Crear recorridos'
  | 'Colectivos - Editar recorridos'
  | 'Colectivos - Eliminar recorridos'
  | 'Colectivos - Crear terminales'
  | 'Colectivos - Editar terminales'
  | 'Colectivos - Eliminar terminales'
  | 'Colectivos - Crear líneas'
  | 'Colectivos - Editar líneas'
  | 'Colectivos - Eliminar líneas'
  | 'Colectivos - Crear choferes'
  | 'Colectivos - Editar choferes'
  | 'Colectivos - Eliminar choferes'
  | 'Colectivos - Crear cronogramas'
  | 'Colectivos - Editar cronogramas'
  | 'Colectivos - Eliminar cronogramas'
  | 'Colectivos - Crear recordatorios'
  | 'Colectivos - Editar recordatorios'
  | 'Colectivos - Eliminar recordatorios'
  | 'Colectivos - Crear servicios'
  | 'Colectivos - Editar servicios'
  | 'Colectivos - Eliminar servicios'
  | 'Colectivos - Crear proveedores'
  | 'Colectivos - Editar proveedores'
  | 'Colectivos - Eliminar proveedores'
  // *******************************************
  // MODULO EMERGENCIAS MÉDICAS
  // *******************************************
  // Emergencias Médicas
  | 'Emergencias Médicas - Crear'
  | 'Emergencias Médicas - Importar'
  | 'Emergencias Médicas - Editar'
  | 'Emergencias Médicas - Eliminar'
  | 'Emergencias Médicas - Reasignar'
  | 'Emergencias Médicas - Finalizar'
  | 'Emergencias Médicas - Cancelar'
  // Hospitales, centros médicos, personal de salud, solicitantes, pacientes
  | 'Emergencias Médicas - Crear hospitales'
  | 'Emergencias Médicas - Editar hospitales'
  | 'Emergencias Médicas - Eliminar hospitales'
  | 'Emergencias Médicas - Crear centros médicos'
  | 'Emergencias Médicas - Editar centros médicos'
  | 'Emergencias Médicas - Eliminar centros médicos'
  | 'Emergencias Médicas - Crear personal de salud'
  | 'Emergencias Médicas - Editar personal de salud'
  | 'Emergencias Médicas - Eliminar personal de salud'
  | 'Emergencias Médicas - Crear solicitantes'
  | 'Emergencias Médicas - Editar solicitantes'
  | 'Emergencias Médicas - Eliminar solicitantes'
  | 'Emergencias Médicas - Crear pacientes'
  | 'Emergencias Médicas - Editar pacientes'
  | 'Emergencias Médicas - Eliminar pacientes'
  // *******************************************
  // MODULO SIRENAS MUNICIPALES
  // *******************************************
  // Sirenas Municipales
  | 'Sirenas Municipales - Sincronizar'
  | 'Sirenas Municipales - Editar'
  | 'Sirenas Municipales - Eliminar'
  | 'Sirenas Municipales - Solicitar servicio técnico'
  | 'Sirenas Municipales - Asignar cámaras'
  // *******************************************
  // MODULO CÁMARAS
  // *******************************************
  // Cámaras
  | 'Cámaras - Crear cámara'
  | 'Cámaras - Editar cámara'
  | 'Cámaras - Eliminar cámara'
  | 'Cámaras - Solicitar servicio técnico'
  | 'Cámaras - Ver streaming'
  | 'Cámaras - Descargar grabaciones';

export interface IRol {
  _id?: string;
  //
  idCliente?: string;
  idsAncestros?: string[];
  default?: boolean;
  global?: boolean;

  nombre?: string;
  acciones?: AccionesRol[];

  //Populate
  cliente?: ICliente;
  ancestros?: ICliente[];
}

type OmitirCreate = '_id' | 'cliente';

export interface ICreateRol extends Omit<Partial<IRol>, OmitirCreate> {}

type OmitirUpdate = '_id' | 'cliente';

export interface IUpdateRol extends Omit<Partial<IRol>, OmitirUpdate> {}

export interface IRolCache extends Omit<IRol, 'cliente' | 'ancestros'> {}
