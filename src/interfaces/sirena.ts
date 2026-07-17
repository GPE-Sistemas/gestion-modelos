import { z } from 'zod';
import { GeoJSONPointSchema } from '../auxiliares';
import { CamaraSchema } from './camara';
import { ClienteSchema } from './cliente';
import { ModeloDispositivoSchema } from './modelo-dispositivo';

export const EstadoSirenaSchema = z.enum(['Online', 'Offline']);
export type EstadoSirena = z.infer<typeof EstadoSirenaSchema>;

export const SirenaSchema = z.object({
  _id: z.string().optional(),
  /// Cosas de IRIX
  idCliente: z.string().optional(),
  idsAncestros: z.array(z.string()).optional(),
  fechaCreacion: z.string().optional(),
  idModelo: z.string().optional(),
  idsAsignados: z.array(z.string()).optional(), // Camaras, sensores, etc

  // Datos de sincronizacion de seguridad
  idExterno: z.string().optional(), /// El _id que tiene la sirena en seguridad
  chipId: z.string().optional(), /// El chipId de la sirena en seguridad
  fechaSincronizacion: z.string().optional(),
  ubicacion: GeoJSONPointSchema.optional(),
  direccion: z.string().optional(),
  activa: z.boolean().optional(),
  estado: EstadoSirenaSchema.optional(),
  tipo: z.string().optional(),
  onlineDesde: z.string().optional(),
  offlineDesde: z.string().optional(),
  iccidSim: z.string().optional(),
  telefono: z.string().optional(),

  /// Populates
  cliente: ClienteSchema.optional(),
  camaras: z.array(CamaraSchema).optional(),
  modelo: ModeloDispositivoSchema.optional(),
});
export type ISirena = z.infer<typeof SirenaSchema>;

export const CreateSirenaSchema = SirenaSchema.omit({
  _id: true,
  cliente: true,
  camaras: true,
  modelo: true,
});
export type ICreateSirena = z.infer<typeof CreateSirenaSchema>;

export const UpdateSirenaSchema = SirenaSchema.omit({
  _id: true,
  cliente: true,
  camaras: true,
  modelo: true,
});
export type IUpdateSirena = z.infer<typeof UpdateSirenaSchema>;
