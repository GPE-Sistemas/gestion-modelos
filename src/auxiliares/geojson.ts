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

/**
 * [longitud, latitud]
 *
 * El output de `z.tuple` en Zod v4 se infiere como `[number?, number?, ...unknown[]]`
 * (sobre todo en consumidores con `strictNullChecks: false`), lo que rompe la
 * asignación a `[number, number]`. Forzamos el tipo de salida con un cast: el
 * runtime sigue validando la tupla, pero el tipo público es estable.
 */
export const PuntoCoord = z.tuple([
  z.number(),
  z.number(),
]) as unknown as z.ZodType<[number, number]>;

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
export const GeoJSONPointSchema: z.ZodType<IGeoJSONPoint> = z.object({
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
export const GeoJSONCircleSchema: z.ZodType<IGeoJSONCircle> = z.object({
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
export const GeoJSONLineStringSchema: z.ZodType<IGeoJSONLineString> = z.object({
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
export const GeoJSONPolygonSchema: z.ZodType<IGeoJSONPolygon> = z.object({
  type: z.literal("Polygon"),
  coordinates: z.tuple([z.array(PuntoCoord)]) as unknown as z.ZodType<
    [[number, number][]]
  >,
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
export const GeoJSONMultiPolygonSchema: z.ZodType<IGeoJSONMultiPolygon> = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(z.array(z.number())))),
});

// Point y Circle comparten type: "Point" → no puede ser discriminatedUnion
export const GeoJSONSchema: z.ZodType<IGeoJSON> = z.union([
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
