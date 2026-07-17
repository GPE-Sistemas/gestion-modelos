# Consumidores de gestion-modelos

Relevado 2026-07-17 (migración a Zod v4) grepeando `"modelos"` en los `package.json` de los repos locales de `Repos/GPE/`.

> ⚠️ **Esta lista puede estar incompleta.** La fuente de verdad de lo que está
> deployado es `Repos/GPE/DevOps/iot-cluster/` (manifiestos K8s por cliente:
> novit, smartium, bioanalitica, oficinas, uvcarg). **Pendiente**: barrer los
> deployments/images de iot-cluster para completar esta lista ANTES de mergear
> a main — el hook `prepare` de la git-dep corre en el `npm install` de TODOS
> los consumidores; si el build fallara, les rompe el install.

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
| gestion-web-cliente | `#main` | Angular; `declaration: false`, `strict: true` |
| gestion-websocket | (default) | |
| seguridad-boton-nest | — | referencia a gestion-modelos detectada, confirmar |
| seguridad-boton-web | — | ídem |

No consumidores (usan `transporte-modelos`): gestion-api-auth, gestion-api-integraciones.

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

## Checklist de adopción por consumidor

- [ ] `npm run modelos` (o reinstalar la dep) apuntando a la rama/main nueva
- [ ] `npm run build` del consumidor pasa (tsc compila el fuente de modelos)
- [ ] Si valida bodies: adoptar `CreateXSchema.safeParse(body)` en endpoints
- [ ] Opcional NestJS: `nestjs-zod` (`createZodDto`) para Swagger
