// SPIKE de la etapa 1 del roadmap (gestion-datos-go,
// docs/superpowers/specs/2026-08-04-aprovechar-go-roadmap-design.md §4).
//
// Emisor Go MÍNIMO: lee el bundle JSON Schema y arma, para las entidades
// anotadas con la metadata de persistencia (`x-collection`, `x-bson`, `x-ref`,
// `x-populate`, `x-setter`), el fragmento de `meta.go` que hoy está escrito a
// mano en gestion-datos-go. Después DIFFEA su salida contra la metadata real.
//
// El diff es el punto: mide qué porción del meta.go sale generada de verdad y
// deja a la vista lo que el bundle todavía no sabe. No es un generador para
// producción — eso es la etapa 2, y vive en `go/` de este repo.
//
// Uso:
//   node scripts/spike-emisor-meta-go.mjs <metas.json> [Entidad...]
//
// <metas.json> lo produce `go run ./cmd/tmpaudit` en gestion-datos-go.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLE = join(__dirname, "..", "dist", "json-schema", "index.json");

const [rutaMetas, ...entidadesPedidas] = process.argv.slice(2);
if (!rutaMetas) {
  console.error("uso: node scripts/spike-emisor-meta-go.mjs <metas.json> [Entidad...]");
  process.exit(1);
}

const defs = JSON.parse(readFileSync(BUNDLE, "utf8")).$defs;
const metasReales = JSON.parse(readFileSync(rutaMetas, "utf8"));

const nombreRef = (ref) => ref?.replace(/^#\/\$defs\//, "");
const schemaDe = (nodo) => (nodo?.$ref ? defs[nombreRef(nodo.$ref)] : null);
// Un $ref a un schema con x-collection es OTRA entidad (populate); sin
// x-collection es un subdocumento y hay que descender con dot-path.
const esEntidad = (nodo) => !!schemaDe(nodo)?.["x-collection"];

// desenvuelve arrays: devuelve {nodo, esArray}
function desenvolver(prop) {
  if (prop?.type === "array" && prop.items) return { nodo: prop.items, esArray: true };
  return { nodo: prop, esArray: false };
}

function tipoGo(prop, esArray) {
  const bson = prop["x-bson"];
  const setter = prop["x-setter"];
  if (setter === "uppercase") return "TypeUppercase";
  if (setter === "lowercase") return "TypeLowercase";
  if (bson === "mixed") return null; // Mixed no se castea
  if (bson === "objectId") return esArray ? "TypeObjectIDArray" : "TypeObjectID";
  if (bson === "date") return "TypeDate";
  const { nodo } = desenvolver(prop);
  const t = nodo?.type ?? schemaDe(nodo)?.type;
  if (t === "number" || t === "integer") return "TypeNumber";
  if (t === "boolean") return "TypeBool";
  return null;
}

function emitir(nombreSchema) {
  const sch = defs[nombreSchema];
  if (!sch) return null;
  const coleccion = sch["x-collection"];
  const props = sch.properties ?? {};

  const fields = [];
  const fieldTypes = {};
  const arrayFields = [];
  const virtuals = {};

  // Recorre el árbol registrando casteos y los populates de los SUBDOCUMENTOS
  // con su dot-path ("vehiculo.chofer"), que es como los declara el meta.go.
  const registrarTipos = (prefijo, propiedades) => {
    for (const [nombre, prop] of Object.entries(propiedades)) {
      const path = prefijo ? `${prefijo}.${nombre}` : nombre;
      if (prop["x-computed"]) continue; // getter del toJSON, no es un campo
      const { nodo, esArray } = desenvolver(prop);

      const pop = prop["x-populate"];
      if (pop) {
        if (prefijo) {
          const destino = defs[pop.ref];
          virtuals[path] = {
            ref: destino?.["x-collection"] ?? `?? (${pop.ref} sin x-collection)`,
            localField: `${prefijo}.${pop.localField}`,
            foreignField: pop.foreignField ?? "_id",
            justOne: !!pop.justOne,
          };
        }
        continue; // un virtual no lleva casteo
      }

      const t = tipoGo(prop, esArray);
      if (t) fieldTypes[path] = t;
      // Mixed (@Prop({type: Object})): Mongoose NO castea adentro, así que
      // declarar los paths de abajo DIVERGE del legacy. No descender.
      if (prop["x-bson"] === "mixed") continue;
      // subdocumento: descender con dot-path. Otra entidad: no.
      if (nodo?.$ref && !esEntidad(nodo)) {
        const sub = schemaDe(nodo);
        if (sub?.properties && sub.type === "object") registrarTipos(path, sub.properties);
      }
    }
  };

  for (const [nombre, prop] of Object.entries(props)) {
    if (nombre === "_id") continue;
    if (prop["x-computed"]) continue; // getter computado del toJSON legacy
    const { nodo, esArray } = desenvolver(prop);

    const pop = prop["x-populate"];
    if (pop) {
      const destino = defs[pop.ref];
      virtuals[nombre] = {
        ref: destino?.["x-collection"] ?? `?? (${pop.ref} sin x-collection)`,
        localField: pop.localField,
        foreignField: pop.foreignField ?? "_id",
        justOne: !!pop.justOne,
      };
      continue; // un virtual no va en Fields ni en ArrayFields
    }

    fields.push(nombre);
    if (esArray) arrayFields.push(nombre);

    // @Prop({ref}): Mongoose popula el path del id EN SU LUGAR
    const ref = prop["x-ref"];
    if (ref) {
      const destino = defs[ref];
      virtuals[nombre] = {
        ref: destino?.["x-collection"] ?? `?? (${ref} sin x-collection)`,
        localField: nombre,
        foreignField: "_id",
        justOne: !esArray,
      };
    }
  }

  registrarTipos("", props);

  return { collection: coleccion, fields, fieldTypes, arrayFields, virtuals };
}

// ---------- salida Go ----------

function comoGo(nombreSchema, m) {
  const q = (s) => `"${s}"`;
  const l = [];
  l.push(`// generado por scripts/spike-emisor-meta-go.mjs desde ${nombreSchema}`);
  l.push(`Collection: ${q(m.collection ?? "??")},`);
  l.push(`Fields: []string{`);
  l.push(`\t${m.fields.map(q).join(", ")},`);
  l.push(`},`);
  l.push(`FieldTypes: query.FieldTypes{`);
  for (const [p, t] of Object.entries(m.fieldTypes).sort()) {
    l.push(`\t${q(p)}: query.${t},`);
  }
  l.push(`},`);
  l.push(`ArrayFields: []string{${m.arrayFields.map(q).join(", ")}},`);
  l.push(`Virtuals: map[string]query.VirtualDef{`);
  for (const [n, v] of Object.entries(m.virtuals).sort()) {
    l.push(
      `\t${q(n)}: {Ref: ${q(v.ref)}, LocalField: ${q(v.localField)}, ForeignField: ${q(v.foreignField)}, JustOne: ${v.justOne}},`,
    );
  }
  l.push(`},`);
  return l.join("\n");
}

// ---------- diff ----------

function diffSet(nombre, generado, real) {
  const g = new Set(generado), r = new Set(real);
  const falta = [...r].filter((x) => !g.has(x));
  const sobra = [...g].filter((x) => !r.has(x));
  return { nombre, falta, sobra, iguales: [...r].filter((x) => g.has(x)).length, total: r.size };
}

function diffMapa(nombre, generado, real, comparar) {
  const falta = [], sobra = [], distinto = [];
  for (const k of Object.keys(real)) {
    if (!(k in generado)) falta.push(k);
    else if (!comparar(generado[k], real[k])) distinto.push(`${k}: generado=${JSON.stringify(generado[k])} real=${JSON.stringify(real[k])}`);
  }
  for (const k of Object.keys(generado)) if (!(k in real)) sobra.push(k);
  const iguales = Object.keys(real).length - falta.length - distinto.length;
  return { nombre, falta, sobra, distinto, iguales, total: Object.keys(real).length };
}

function reportar(r) {
  const linea = `  ${r.nombre}: ${r.iguales}/${r.total} exactos`;
  const extras = [];
  if (r.falta?.length) extras.push(`falta ${r.falta.length}: ${r.falta.join(", ")}`);
  if (r.sobra?.length) extras.push(`sobra ${r.sobra.length}: ${r.sobra.join(", ")}`);
  console.log(extras.length ? `${linea} — ${extras.join(" | ")}` : linea);
  for (const d of r.distinto ?? []) console.log(`      DISTINTO ${d}`);
}

const objetivo = entidadesPedidas.length
  ? entidadesPedidas
  : Object.keys(defs).filter((n) => defs[n]["x-collection"] && metasReales[n.replace(/Schema$/, "")]);

let totales = { iguales: 0, total: 0 };
for (const nombreSchema of objetivo.map((n) => (n.endsWith("Schema") ? n : `${n}Schema`))) {
  const modelo = nombreSchema.replace(/Schema$/, "");
  const real = metasReales[modelo];
  const gen = emitir(nombreSchema);
  if (!gen) { console.log(`\n### ${modelo}: no está en el bundle`); continue; }
  if (!real) { console.log(`\n### ${modelo}: no hay meta.go`); continue; }

  console.log(`\n### ${modelo} (colección real ${real.collection})`);
  console.log(comoGo(nombreSchema, gen).split("\n").map((l) => `  ${l}`).join("\n"));
  console.log(`\n  --- diff contra el meta.go real ---`);
  const rs = [
    diffSet("Fields", gen.fields, real.fields),
    diffSet("ArrayFields", gen.arrayFields, real.arrayFields),
    diffMapa("FieldTypes", gen.fieldTypes, mapTipos(real.fieldTypes), (a, b) => a === b),
    diffMapa("Virtuals", gen.virtuals, real.virtuals, (a, b) =>
      a.ref === b.ref && a.localField === b.localField && a.foreignField === b.foreignField && a.justOne === b.justOne),
  ];
  rs.forEach(reportar);
  if (real.requiredFields?.length) {
    console.log(`  RequiredFields: 0/${real.requiredFields.length} — zod tiene todo .optional(), no sale del bundle`);
  }
  for (const r of rs) { totales.iguales += r.iguales; totales.total += r.total; }
  totales.total += real.requiredFields?.length ?? 0;
}

console.log(`\n=== TOTAL entradas generadas exactas: ${totales.iguales}/${totales.total} ===`);

// los tipos del meta.go vienen como "objectId"/"date"/...; el emisor habla en
// nombres de constante Go
function mapTipos(ft) {
  const m = {
    objectId: "TypeObjectID",
    objectIdArray: "TypeObjectIDArray",
    date: "TypeDate",
    number: "TypeNumber",
    bool: "TypeBool",
    uppercase: "TypeUppercase",
    lowercase: "TypeLowercase",
  };
  return Object.fromEntries(Object.entries(ft).map(([k, v]) => [k, m[v] ?? v]));
}
