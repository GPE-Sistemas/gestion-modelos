# Consumidores de gestion-modelos

Relevado 2026-07-17 (migración a Zod v4): (1) `"modelos"` en los `package.json`
de los repos locales de `Repos/GPE/`; (2) barrido de imágenes deployadas en
`Repos/GPE/DevOps/iot-cluster/novit/apis-gestion-irix/{gestion-prod,gestion-test}`.

> El hook `prepare` de la git-dep corre en el `npm install` de TODOS los
> consumidores; si el build de gestion-modelos fallara, les rompe el install.
> Por eso importa la lista completa. iot-cluster hoy solo tiene el cliente
> **novit** activo (más `acceso-coliving`, que usa acceso-modelos, no este);
> el CLAUDE.md menciona bioanalitica/smartium/etc. pero están en `_deprecated`/
> `_otros` o ya no se manifiestan acá.

## Deployados en prod SIN repo clonado localmente (VERIFICAR)

El barrido de iot-cluster encontró estos servicios NestJS corriendo en
`gestion-prod` (y varios también en `gestion-test`) que NO tengo clonados, así
que no pude leer su `package.json`. Son candidatos a consumir `modelos/src` y
hay que confirmar su build contra la rama antes del merge:

`gestion-api-consultas`, `gestion-api-notificaciones`,
`gestion-api-trackeo-colectivos`, `gestion-coap`, `gestion-dispositivos-lora`,
`gestion-irix-deeplinks`, `gestion-qualcomm-aware`, `gestion-twilio-api`,
`gestion-websocket-traccar` (todos en prod). En test además:
`gestion-api-reportes-truchos`.

No dependen de gestion-modelos (npm): `gestion-trackers-go` (Go), y los sidecars
externos del manifiesto (`go2rtc`, `mediaMTX`, `rtspToWeb`, `traccar`, `emqx5`,
`loki-stack`).

## Consumidores locales detectados (dependencia `gestion-modelos`)

| Repo | Ref | Nota |
|------|-----|------|
| gestion-api-alarmas | `#main` | |
| gestion-api-cache | (default) | sin `#ref` → toma la branch default |
| gestion-api-camaras | (default) | |
| gestion-api-datos | `#main` | |
| gestion-api-eventos | `#main` | |
| gestion-api-gestion | `#main` | |
| gestion-api-sirenas | `#main` | |
| gestion-api-t1000b | (default) | |
| gestion-api-trackers | (default) | deprecado (reemplazado por trackers-go), pero la dep existe |
| gestion-api-websocket-io | (default) | |
| gestion-cron | `#main` | |
| gestion-lora-luminarias | `#main` | |
| gestion-web-cliente | `#main` | Angular; `declaration: false`, `strict: true`; deployado (prod+test) |
| gestion-websocket | (default) | deployado en prod |
| seguridad-boton-nest | — | referencia a gestion-modelos detectada, confirmar |
| seguridad-boton-web | — | ídem |

Todos los de arriba salvo trackers (deprecado) y camaras/websocket aparecen
también en el manifiesto de prod o test de novit → deploy real, aplican el
cambio. `gestion-api-auth` y `gestion-api-integraciones` están deployados pero
usan `transporte-modelos`, NO este paquete.

## Cambios de contrato a verificar por consumidor (migración Zod)

1. **`ICreateDispositivoAlarma` / `CreateDispositivoAlarmaSchema`**: el original
   tenía el typo `'comunicador '` (espacio final) en `OmitirCreate`, por lo que
   el Create **no** omitía `comunicador`. El schema nuevo lo omite (fix). El
   type legacy conserva el comportamiento original. Si alguna API valida el
   create con el schema y mandaba `comunicador`, el strip-mode lo descarta.
2. **Enums de `externos/osrm.ts`** (`DrivingSide`, `Mode`): eran `enum` TS,
   ahora son `z.enum` + type. Verificado que ningún consumidor los usaba como
   valor; si alguno externo lo hiciera, debe migrar a `DrivingSideSchema.enum.Left`
   o al literal `'left'`.
3. **Renombres de schemas por colisión de barrel** (solo exports NUEVOS, no
   afectan tipos existentes): `EstadoCuentaEntidadSchema` (estado-entidad),
   `RolUsuarioSchema` (usuario), `AccessoryInfoItemSchema` (dispositivo-alarma),
   `DeviceInfoChirpstackSchema` (chirpstack).
4. **Schemas de reporte/evento genérico** (`ReporteGenericoSchema`,
   `EventoGenericoSchema` y sus Create/Update): el discriminante
   (`tipoReporte`/`tipoEvento`) es **requerido** al validar, a diferencia de los
   tipos legacy donde es opcional. Los tipos legacy no cambiaron.
5. El paquete ahora tiene `dependencies: { zod }` y hook `prepare` (build tsc):
   el `npm install` del consumidor compila el paquete y hoistea zod. El import
   `from 'modelos/src'` sigue funcionando igual.

## Fricciones de adopción detectadas (probando en gestion-api-datos)

La migración es transparente salvo en las **entidades que son uniones
discriminadas** (hoy `IUbicacion`, y las genéricas reporte/evento). Al asignar
un documento Mongoose a esos tipos, TS falla el narrowing si el paquete usa
`z.infer` en las piezas de la union. Ya corregido en el paquete (commits de la
rama), pero es el patrón a vigilar si se agregan uniones discriminadas nuevas:
- discriminante = type alias de literales plano (NO `z.infer<z.enum>`)
- `valores` de cada variante = interface hand-written (NO `z.infer<z.object>`)
- populate hacia la union desde otra entidad = `z.custom<ITipo>()` (NO el schema)

Verificado end-to-end: **gestion-api-datos compila 0 errores** (`nest build`
genera `dist/main.js`) contra la rama, y los 6 consumidores deployados +
api-gestion también (ver estado abajo).

## Checklist de adopción por consumidor

- [ ] `npm run modelos` (o reinstalar la dep) apuntando a la rama/main nueva
- [ ] `npm run build` del consumidor pasa (tsc compila el fuente de modelos)
- [ ] Si valida bodies: adoptar `CreateXSchema.safeParse(body)` en endpoints
- [ ] Opcional NestJS: `nestjs-zod` (`createZodDto`) para Swagger
