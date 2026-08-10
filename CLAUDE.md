# CLAUDE.md — reglas para trabajar en gestion-modelos

Este repo es la fuente de verdad del modelo de datos de todo el sistema. Un
error acá no rompe un servicio: rompe **el `npm install` de todos**.

Leer el `README.md` para el uso normal. Este archivo es lo que **no** hay que
hacer, con el motivo y el daño concreto de cada cosa.

---

## 1. El radio de daño, para dimensionar

`package.json` tiene `"prepare": "npm run build"` (que es `tsc`). Ese hook corre
en el `npm install` / `npm ci` de **cada consumidor**, porque el paquete se
consume como git-dependency y `dist/` está en `.gitignore`.

**Si `tsc` falla acá, el `npm install` de todos los consumidores falla.** No es
un error de tipos en un servicio: es que ningún servicio puede instalar
dependencias, y ninguna imagen puede buildearse.

Consumidores conocidos: 14 repos locales listados en `CONSUMIDORES.md`, más
~10 servicios deployados sin repo clonado (también listados ahí). Angular
(`gestion-web-cliente`, `gestion-irix-web`) y NestJS mezclados.

**Regla dura: nunca mergear a `main` sin `npm run build` verde acá Y el build
de al menos un consumidor NestJS y uno Angular.** El README §"Pasaje a
producción" tiene el procedimiento.

Lo que sí da aire: los consumidores están clavados a un commit fijo en su
`package-lock.json` y usan `npm ci`. Mergear a `main` no cambia prod por sí
solo — el daño llega cuando alguien refresca su lock.

---

## 2. Los `z.custom` y los getters NO son un error a arreglar

Es la trampa número uno, y la que más veces estuvo por romper el repo. Un dev
o un agente bien intencionado ve esto en `src/interfaces/activo.ts`:

```typescript
tracker: z.custom<ITracker>().optional(),
```

...y piensa "esto debería ser `TrackerSchema.optional()`, lo arreglo".

**No.** El comentario del propio archivo dice por qué:

> Populates intra-SCC como `z.custom` (import type-only): un schema real acá
> arrastra el shape completo del ciclo y revienta la serialización de
> declarations (**TS7056**) acá y en los consumidores NestJS.

Los populates entre entidades forman ciclos (activo → tracker → activo). Un
schema real en esa posición hace explotar el emisor de declaraciones de
TypeScript, acá y en cada consumidor. Hay **92 `z.custom<T>()`** en el repo
(116 era el conteo de líneas que mencionan `z.custom`, comentarios incluidos) y
ninguno es un descuido.

**Medido el 2026-08-05** (spike de la etapa 1 del roadmap, sobre `activo.ts` y
`recorrido.ts`): con getters y schemas reales en esos 9 populates, `tsc` tira
TS7056 en **`asignacion.ts`, `certificado-entidad.ts`, `nota.ts` y
`recordatorio.ts`** — o sea **no en el archivo que tocás, sino en los que
EMBEBEN esa entidad** (son 14 los que embeben `ActivoSchema`/`RecorridoSchema`
por valor). Y la salida de emergencia no sirve: anotar
`export const XSchema: z.ZodType<IX>` achica el `.d.ts` pero **`z.ZodType` no
tiene `.omit()`**, que es lo que esos 4 archivos usan para sus `Create*` /
`Update*`.

Corolario práctico: **si necesitás que algo sepa a dónde apunta un populate, no
cambies el tipo — anotalo** (`.meta()`, §5).

La variante permitida para ciclos es el **getter**, y tiene su propia trampa:

```typescript
get tracker() {
  return TrackerSchema.optional();
},
```

**Nunca spreadear un objeto que contenga getters** (`{...Base}`): los evalúa
eager y rompe el ciclo en runtime, no en compilación. O sea que el build pasa y
explota en producción.

> Hay trabajo planificado para reducir los `z.custom` (ver §5), pero se hace de
> a poco y midiendo, no de un saque.

---

## 3. Un cambio de schema es un cambio de contrato

Estos schemas describen datos que ya están en Mongo y que consumen 24+
servicios. Antes de tocar un campo:

- **Renombrar o borrar un campo** rompe a todo el que lo lea, y los datos
  viejos siguen teniendo el nombre anterior. Agregar opcional es seguro;
  renombrar no lo es.
- **Los ids y las fechas son `z.string()` plano** a propósito (ISO string).
  No "mejorarlos" a `z.date()` ni a un branded type: son strings en la DB y en
  el JSON de todas las APIs.
- **Modo strip por defecto**: `z.object()` descarta claves desconocidas al
  parsear, para interoperar con el strict mode de Mongoose. No cambiar eso
  globalmente; si un endpoint necesita conservar extras, `Schema.loose()`
  **local**.
- No usar `z.nativeEnum` ni los deprecados `.passthrough()` / `.strict()` /
  `.strip()`.

---

## 4. `scripts/gen-json-schema.mjs`: qué no deshacer

El script emite `dist/json-schema/index.json`, el bundle neutro que consumen
los generadores de otros lenguajes. Se reescribió el 2026-08-04 y tiene
decisiones que parecen raras y no lo son:

- **Una sola llamada a `z.toJSONSchema` sobre un registry.** No volver a
  llamarla por schema dentro de un `for`: cada llamada inlinea el grafo
  completo. Así estaba antes, y el bundle pesaba **12,8 MB con `ClienteSchema`
  duplicado 181 veces**. Hoy pesa 0,99 MB.
- **No reponer el flag `--only`.** Un subconjunto de un bundle con `$ref`
  compartidos no resuelve: los schemas referenciados que quedan afuera caen en
  el bucket `__shared` de Zod y los refs quedan colgando. Para inspeccionar uno
  suelto, generar el bundle completo y buscar su clave en `$defs`.
- **No volver a emitir un `<name>.json` por schema.** Con `$defs` compartidos
  quedarían con refs colgantes, y no los leía nadie.
- **La invariante NO es igualdad de cardinales.** El bundle puede traer más
  claves que schemas registrados, porque Zod hoistea sub-schemas repetidos a
  `__shared`. La verificación correcta —la que está— es "todos los registrados
  están presentes".
- **Validar antes de escribir.** El script limpia el directorio de salida
  recién después de que pasan las invariantes, para que un fallo no deje al
  repo sin el bundle anterior.
- `unrepresentable: "any"` tiene que quedar: sin eso los `z.custom` de §2 hacen
  fallar la generación entera.

El script falla la generación si algo de esto se rompe. **Ese `process.exit(1)`
es la única red que hay: este repo no tiene suite de tests ni CI.** Si lo
volvés warning, no queda nada.

---

## 5. Hacia dónde va esto

El bundle JSON Schema dejó de ser solo un artefacto de TypeScript: es el puente
para que las APIs Go (y eventualmente Rust) consuman los mismos modelos. El
diseño está en `gestion-datos-go`, en
`docs/superpowers/specs/2026-08-04-aprovechar-go-roadmap-design.md`.

Lo que viene y conviene no contradecir:

- **El módulo Go ya existe: `go/`.** Module path
  `github.com/GPE-Sistemas/gestion-modelos/go/v2`, y `go/esquema` expone la
  metadata de persistencia derivada de las anotaciones `.meta()`
  (`Collection`, `Fields`, `FieldTypes`, `ArrayFields`, `SubSchemas`,
  `Virtuals`). La generación ocurre **acá**, una sola vez; los consumidores
  hacen `go get`. Si alguna vez ves un `generate.sh` que clona este repo
  dentro de una API, es la deuda que estamos pagando — no el patrón a copiar.

  Tres cosas del módulo que **no** hay que "completar" pensando que faltan:

  - **No hay `go/modelos` con structs, y es a propósito** (decidido el
    2026-08-07). Los motores que lo consumen trabajan con documentos dinámicos
    (`map[string]any` / `bson.M`): `gestion-datos-go` no tiene un solo struct
    de dominio. El único consumidor futuro de structs es
    `gestion-trackers-go`, y antes de migrarlo hay que **medir su drift**
    (nadie verificó nunca que sus tipos a mano coincidan con estos schemas).
    Generar structs hoy repetiría el `tools/genmodelos` borrado el 2026-08-04:
    18,7 MB que nadie importaba.
  - **No valida bodies, y es a propósito.** `gestion-datos-go` replica el
    strict mode de Mongoose, que **descarta** las claves desconocidas en
    silencio. Validar con las reglas de zod empezaría a **rechazar** bodies que
    el legacy aceptaba: es un cambio de contrato, no una mejora interna.
  - **`go/esquema/bundle.json` es una copia commiteada** de
    `dist/json-schema/index.json`, porque `dist/` está gitignored y `go:embed`
    solo incluye archivos del árbol. Si tocás un schema, regenerá con
    `npm run gen:bundle-go` — el workflow `bundle-go` lo verifica y falla si
    queda diff. Ese script **saca el `x-generated-at`** al copiar: es el único
    campo no determinista del bundle, y sin sacarlo el chequeo de
    sincronización daría rojo en todos los PR.

  **Versionado: npm y Go llevan el MISMO número**, no dos historias
  independientes — son los mismos modelos, así que la versión tiene que
  contar la misma historia (decidido el 2026-08-10). Dos reglas de Go son el
  costo de esa decisión, y no hay que confundirlas:

  - El tag lleva el **prefijo obligatorio** porque el módulo vive en un
    subdirectorio: `2.2.0` se tagea `go/v2.2.0`, nunca `v2.2.0` a secas —
    Go solo reconoce tags con ese prefijo para un módulo en subdirectorio.
  - El **module path lleva el sufijo del major** (`go/v2`, no `go`) porque
    Go exige eso para cualquier major ≥ 2: sin el sufijo, Go ignora un tag
    `go/v2.x.y`. Si esto sube a 3.x, el path pasa a `go/v3` y hay que tocar
    el import en cada consumidor (`gestion-datos-go` incluido) — no es
    automático.

  Un release que solo cambia `src/` sin tocar `go/esquema` igual sube el
  número de Go (y viceversa): lo que se sincroniza es el número, no el
  contenido de cada lado.
- Los schemas ganan metadata de persistencia vía `.meta()`. Es **aditiva**: los
  consumidores TS ignoran las claves desconocidas y los tipos inferidos no
  cambian. **Ya está aplicada en `proveedor.ts`, `recorrido.ts` y `activo.ts`**
  (spike de la etapa 1, 2026-08-05); la convención está documentada arriba de
  `ProveedorSchema` y es la que hay que copiar al anotar el resto:

  | Clave | Dónde | Qué declara |
  |---|---|---|
  | `x-collection` | schema | colección Mongo |
  | `x-bson` | propiedad | `objectId` / `date` / `mixed` |
  | `x-ref` | propiedad | `@Prop({ref})`: populate del path del id en su lugar |
  | `x-populate` | propiedad | `schema.virtual()`: `{ref, localField, foreignField, justOne}` |
  | `x-setter` | propiedad | `uppercase` / `lowercase` |
  | `x-computed` | propiedad | existe en el tipo TS pero NO es un path persistido ni un populate: getter del `toJSON`, discriminante de una unión, o shape heredado del legacy sin `@Prop` ni `schema.virtual()`. Ejemplos: `Luminaria.perfilEfectivo` (getter), `Luminaria.tipoDispositivo` (discriminante del union), `LogEvento.dispositivoLorawan` (prop del tipo TS que el legacy nunca persistió ni populó — el populate real es `dispositivo`) |

  **`x-bson: 'mixed'` no es opcional donde corresponde.** Un
  `@Prop({type: Object})` del legacy es Mixed y **Mongoose no castea adentro**;
  si el emisor desciende igual, inventa casteos que divergen. Sin esa clave, el
  spike generaba 28 casteos falsos en 3 entidades.
- Reducir los `{}` que dejan los `z.custom` (322 de 9.299, 3,5 %) es trabajo en
  curso, de a poco y midiendo. No es una limpieza para hacer de un saque — y
  **el camino no es reemplazarlos** (§2): es anotarlos.
- `scripts/spike-emisor-meta-go.mjs` es el emisor del spike: lee el bundle y
  arma el `meta.go` de una entidad para diffearlo contra el real. Es
  desechable, no es el generador de la etapa 2 (ese vive en `go/`).

**El límite del repo, para que no se vuelva un depósito**: acá va la forma del
dato y su persistencia, no el comportamiento de cada API. **Si dos APIs pueden
discrepar legítimamente sobre algo, ese algo no va acá.** Que `idCliente` sea
ObjectId es cierto para todas y va; que un endpoint devuelva `null` en vez de
404 es decisión de ese servicio.

---

## 6. Higiene

- **No editar `dist/`**: es generado y está gitignored. Si no existe,
  `npm run build`.
- **Agregar o actualizar dependencias npm** requiere chequeo de
  supply-chain, y **nunca usar una versión publicada hace menos de 7 días**
  (regla de la organización). Este repo tiene una sola dependencia de runtime
  (`zod`) a propósito: pensarlo dos veces antes de sumar la segunda.
- Al empezar una sesión de trabajo, partir de `main` actualizado (`git pull`),
  cuidando de no pisar trabajo en curso.
- Los schemas viven en `src/interfaces/` (83 archivos), uno por entidad, más
  `src/auxiliares/` y `src/externos/`.
