# gestion-modelos

La fuente de verdad del modelo de datos: **schemas Zod v4 + tipos TypeScript
inferidos**, consumidos por ~24 servicios TS y por `gestion-datos-go`.

Cada entidad exporta su schema (`ActivoSchema`, `CreateActivoSchema`,
`UpdateActivoSchema`) y los tipos con los nombres de siempre (`IActivo`,
`ICreateActivo`, `IUpdateActivo`).

## Para qué se usa, concretamente

Dos cosas, y conviene no confundirlas:

1. **Tipos para los consumidores TypeScript.** Es el uso principal y el que
   siempre existió.
2. **Metadata de persistencia para `gestion-datos-go`.** Las anotaciones
   `.meta({ 'x-bson': ... })` de cada campo se exportan a un JSON Schema que un
   módulo Go lee para armar la metadata del motor CRUD.

Lo que **no** hace: validar bodies en runtime. Ningún consumidor llama
`.parse()` sobre estos schemas hoy. El strict mode de `gestion-datos-go`
*descarta* claves desconocidas como hacía Mongoose; validar con las reglas de
zod las *rechazaría*, y eso es un cambio de contrato.

## Las anotaciones: qué son y por qué se escriben a mano

zod describe **el JSON de la API**. El motor de datos necesita saber cómo está
guardado en **Mongo**, y eso no está en los tipos:

```typescript
idCliente: z.string().meta({ 'x-bson': 'objectId' })
//         ^^^^^^^^^^ en el JSON                    ^^^^^^^^ en Mongo
```

Esa información vivía en los `@Prop()` del NestJS legacy y se transcribió campo
por campo. **Ninguna herramienta la deduce** — ni zod, ni un ODM, ni un
generador. Cambiar de herramienta cambia dónde la escribís, no que la escribas.

| Clave | Dónde | Qué declara |
|---|---|---|
| `x-collection` | schema | colección Mongo |
| `x-bson` | propiedad | `objectId` / `date` / `mixed` |
| `x-ref` | propiedad | `@Prop({ref})`: popula el path del id en su lugar |
| `x-populate` | propiedad | `schema.virtual()`: `{ref, localField, foreignField, justOne}` |
| `x-setter` | propiedad | `uppercase` / `lowercase` |
| `x-computed` | propiedad | está en el tipo TS pero no se persiste ni se popula |

## ⚠️ Hay que buildearlo para usarlo

`dist/` está gitignoreado: un checkout crudo no trae los `.js`/`.d.ts`, y
`main`/`types` apuntan ahí. Dos formas válidas de consumirlo, **ambas requieren
build**:

1. **`modelos/src`** (lo que hacen las APIs NestJS y Angular): se importa el
   `.ts` y lo compila el `tsc` del consumidor.
2. **`modelos`** (entrypoint `dist`): lo genera el hook `prepare` → `tsc` en el
   `npm install` / `npm ci` del consumidor.

**Si `tsc` falla acá, falla el `npm install` de todos los consumidores.** Nunca
mergear a `main` sin `npm run build` verde acá y el build de al menos un
consumidor NestJS y uno Angular.

## Instalación (consumidores)

```json
"modelos": "github:GPE-Sistemas/gestion-modelos#main"
```

```bash
npm run modelos                    # instala desde #main
npm run modelos feat/mi-branch     # desde un branch puntual
```

```typescript
import { ICoordenadas, IActivo } from 'modelos/src';
```

Los consumidores quedan clavados a un commit fijo en su `package-lock.json` y
usan `npm ci`: **mergear a `main` no cambia prod por sí solo**. El cambio llega
cuando cada consumidor refresca su lock y rebuildea.

## Agregar o cambiar un campo

Los cuatro pasos son obligatorios y **ninguno es automático**. Saltearse el
paso 2 ya rompió un filtro en producción (`idsClientesQueVen`, agosto 2026:
`GET /eventos-genericos?idsClientesQueVen=<hex>` devolvía `200` con lista vacía,
sin error ni log).

1. **Anotá el schema** con la clave que corresponda (tabla de arriba).
2. **Regenerá el bundle y commitealo:**
   ```bash
   npm run build && npm run gen:json-schema && npm run gen:bundle-go
   ```
   `go/esquema/bundle.json` es una **copia commiteada** de
   `dist/json-schema/index.json`, porque `dist/` está gitignoreado y `go:embed`
   solo ve archivos del árbol. Sin este paso el módulo sirve el schema viejo.
3. **Tageá el módulo**: `go/vX.Y.Z` — con el prefijo, porque vive en un
   subdirectorio. Mismo número que el `package.json`.
4. **Bumpeá `gestion-datos-go`**: `go.mod` a esa versión y `make sync-campos`
   allá.

## El módulo Go

`go/` es un módulo aparte (`github.com/GPE-Sistemas/gestion-modelos/go/v2`).
`go/esquema` expone la metadata derivada de las anotaciones: `Collection`,
`Fields`, `FieldTypes`, `ArrayFields`, `SubSchemas`, `Virtuals`.

Único consumidor hoy: `gestion-datos-go`.

**No genera structs, y es a propósito**: los motores que lo consumen trabajan con
documentos dinámicos (`map[string]any` / `bson.M`). Hubo un generador de structs
que producía 18,7 MB que nadie importaba ni podía importar; se borró.

**Versionado: npm y Go llevan el mismo número.** El tag lleva prefijo
(`go/v2.2.0`, nunca `v2.2.0`) y el module path lleva el sufijo del major
(`go/v2`, no `go`) — las dos son reglas de Go, no elecciones.

## JSON Schema

```bash
npm run build
npm run gen:json-schema      # dist/json-schema/index.json
```

Usa `z.toJSONSchema(registry)` nativo de Zod v4, en **una sola llamada** sobre un
registry: cada schema aparece una vez en `$defs` y el resto lo referencia con
`$ref`. Llamarlo una vez por schema inlinea el grafo completo — así pesaba
12,8 MB con `ClienteSchema` duplicado 181 veces; hoy pesa 0,99 MB.

El script valida sus invariantes y **falla** si un schema registrado no llegó al
bundle o si queda un `$ref` colgante. **Ese `process.exit(1)` es la única red que
hay: este repo no tiene tests.**

## Convenciones (Zod v4)

- `z.object` / `z.discriminatedUnion` / `z.enum`. **No** usar `z.nativeEnum` ni
  los deprecados `.passthrough()` / `.strict()` / `.strip()`.
- Modo **strip por defecto** (interop con el strict mode de Mongoose). Si un
  endpoint necesita conservar extras, `Schema.loose()` **local**.
- ids y fechas son `z.string()` plano (ISO string). No "mejorarlos" a `z.date()`:
  son strings en la DB y en el JSON de todas las APIs.
- `Create` = `XSchema.omit({...})`; `Update` ídem; `Cache` = omit de populates.
- **Renombrar o borrar un campo rompe a todo el que lo lea**, y los datos viejos
  siguen con el nombre anterior. Agregar opcional es seguro; renombrar no.
- **Ciclos de import** (populates mutuos): el campo va como *getter*:

  ```typescript
  get tracker() {
    return TrackerSchema.optional();
  },
  ```

  **Nunca spreadear un objeto con getters** (`{...Base}`): los evalúa eager y
  rompe el ciclo en runtime — el build pasa y explota en producción.
- Los `z.custom<T>()` **no son un error a arreglar**: son cortes de ciclo. Un
  schema real ahí revienta el emisor de declaraciones (TS7056) acá y en los
  consumidores. Si necesitás que algo sepa a dónde apunta, **anotalo**, no
  cambies el tipo.

Ver `CLAUDE.md` para el detalle de cada trampa y el daño concreto de tocarla.
