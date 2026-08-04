// Generador JSON Schema desde schemas Zod.
//
// Registra todos los *Schema exportados por dist/index.js en un registry de
// Zod v4 y hace UNA sola llamada a z.toJSONSchema sobre el registry. Escribe:
//   - dist/json-schema/index.json   (bundle único con $defs + $ref compartidos)
//
// POR QUÉ UN REGISTRY Y UNA SOLA LLAMADA (cambio 2026-08-04): antes se llamaba
// z.toJSONSchema una vez POR SCHEMA, y cada llamada inlinea su grafo completo.
// Resultado: ClienteSchema aparecía inlineado 181 veces y el bundle pesaba
// 3,84 MB. Con el registry cada schema se emite una vez en $defs y el resto lo
// referencia con $ref: 0,52 MB, 7,4x menos. Esto NO toca src/ — los schemas y
// los tipos TS inferidos quedan exactamente igual.
//
// Zod es el single source of truth: los tipos TS se infieren de los schemas y
// este bundle es la forma neutra que consumen los generadores de otros
// lenguajes (roadmap en gestion-datos-go, spec 2026-08-04).
//
// Se dejaron de emitir los dist/json-schema/<name>.json por archivo: no los
// leía nadie, y con $defs compartidos quedarían con $ref colgantes.
//
// Pre-requisito: dist/ ya compilado (npm run build).
//
// Se quitó el flag --only: tenía sentido cuando cada schema se emitía
// autocontenido, pero un subconjunto de un bundle con $ref compartidos no es
// un artefacto válido (los referenciados que quedan afuera caen en el bucket
// `__shared` de Zod y los refs no resuelven). Para inspeccionar uno solo,
// generar el bundle completo y buscar su clave en $defs.
//
// Uso:
//   npm run gen:json-schema
//   npm run gen:json-schema -- --verbose
//   npm run gen:json-schema -- --skip=EventoGenerico   # excluye sin fallar

import { z } from "zod";
import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import * as Modelos from "../dist/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const OUT_DIR = join(REPO_ROOT, "dist", "json-schema");

// Schemas excluidos del bundle de forma permanente (ej: ciclos de populate
// que z.toJSONSchema no puede resolver). Documentar el motivo al agregar.
const SKIP_SCHEMAS = [];

function parseArgs(argv) {
  const skip = [...SKIP_SCHEMAS];
  let verbose = false;
  for (const arg of argv.slice(2)) {
    if (arg === "--verbose" || arg === "-v") verbose = true;
    else if (arg.startsWith("--skip=")) {
      skip.push(...arg.slice("--skip=".length).split(",").filter(Boolean));
    } else {
      console.error(`ERROR: flag desconocido: ${arg}`);
      process.exit(1);
    }
  }
  return { skip, verbose };
}

function isZodSchema(value) {
  return !!value && typeof value === "object" && "_zod" in value;
}

const TO_JSON_SCHEMA_OPTS = {
  // unrepresentable: 'any' → los z.custom (los cortes de ciclo de populate,
  // que existen por TS7056 en la emisión de declarations de TS) salen como {}
  // en vez de hacer fallar la generación. Hoy son 93 de 5.324 propiedades.
  unrepresentable: "any",
  // Los $ref apuntan a $defs, que es donde reubicamos los schemas abajo.
  uri: (id) => `#/$defs/${id}`,
};

// diagnosticarFallo corre SOLO en el camino de error: la llamada única no dice
// cuál schema la rompió, así que se prueban de a uno para poder nombrarlos.
function diagnosticarFallo(entries) {
  const culpables = [];
  for (const [name, value] of entries) {
    try {
      z.toJSONSchema(value, TO_JSON_SCHEMA_OPTS);
    } catch (err) {
      culpables.push([name, err instanceof Error ? err.message : String(err)]);
    }
  }
  return culpables;
}

// refsColgantes verifica que todo $ref resuelva a una clave real de $defs. Un
// ref colgante rompe en silencio a cualquier consumidor del bundle.
function refsColgantes(defs) {
  const validos = new Set(Object.keys(defs));
  const rotos = new Set();
  const visitar = (node) => {
    if (Array.isArray(node)) return node.forEach(visitar);
    if (!node || typeof node !== "object") return;
    if (typeof node.$ref === "string") {
      const id = node.$ref.replace(/^#\/\$defs\//, "");
      if (!validos.has(id)) rotos.add(node.$ref);
    }
    for (const v of Object.values(node)) visitar(v);
  };
  visitar(defs);
  return [...rotos];
}

// contarVacios cuenta las propiedades emitidas como {} (los z.custom). No es
// error: es la métrica de cuánto pierde el bundle por los cortes de ciclo.
function contarVacios(defs) {
  let total = 0;
  let vacios = 0;
  const visitar = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.properties) {
      for (const v of Object.values(node.properties)) {
        total++;
        if (Object.keys(v).length === 0) vacios++;
        visitar(v);
      }
    }
    if (node.items) visitar(node.items);
    for (const k of ["allOf", "anyOf", "oneOf"]) {
      if (Array.isArray(node[k])) node[k].forEach(visitar);
    }
  };
  Object.values(defs).forEach(visitar);
  return { total, vacios };
}

function main() {
  const args = parseArgs(process.argv);

  const entries = Object.entries(Modelos)
    .filter(([name]) => name.endsWith("Schema"))
    .filter(([, value]) => isZodSchema(value))
    .filter(([name]) => !args.skip.some((needle) => name.includes(needle)));

  if (entries.length === 0) {
    console.error("ERROR: ningún schema quedó seleccionado");
    process.exit(1);
  }

  const registry = z.registry();
  for (const [name, value] of entries) {
    registry.add(value, { id: name });
    if (args.verbose) console.log(`  registrado ${name}`);
  }

  let emitido;
  try {
    emitido = z.toJSONSchema(registry, TO_JSON_SCHEMA_OPTS);
  } catch (err) {
    console.error(
      `ERROR: la generación falló: ${err instanceof Error ? err.message : err}`,
    );
    console.error("Probando schema por schema para identificar el culpable...");
    for (const [name, msg] of diagnosticarFallo(entries)) {
      console.error(`  ERR ${name}: ${msg}`);
    }
    console.error(
      "Agregarlos a SKIP_SCHEMAS (con el motivo) o arreglar el schema.",
    );
    process.exit(1);
  }

  const defs = emitido.schemas ?? emitido.$defs ?? {};

  // Invariantes. Este repo no tiene suite de tests ni CI, así que las
  // verificaciones viven acá y FALLAN la generación, ANTES de tocar el
  // directorio de salida (un fallo no debe dejarnos sin el bundle anterior).
  //
  // OJO: el bundle puede traer MÁS claves que schemas registrados. Zod hoistea
  // a `__shared` los sub-schemas que se repiten y no están registrados; con
  // --only aparecen también los referenciados que quedaron fuera. Por eso la
  // invariante correcta es "todos los registrados están", no una igualdad de
  // cardinales.
  const faltantes = entries.map(([n]) => n).filter((n) => !(n in defs));
  if (faltantes.length > 0) {
    console.error(
      `ERROR: ${faltantes.length} schemas registrados no llegaron al bundle:`,
    );
    for (const n of faltantes.slice(0, 20)) console.error(`  ${n}`);
    process.exit(1);
  }
  const rotos = refsColgantes(defs);
  if (rotos.length > 0) {
    console.error(`ERROR: ${rotos.length} $ref colgantes:`);
    for (const r of rotos.slice(0, 20)) console.error(`  ${r}`);
    process.exit(1);
  }

  const bundle = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "x-source": "gestion-modelos",
    "x-generator": "z.toJSONSchema(registry)",
    "x-generated-at": new Date().toISOString(),
    $defs: defs,
  };
  // Recién acá se toca el disco. Se limpia el directorio porque hasta
  // 2026-08-04 se emitía un <name>.json por schema, y esos archivos quedarían
  // para siempre confundiéndose con la salida vigente.
  if (existsSync(OUT_DIR)) {
    rmSync(OUT_DIR, { recursive: true });
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const bundlePath = join(OUT_DIR, "index.json");
  const payload = JSON.stringify(bundle, null, 2) + "\n";
  writeFileSync(bundlePath, payload, "utf-8");

  const { total, vacios } = contarVacios(defs);
  const refs = (JSON.stringify(defs).match(/"\$ref"/g) || []).length;

  console.log("");
  console.log(`Schemas:     ${Object.keys(defs).length}`);
  console.log(`$ref:        ${refs} (compartidos, ninguno colgante)`);
  console.log(
    `Propiedades: ${total}, de las cuales ${vacios} vacías {} por z.custom (${((100 * vacios) / total).toFixed(1)}%)`,
  );
  console.log(
    `Bundle:      ${bundlePath} (${(payload.length / 1024 / 1024).toFixed(2)} MB)`,
  );
}

main();
