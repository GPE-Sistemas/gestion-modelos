# gestion-modelos

Modelos para el sistema de gestión: **schemas Zod v4 + tipos TypeScript inferidos**.

Cada entidad exporta su schema runtime (`ActivoSchema`, `CreateActivoSchema`, `UpdateActivoSchema`) y los tipos derivados con los mismos nombres de siempre (`IActivo`, `ICreateActivo`, `IUpdateActivo`). Los imports existentes de tipos no cambian.

## ⚠️ Hay que buildearlo para usarlo

Este paquete **NO se publica compilado**: `dist/` está en `.gitignore`, así que un
checkout crudo del repo no trae los `.js`/`.d.ts`. El `main`/`types` del
`package.json` apuntan a `dist/index.js` / `dist/index.d.ts`, que **solo existen
después de compilar** (`npm run build` → `tsc`).

Hay dos formas válidas de consumirlo, y **ambas requieren build**:

1. **Import desde `modelos/src`** (lo que hacen las APIs NestJS / Angular): se
   importa el fuente `.ts` y lo compila el **tsc del consumidor**. No necesita el
   `dist` de este paquete, pero el consumidor debe compilar (build del servicio).
2. **Import desde `modelos`** (entrypoint `dist`): requiere que `dist/` exista. Se
   genera automáticamente por el hook **`prepare` → `tsc`** que corre en el
   `npm install` / `npm ci` del consumidor (por eso el Dockerfile hace `npm ci` y
   funciona). Si ese build fallara, **rompe el install del consumidor**.

> Consecuencia operativa: cualquier cambio en modelos hay que verificarlo con
> `npm run build` acá **y** con el build del consumidor antes de mergear. Si
> alguna vez se consume este repo fuera de `npm install` (checkout directo),
> correr `npm run build` primero.

## Instalación (consumidores)

En `package.json` del servicio, como git-dependency apuntando a un branch:

```json
"modelos": "github:GPE-Sistemas/gestion-modelos#main"
```

En este monorepo los servicios traen un script `modelos` (`sh modelo.sh <branch>`)
para (re)apuntar y refrescar el lockfile:

```bash
npm run modelos              # instala desde #main (default)
npm run modelos feat/migracion-zod-v4   # instala desde un branch puntual
```

El import clásico de tipos sigue funcionando sin cambios:

```typescript
import { ICoordenadas, IActivo } from 'modelos/src';
```

## Uso de los schemas

```typescript
import { CreateActivoSchema, TipoVehiculoSchema } from 'modelos/src';

// Validación runtime de un body
const resultado = CreateActivoSchema.safeParse(body);
if (!resultado.success) {
  // resultado.error.issues tiene el detalle campo por campo
}

// Valores de un enum en runtime (ej: opciones de un select)
TipoVehiculoSchema.options; // ['Auto', 'Camion', ...]
```

## Convenciones (Zod v4)

- API canónica: `z.object` / `z.discriminatedUnion` / `z.enum`. **No** usar `z.nativeEnum` ni los deprecados `.passthrough()` / `.strict()` / `.strip()`.
- Modo **strip por defecto**: `z.object()` descarta claves desconocidas al parsear (interop con Mongoose). Si un endpoint necesita conservar extras, usar `Schema.loose()` localmente.
- Tipos siempre por `z.infer<typeof XSchema>`, sin casts manuales (evita TS7056 en cadenas de populates profundas).
- ids y fechas son `z.string()` plano (fechas en ISO string, como siempre).
- `Create` = `XSchema.omit({...})` (la base ya es todo-opcional); `Update` ídem; `Cache` = omit de populates.
- Enums de dominio: `z.enum([...])` + `export type TipoX = z.infer<typeof TipoXSchema>` con el mismo nombre de tipo que antes.
- **Ciclos de import** (populates entre entidades que se referencian mutuamente): el campo va como *getter* dentro del `z.object`:

  ```typescript
  get tracker() {
    return TrackerSchema.optional();
  },
  ```

  Nunca spreadear un objeto que contenga getters (`{...Base}` los evalúa eager y rompe el ciclo en runtime).

## JSON Schema / OpenAPI

```bash
npm run build
npm run gen:json-schema            # dist/json-schema/<Name>.json + index.json
npm run gen:json-schema -- --only=Activo --verbose
```

Usa `z.toJSONSchema(schema, { target: 'openapi-3.0' })` nativo de Zod v4, sin librerías extra. Para Swagger en las APIs NestJS se puede usar `nestjs-zod` (`createZodDto(CreateActivoSchema)`).

## Pasaje a producción (migración Zod)

Los consumidores resuelven la git-dependency a un **commit fijo** en su
`package-lock.json`, y el Dockerfile usa `npm ci` (respeta el lock exacto). Por
eso **mergear a `main` no cambia nada en prod por sí solo**: cada consumidor
sigue clavado a su commit hasta que refresque el lock y rebuildee su imagen.

Pasos para promover la migración:

1. **Mergear `feat/migracion-zod-v4` → `main`** en gestion-modelos (PR). El branch
   está rebaseado sobre `main` (0 commits detrás) y compila (`npm run build` OK).
2. **Por cada consumidor deployado**, en su repo:
   - `npm run modelos` (repunta la dep a `#main` y **regenera el lock** con el
     commit nuevo de zod). Si el consumidor estaba pineado a
     `#feat/migracion-zod-v4` (ej. gestion-api-datos), este paso es obligatorio.
   - `npm run build` (o `nest build`) local para verificar 0 errores.
   - Commit del `package.json` + `package-lock.json` y deploy (rebuild de imagen:
     `npm ci` recompila modelos vía `prepare` y luego buildea el servicio).
3. **Verificar consumidores no cubiertos localmente** antes o junto al deploy:
   `gestion-web-cliente` (`ng build` real), `seguridad-boton-nest` /
   `seguridad-boton-web` (alias `modelos-gestion`). Ver `CONSUMIDORES.md`.

Estado de verificación y lista completa de consumidores: **`CONSUMIDORES.md`**.
