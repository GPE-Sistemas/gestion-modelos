# Gestión de Modelos

Este repositorio contiene las definiciones de interfaces TypeScript que sirven como modelo de datos unificado para todo el sistema distribuido de gestión.

## 🎯 Propósito

Las interfaces TypeScript definidas aquí son la **fuente de verdad** para los modelos de datos compartidos entre todos los servicios del sistema. Para facilitar la migración de servicios a otros lenguajes, este repositorio incluye herramientas automáticas para generar archivos Protocol Buffers equivalentes.

## 📁 Estructura

```text
src/
  interfaces/          # Interfaces TypeScript (fuente de verdad)
    *.ts               # Archivos de interfaces individuales
    chirpstack/        # Interfaces específicas de ChirpStack
    index.ts           # Exportaciones principales
proto/                 # Archivos Protocol Buffers generados
  *.proto              # Archivos .proto generados automáticamente
  README.md            # Documentación de archivos .proto
  INDEX.md             # Índice detallado de archivos .proto
scripts/               # Scripts de automatización
  generate-proto.ts    # Generador TS → Proto
  validate-proto.ts    # Validador de archivos .proto
  generate-index.ts    # Generador de índice
```

## 🚀 Uso

### Como dependencia en proyectos TypeScript

#### 1. Agregar dependencia en package.json

```json
"modelos": "git://github.com/GPE-Sistemas/gestion-modelos.git"
```

#### 2. Agregar script para actualizar

```json
"modelos": "yarn upgrade modelos"
```

#### 3. Instalar dependencia

```bash
yarn install
```

#### 4. Importar modelos requeridos

```typescript
import { ICoordenadas, IUsuario } from 'modelos/src';
```

### Para generar archivos Protocol Buffers

#### Generar archivos Protocol Buffers

Para convertir todas las interfaces TypeScript a archivos .proto:

```bash
npm run generate-proto
```

#### Validar archivos generados

Para validar la sintaxis y estructura de los archivos .proto:

```bash
npm run validate-proto
```

#### Generar índice de archivos

Para crear un índice detallado de todos los archivos .proto:

```bash
npm run generate-index
```

#### Ejecutar todo el proceso

Para generar, validar y crear el índice en un solo comando:

```bash
npm run proto:all
```

## 🔄 Proceso de Conversión TypeScript → Protocol Buffers

El proceso automático de conversión realiza las siguientes transformaciones:

### Interfaces → Mensajes Proto

- `interface IUsuario` → `message Usuario`
- Elimina el prefijo `I` de las interfaces
- Mantiene todas las propiedades como campos del mensaje

### Tipos → Mapeo de Tipos

- `string` → `string`
- `number` → `double`
- `boolean` → `bool`
- `Date` → `string` (formato ISO)
- `Interface` → `MessageType` (referencia a otro mensaje)

### Propiedades

- `propiedad?: tipo` → `optional tipo propiedad`
- `propiedad: tipo[]` → `repeated tipo propiedad`
- `camelCase` → `snake_case` (nombres de campos)

### Tipos Union → Enums

- `type Estado = "Activo" | "Inactivo"` → `enum Estado`
- Todos los enums se consolidan en `enums.proto`

## 📋 Convenciones

### Nomenclatura

- **Archivos**: `kebab-case.proto`
- **Mensajes**: `PascalCase`
- **Campos**: `snake_case`
- **Enums**: `UPPER_SNAKE_CASE`

### Numeración de Campos

- Los campos se numeran secuencialmente: 1, 2, 3...
- Cada mensaje/enum tiene su propia numeración independiente
- Se mantiene compatibilidad hacia atrás

### Imports

- Se resuelven automáticamente las dependencias entre archivos
- `enums.proto` se importa cuando es necesario
- Referencias circulares se manejan correctamente

## 🛠️ Desarrollo

### Agregar nueva interface

1. Crear el archivo TypeScript en `src/interfaces/`
2. Exportar la interface en `src/interfaces/index.ts`
3. Ejecutar `npm run proto:all` para regenerar archivos .proto

### Modificar interface existente

1. Modificar la interface TypeScript
2. Ejecutar `npm run proto:all` para actualizar archivos .proto
3. Verificar que no hay conflictos de versionado

## 📊 Estadísticas Actuales

Ejecuta `npm run validate-proto` para ver estadísticas actualizadas:

- Total de archivos .proto generados
- Número de mensajes y enums
- Distribución por tipos
- Validación de sintaxis

## 🔍 Búsqueda

Para encontrar un modelo específico:

1. Consulta `proto/INDEX.md` para el índice completo
2. Usa el índice alfabético de mensajes y enums
3. Las dependencias entre archivos están documentadas

## ⚙️ Configuración

### Dependencias

- `typescript` - Compilador TypeScript
- `ts-node` - Ejecutor de TypeScript
- `@types/node` - Tipos de Node.js

### Scripts disponibles

- `generate-proto` - Genera archivos .proto
- `validate-proto` - Valida archivos .proto
- `generate-index` - Genera índice de archivos
- `proto:all` - Ejecuta todo el pipeline
- `build` - Compila TypeScript a JavaScript

## 📝 Notas Importantes

1. **Fuente de Verdad**: Las interfaces TypeScript son la fuente de verdad. Los archivos .proto se regeneran completamente en cada ejecución.

2. **Versionado**: Los archivos .proto generados deben incluirse en el control de versiones para asegurar compatibilidad.

3. **Compatibilidad**: Se mantiene compatibilidad hacia atrás mediante numeración secuencial de campos.

4. **Regeneración**: Siempre regenera los archivos .proto después de modificar interfaces TypeScript.
