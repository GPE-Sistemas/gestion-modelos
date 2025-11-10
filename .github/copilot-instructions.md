# Copilot Instructions - gestion-modelos

## Project Overview

This is a **TypeScript shared models library** for a multi-tenant IoT/fleet management system. It provides type-safe interfaces for MongoDB documents consumed by multiple Node.js microservices. The library is distributed as a git dependency, not published to npm.

## Architecture Principles

### 1. Discriminated Union Pattern (Critical)

New generic entity types MUST follow the pattern established in `reporte-generico.ts` and `evento-generico.ts`:

```typescript
// 1. Define discriminant type
export type TipoEntidad = 'Tipo A' | 'Tipo B' | 'Tipo C';

// 2. Create specific value interfaces
export interface IValoresA {
  /* fields */
}
export interface IValoresB {
  /* fields */
}

// 3. Map types to values and state
export type MapaEntidad = {
  'Tipo A': { valores: IValoresA; estado: EstadoA };
  'Tipo B': { valores: IValoresB; estado: EstadoB };
};

// 4. Generic base interface
export interface IEntidadBase<T extends keyof MapaEntidad> {
  tipoEntidad?: T;
  estado?: MapaEntidad[T]['estado'];
  valores?: MapaEntidad[T]['valores'];
  // ... common fields
}

// 5. Discriminated union for reads
export type IEntidad =
  | IEntidadBase<'Tipo A'>
  | IEntidadBase<'Tipo B'>
  | IEntidadBase<'Tipo C'>;

// 6. Create/Update unions
export type ICreateEntidad =
  | Omit<IEntidadBase<'Tipo A'>, Omitir>
  | Omit<IEntidadBase<'Tipo B'>, Omitir>;
```

**Why**: Enables TypeScript to narrow types based on discriminant fields, providing full type safety across microservices.

### 2. Multi-Tenant Hierarchy

All tenant-scoped entities include:

- `idCliente?: string` - Direct tenant
- `idsAncestros?: string[]` - Tenant hierarchy for inherited permissions
- Populate: `cliente?: ICliente; ancestros?: ICliente[]`

### 3. CRUD Pattern

Every entity interface follows this structure:

- `IEntity` - Full document with populates
- `ICreateEntity` - Omits `_id`, `idsAncestros`, and all populate fields
- `IUpdateEntity` - Partial with same omissions
- `IEntityCache` - Omits all populate fields (for Redis/memory caching)

**Omit Pattern**:

```typescript
type OmitirCreate = '_id' | 'idsAncestros' | 'cliente' | 'ancestros' | /* all populate fields */;
export interface ICreateEntity extends Omit<Partial<IEntity>, OmitirCreate> {}
```

### 4. GeoJSON Standard

Location data uses GeoJSON Point format (NOT lat/lng objects):

```typescript
export interface IGeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}
```

## Key Conventions

### Interface Naming

- Entities: `IEntity` (e.g., `ITracker`, `ILuminaria`)
- Create/Update: `ICreateEntity`, `IUpdateEntity`
- Values/Config objects: `IValoresEntity`, `IConfigEntity`
- Legacy coordinate type: `ICoordenadas` (migrate to `IGeoJSONPoint`)

### Exports

All interfaces are re-exported through barrel files:

- `src/interfaces/index.ts` - All entity interfaces
- `src/auxiliares/index.ts` - Utility types and helpers
- `src/index.ts` - Root export

### Query Filters

Use `IFilter<T>` from `auxiliares/query-filter.ts` for type-safe MongoDB queries:

```typescript
IFilter<ITracker>; // Supports $regex, $in, $gte, nested paths, etc.
```

## IoT-Specific Patterns

### Device Types

- **Trackers**: GPS devices (4G, LoRaWAN T1000B, Qualcomm)
- **Luminarias**: Smart streetlights (GPE, Wellness, ACTIS FING)
- **Alarmas**: Security systems with Contact ID protocol
- **Activos**: Vehicles/assets with trackers attached
- **Sirenas**: Emergency sirens with panic buttons

### Event System

Events are discriminated by `tipoEvento` and grouped by `categoria`:

- `'Evento'` - Operational events requiring attention
- `'Servicio Técnico'` - Maintenance events
- `'Seguimiento Emergencia'` - Medical/fire emergencies

Use `idEntidad` (not specific device IDs) to reference the triggering entity.

### Report Data

Telemetry reports use discriminated unions by `tipoReporte`:

- Include `timestamp`, `fCnt` (frame counter), device-specific metrics
- Reports expire via `expireAt` field (MongoDB TTL indexes)

## Integration Points

### External Services

- **Traccar**: 4G tracker integration (`externos/traccar.ts`)
- **OSRM**: Route calculation (`externos/osrm.ts`)
- **ChirpStack**: LoRaWAN network server (`interfaces/chirpstack/`)
- **Contact ID**: Alarm protocol (`IContactID` in `evento.ts`)

### Socket Communication

Real-time events use `ISocketMessage<T>` from `auxiliares/socket-message.ts`:

```typescript
{
  operacion: 'create' | 'update' | 'delete';
  payload: T;
}
```

## Development Workflow

### Adding New Entity Types

1. Create interface file in `src/interfaces/`
2. Define main interface with all fields
3. Add populate fields with `?` optional marker
4. Define `OmitirCreate`/`OmitirUpdate` types
5. Export `ICreate*` and `IUpdate*` interfaces
6. Export from `src/interfaces/index.ts`

### Modifying Existing Interfaces

- Always maintain backwards compatibility
- Add new fields as optional (`?`)
- Never remove fields (deprecate with JSDoc `@deprecated`)
- Update Create/Update omit lists if adding populates

### Testing Changes

Consuming services install via:

```bash
yarn upgrade modelos
```

No build step required - consuming services compile TypeScript directly.

## Common Pitfalls

❌ **Don't** use `lat/lng` objects - use `IGeoJSONPoint`  
❌ **Don't** export interfaces without adding to `index.ts`  
❌ **Don't** add required fields to existing interfaces (breaks updates)  
❌ **Don't** define duplicate types across files (reuse via imports)  
✅ **Do** use discriminated unions for polymorphic entities  
✅ **Do** group related fields in nested objects (e.g., `detallesTecnicos`)  
✅ **Do** document complex types with JSDoc comments
