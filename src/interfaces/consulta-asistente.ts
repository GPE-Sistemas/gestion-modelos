import { z } from 'zod';
import { ClienteSchema } from './cliente';

// El historial del asistente de IRIX (Chirix): una consulta por pregunta, con lo que respondió, lo que consultó para
// responder y la valoración de quien preguntó. Las preguntas de una misma charla comparten `idConversacion`. Mismo
// diseño que el asistente de gas (gas-modelos consulta-asistente.ts), con lo propio de IRIX: el permiso con el que se
// preguntó (el asistente responde con sus datos) y el mapa de la respuesta en lugar de los bloques y la ayuda.

export const ResultadoConsultaAsistenteSchema = z.enum(['ok', 'error']);
export type ResultadoConsultaAsistente = z.infer<typeof ResultadoConsultaAsistenteSchema>;

// Una herramienta que usó el asistente para responder: con qué la llamó y qué le devolvió (recortado). Sirve para
// auditar la respuesta y para que la pregunta siguiente de la misma charla vea lo que se consultó antes: sin esto el
// modelo recibe sólo su texto y desmiente consultas que sí hizo.
export const HerramientaConsultaAsistenteSchema = z.object({
  nombre: z.string(),
  // El que muestra el chat ("Consultó: Vehículos").
  titulo: z.string().optional(),
  argumentos: z.record(z.string(), z.unknown()).optional(),
  resultado: z.string().optional(),
  esError: z.boolean().optional(),
});
export type IHerramientaConsultaAsistente = z.infer<typeof HerramientaConsultaAsistenteSchema>;

// Preguntas para seguir que propone el asistente al final de una respuesta: botones al pie de la última respuesta.
export const MAX_SUGERENCIAS_ASISTENTE = 3;
export const SugerenciasAsistenteSchema = z.array(z.string().trim().min(3).max(80)).max(MAX_SUGERENCIAS_ASISTENTE);

// El mapa de una respuesta (puntos de una búsqueda o un recorrido): lo arma el MCP con entidades que el permiso ya
// ve, nunca el modelo. Se guarda para mostrarlo al reabrir la conversación.
export const PuntoMapaAsistenteSchema = z.object({
  lng: z.number(),
  lat: z.number(),
  nombre: z.string().nullable().optional(),
  detalle: z.string().optional(),
  ruta: z.string().optional(),
  fecha: z.string().nullable().optional(),
});
export const MapaAsistenteSchema = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('puntos'),
    titulo: z.string(),
    puntos: z.array(PuntoMapaAsistenteSchema),
    sinUbicacion: z.number().optional(),
  }),
  z.object({
    tipo: z.literal('recorrido'),
    titulo: z.string(),
    linea: z.array(z.tuple([z.number(), z.number()])),
    inicio: PuntoMapaAsistenteSchema,
    fin: PuntoMapaAsistenteSchema,
  }),
]);
export type IMapaAsistente = z.infer<typeof MapaAsistenteSchema>;

// La valoración que deja el usuario sobre una respuesta (las manitos al pie). El comentario va sólo con el voto
// negativo («¿Qué esperabas?») y es opcional.
export const VotoAsistenteSchema = z.enum(['positivo', 'negativo']);
export type VotoAsistente = z.infer<typeof VotoAsistenteSchema>;
export const MAX_COMENTARIO_VALORACION_ASISTENTE = 1000;
export const ValoracionAsistenteSchema = z.object({
  voto: VotoAsistenteSchema,
  comentario: z.string().optional(),
  // La pone api-gestion al guardarla; la última vale (el usuario puede cambiar el voto).
  fecha: z.string().optional(),
});
export type IValoracionAsistente = z.infer<typeof ValoracionAsistenteSchema>;

// Lo que manda el chat al votar. `voto: null` saca la valoración. Un comentario vacío cuenta como ausente.
export const PedidoValoracionAsistenteSchema = z
  .object({
    voto: VotoAsistenteSchema.nullable(),
    comentario: z
      .string()
      .trim()
      .max(MAX_COMENTARIO_VALORACION_ASISTENTE)
      .transform((s) => s || undefined)
      .optional(),
  })
  .refine((p) => p.voto === 'negativo' || p.comentario === undefined, {
    message: 'el comentario va sólo con el voto negativo',
    path: ['comentario'],
  });
export type IPedidoValoracionAsistente = z.input<typeof PedidoValoracionAsistenteSchema>;

// Desde dónde se preguntó: el chat de la web o la app. Fuera de la web el asistente puede responder distinto, así
// que para revisar una respuesta hay que saber de cuál vino.
export const CanalAsistenteSchema = z.enum(['web', 'android', 'ios']);
export type CanalAsistente = z.infer<typeof CanalAsistenteSchema>;

// Una pregunta al asistente: qué se preguntó, qué respondió, qué consultó y cuánto consumió. El costo no se guarda:
// se calcula con los tokens y el precio del modelo, que cambia.
export const ConsultaAsistenteSchema = z
  .object({
    _id: z.string().optional(),
    idCliente: z.string().optional().meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z.array(z.string()).optional().meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    // Quién preguntó: cada usuario ve sólo sus conversaciones.
    idUsuario: z.string().meta({ 'x-bson': 'objectId', 'x-ref': 'UsuarioSchema' }),
    // El permiso elegido al preguntar: el asistente respondió con sus datos (módulos, acciones, alcance).
    idPermiso: z.string().optional().meta({ 'x-bson': 'objectId', 'x-ref': 'PermisoSchema' }),
    // Agrupa las preguntas de una misma charla; lo genera el front.
    idConversacion: z.string(),
    fecha: z.string().optional().meta({ 'x-bson': 'date' }),
    canal: CanalAsistenteSchema.optional(),
    pregunta: z.string(),
    respuesta: z.string().optional(),
    // En el orden en que se llamaron.
    herramientas: z.array(HerramientaConsultaAsistenteSchema).optional().meta({ 'x-bson': 'mixed' }),
    sugerencias: SugerenciasAsistenteSchema.optional(),
    mapa: MapaAsistenteSchema.optional().meta({ 'x-bson': 'mixed' }),
    modelo: z.string().optional(),
    tokensEntrada: z.number().nullable().optional(),
    tokensCache: z.number().nullable().optional(),
    tokensSalida: z.number().nullable().optional(),
    ms: z.number().optional(),
    resultado: ResultadoConsultaAsistenteSchema,
    error: z.string().optional(),
    // Ausente mientras el usuario no votó la respuesta.
    valoracion: ValoracionAsistenteSchema.optional().meta({ 'x-bson': 'mixed' }),
    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
  })
  .meta({ 'x-collection': 'consultaasistentes' });
export type IConsultaAsistente = z.infer<typeof ConsultaAsistenteSchema>;

export const CreateConsultaAsistenteSchema = ConsultaAsistenteSchema.omit({ _id: true, cliente: true });
export type ICreateConsultaAsistente = z.infer<typeof CreateConsultaAsistenteSchema>;

// Una conversación en la lista del chat: no se guarda, la arma api-gestion agrupando las consultas del usuario.
export const MAX_TITULO_CONVERSACION_ASISTENTE = 80;
export const ConversacionAsistenteSchema = z.object({
  idConversacion: z.string(),
  // La primera pregunta, recortada a MAX_TITULO_CONVERSACION_ASISTENTE.
  titulo: z.string(),
  // Fecha de la primera y de la última consulta.
  inicio: z.string(),
  ultima: z.string(),
  // Cantidad de consultas (preguntas con su respuesta).
  turnos: z.number().int().min(1),
});
export type IConversacionAsistente = z.infer<typeof ConversacionAsistenteSchema>;
