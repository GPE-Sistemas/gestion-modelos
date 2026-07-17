import { z } from "zod";

// GEOJSON
// https://www.mongodb.com/docs/manual/reference/geojson/
// type es el tipo de objeto a guardar
//  Point LineString  Polygon  MultiPoint  MultiLineString  MultiPolygon  GeometryCollection
// 🗺️
// coordinates[0] = longitud
//  coordinates[1] = latitud
//  coordinates: [number, number];
//

/** [longitud, latitud] */
const PuntoCoord = z.tuple([z.number(), z.number()]);

/**
 * 🗺️
 *
 * Representa un punto geográfico (longitud y latitud)
 *
 * - coordinates: [number, number];
 *
 * --- coordinates[0] = longitud
 *
 * --- coordinates[1] = latitud
 *
 */
export const GeoJSONPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: PuntoCoord,
});

/**
 * 🗺️
 *
 * Representa un círculo geográfico (punto central y radio)
 *
 * - coordinates: [number, number];
 *
 * --- coordinates[0] = longitud del centro
 *
 * --- coordinates[1] = latitud del centro
 *
 * - radius: radio del círculo
 *
 */
export const GeoJSONCircleSchema = z.object({
  type: z.literal("Point"),
  coordinates: PuntoCoord,
  radius: z.number(),
});

/**
 * 🗺️
 *
 * Representa una línea geográfica (secuencia de puntos conectados)
 *
 * - coordinates: [number, number][];
 *
 * --- coordinates[n][0] = longitud del punto n
 *
 * --- coordinates[n][1] = latitud del punto n
 *
 */
export const GeoJSONLineStringSchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(PuntoCoord),
});

/**
 * 🗺️
 *
 * Representa un polígono geográfico (área cerrada definida por anillo exterior)
 *
 * - coordinates: [[number, number][]];
 *
 * --- coordinates[0] = anillo exterior (array de puntos)
 *
 * --- coordinates[0][n][0] = longitud del punto n del anillo
 *
 * --- coordinates[0][n][1] = latitud del punto n del anillo
 *
 */
export const GeoJSONPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.tuple([z.array(PuntoCoord)]),
});

/**
 * 🗺️
 *
 * Representa múltiples polígonos geográficos (colección de polígonos)
 *
 * - coordinates: number[][][][];
 *
 * --- coordinates[ i ] = polígono i (array de anillos)
 *
 * --- coordinates[ i ][ j ] = anillo j del polígono i (array de puntos)
 *
 * --- coordinates[ i ][ j ][ k ][ 0 ] = longitud del punto k del anillo j del polígono i
 *
 * --- coordinates[ i ][ j ][ k ][ 1 ] = latitud del punto k del anillo j del polígono i
 *
 */
export const GeoJSONMultiPolygonSchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(z.array(z.number())))),
});

// Point y Circle comparten type: "Point" → no puede ser discriminatedUnion
export const GeoJSONSchema = z.union([
  GeoJSONPointSchema,
  GeoJSONCircleSchema,
  GeoJSONLineStringSchema,
  GeoJSONPolygonSchema,
  GeoJSONMultiPolygonSchema,
]);

// Tipos hand-written (NO z.infer): los consumidores compilan este fuente con
// strictNullChecks: false y la inferencia de Zod v4 se degrada sin strict
// (ej: [number, number] → [number?, number?, ...unknown[]]).
export interface IGeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}
export interface IGeoJSONCircle {
  type: 'Point';
  coordinates: [number, number];
  radius: number;
}
export interface IGeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][];
}
export interface IGeoJSONPolygon {
  type: 'Polygon';
  coordinates: [[number, number][]];
}
export interface IGeoJSONMultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}
export type IGeoJSON =
  | IGeoJSONPoint
  | IGeoJSONCircle
  | IGeoJSONLineString
  | IGeoJSONPolygon
  | IGeoJSONMultiPolygon;
