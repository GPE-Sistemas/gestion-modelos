# Cómo agregar cosas a gestion-modelos

Guía práctica para el equipo. El `CLAUDE.md` de al lado explica las trampas del
repo y por qué existen; esto es el paso a paso.

---

## Antes que nada: acá se rompe el install de todos

`package.json` tiene `"prepare": "npm run build"` (que es `tsc`), y ese hook
corre en el `npm install` / `npm ci` de **cada consumidor**, porque el paquete
se consume como git-dependency y `dist/` está en `.gitignore`.

**Si `tsc` falla acá, ningún servicio puede instalar dependencias ni buildear
su imagen.** Son 14 repos locales más ~10 servicios deployados sin repo clonado
(`CONSUMIDORES.md`).

Lo que da aire: los consumidores están clavados a un commit fijo en su
`package-lock.json` y usan `npm ci`. Mergear a `main` no cambia prod por sí
solo; el daño llega cuando alguien refresca su lock.

---

## 1. Agregar un campo a una entidad

En este repo: el schema zod en `src/interfaces/<entidad>.ts`.

**Y ACÁ NO TERMINA.** `gestion-datos-go` **no consume este paquete** — hubo un
pipeline que generaba structs Go y se borró porque generaba 18,7 MB
inutilizables. Los metadatos de cada entidad están escritos a mano allá.

**Un campo que agregás acá y no agregás en `gestion-datos-go` se descarta en
silencio**: el strict mode del motor tira los campos desconocidos del body sin
error, así que el write devuelve 200 y el campo nunca llega a Mongo.

Pasó de verdad, varias veces. El 2026-08-04 el chequeo automático encontró
**12 campos** en esa situación, entre ellos `trackingActivo` de trackers y las
métricas de gateways.

**El paso obligatorio, entonces:**

```bash
# en gestion-datos-go, con este repo al lado
make sync-campos     # refresca el inventario de campos de zod
make test            # falla y te dice exactamente qué campo falta en qué meta
```

El test se llama `TestNingunCampoDeZodSeDescartaEnSilencio`. Si pasa, el campo
va a llegar a Mongo; si falla, te dice qué agregar y dónde.

Después abrís **los dos PRs**, y se mergean juntos.

---

## 2. Convenciones de los schemas

Están en el `README.md` §Convenciones, pero las que más se olvidan:

- `z.object` / `z.discriminatedUnion` / `z.enum`. **No** `z.nativeEnum` ni los
  deprecados `.passthrough()` / `.strict()` / `.strip()`.
- **ids y fechas son `z.string()` plano** (fechas en ISO string). No
  "mejorarlos" a `z.date()`: son strings en la base y en el JSON de todas las
  APIs.
- `Create` = `XSchema.omit({...})`; `Update` ídem.
- Tipos por `z.infer<typeof XSchema>`, sin casts manuales.

---

## 3. Ciclos de populate: NO los "arregles"

Si ves esto y te dan ganas de reemplazarlo por `TrackerSchema.optional()`:

```typescript
tracker: z.custom<ITracker>().optional(),
```

**No.** Son cortes de ciclo por **TS7056**: un schema real ahí arrastra el
grafo completo y revienta la emisión de declarations, acá y en cada consumidor
NestJS. Hay 116 y ninguno es un descuido.

La alternativa válida para ciclos es el getter:

```typescript
get tracker() {
  return TrackerSchema.optional();
},
```

Y su trampa: **nunca spreadear un objeto que contenga getters** (`{...Base}`)
— los evalúa eager y rompe el ciclo **en runtime**, no en compilación. El build
pasa y explota en producción.

---

## 4. Antes de mergear

```bash
npm run build            # tsc; si falla acá, rompés el install de todos
npm run gen:json-schema  # verifica sus propias invariantes y falla si algo se rompió
```

Y **el build de al menos un consumidor NestJS y uno Angular** (`README.md`
§Pasaje a producción tiene el procedimiento). No es opcional: es la única forma
de saber que no rompiste el install ajeno.

Más el `make sync-campos` + `make test` de `gestion-datos-go` (§1).

---

## 5. `scripts/gen-json-schema.mjs`

El bundle `dist/json-schema/index.json` es la forma neutra que consumen los
generadores de otros lenguajes. El script tiene decisiones que parecen raras y
no lo son — están explicadas en `CLAUDE.md` §4. Las dos que más importan:

- **una sola llamada a `z.toJSONSchema` sobre un registry**; llamarla por
  schema inflaba el bundle de 0,99 MB a 12,8 MB;
- **el `process.exit(1)` de sus invariantes es la única red que hay** — este
  repo no tiene suite de tests ni CI.

---

## 6. Dependencias

Agregar o actualizar paquetes npm requiere chequeo de supply-chain, y **nunca
una versión publicada hace menos de 7 días** (regla de la organización). Este
repo tiene **una sola** dependencia de runtime (`zod`) a propósito: pensalo dos
veces antes de sumar la segunda.
