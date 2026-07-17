# gestion-modelos

Modelos para el sistema de gestión: **schemas Zod v4 + tipos TypeScript inferidos**.

Cada entidad exporta su schema runtime (`ActivoSchema`, `CreateActivoSchema`, `UpdateActivoSchema`) y los tipos derivados con los mismos nombres de siempre (`IActivo`, `ICreateActivo`, `IUpdateActivo`). Los imports existentes de tipos no cambian.

## Instalación (consumidores)

En `package.json` del servicio:

```json
"modelos": "git://github.com/GPE-Sistemas/gestion-modelos.git"
```

Script para actualizar:

```json
"modelos": "yarn upgrade modelos"
```

El paquete se compila solo al instalarse (hook `prepare` → `tsc`). El import clásico sigue funcionando:

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
