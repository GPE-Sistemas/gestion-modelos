// // Comparador profundo de configs (deseada vs real).
// // Reglas:
// // - Recorre SOLO las keys presentes en `esperado` (es un subset, no full).
// // - `undefined` o `null` en esperado no generan diff.
// // - Arrays se comparan por contenido (mismo length + mismo orden).
// // - Floats con tolerancia configurable (default 1e-6 — precisión de coordenadas).
// // - Devuelve lista de diffs con dot-path para mapear a downlinks.

// export interface DiffEntry {
//   path: string;
//   esperado: unknown;
//   real: unknown;
// }

// export interface DiffOpts {
//   ignorarUndefined?: boolean; // default true
//   rutaBase?: string;
//   toleranciaFloat?: number; // default 1e-6
// }

// function esObjetoPlano(v: unknown): v is Record<string, unknown> {
//   return (
//     typeof v === 'object' &&
//     v !== null &&
//     !Array.isArray(v) &&
//     !(v instanceof Date)
//   );
// }

// function igualesConTolerancia(a: number, b: number, tol: number): boolean {
//   return Math.abs(a - b) <= tol;
// }

// function diffArrays(
//   esperado: unknown[],
//   real: unknown,
//   ruta: string,
//   opts: Required<DiffOpts>,
// ): DiffEntry[] {
//   if (!Array.isArray(real)) {
//     return [{ path: ruta, esperado, real }];
//   }
//   if (esperado.length !== real.length) {
//     return [{ path: ruta, esperado, real }];
//   }
//   const out: DiffEntry[] = [];
//   for (let i = 0; i < esperado.length; i++) {
//     const sub = diffConfigs(esperado[i], real[i], {
//       ...opts,
//       rutaBase: `${ruta}[${i}]`,
//     });
//     out.push(...sub);
//   }
//   return out;
// }

// export function diffConfigs(
//   esperado: unknown,
//   real: unknown,
//   opts: DiffOpts = {},
// ): DiffEntry[] {
//   const o: Required<DiffOpts> = {
//     ignorarUndefined: opts.ignorarUndefined ?? true,
//     rutaBase: opts.rutaBase ?? '',
//     toleranciaFloat: opts.toleranciaFloat ?? 1e-6,
//   };

//   if (esperado === undefined || esperado === null) {
//     if (o.ignorarUndefined) return [];
//     if (esperado === real) return [];
//     return [{ path: o.rutaBase, esperado, real }];
//   }

//   if (Array.isArray(esperado)) {
//     return diffArrays(esperado, real, o.rutaBase, o);
//   }

//   if (esObjetoPlano(esperado)) {
//     if (!esObjetoPlano(real)) {
//       return [{ path: o.rutaBase, esperado, real }];
//     }
//     const out: DiffEntry[] = [];
//     for (const k of Object.keys(esperado)) {
//       const subRuta = o.rutaBase ? `${o.rutaBase}.${k}` : k;
//       const sub = diffConfigs(
//         esperado[k],
//         (real as Record<string, unknown>)[k],
//         {
//           ...o,
//           rutaBase: subRuta,
//         },
//       );
//       out.push(...sub);
//     }
//     return out;
//   }

//   // Primitivos
//   if (typeof esperado === 'number' && typeof real === 'number') {
//     if (igualesConTolerancia(esperado, real, o.toleranciaFloat)) return [];
//     return [{ path: o.rutaBase, esperado, real }];
//   }
//   if (esperado === real) return [];
//   return [{ path: o.rutaBase, esperado, real }];
// }

// export function tieneDiferencias(
//   esperado: unknown,
//   real: unknown,
//   opts?: DiffOpts,
// ): boolean {
//   return diffConfigs(esperado, real, opts).length > 0;
// }
