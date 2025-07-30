# Protocol Buffers - Modelos de Gestión

Este directorio contiene los archivos Protocol Buffers (.proto) generados automáticamente a partir de las interfaces TypeScript del proyecto.

## 📋 Archivos Generados

Los archivos se generan siguiendo estas convenciones:

- **Interfaces principales**: Se convierten a mensajes Proto con el mismo nombre (sin el prefijo `I`)
- **Tipos Union**: Se convierten a enums en el archivo `enums.proto`
- **Propiedades opcionales**: Se marcan como `optional` en Proto
- **Arrays**: Se marcan como `repeated` en Proto
- **Nombres de campos**: Se convierten de camelCase a snake_case

## 🔄 Regeneración

Para regenerar todos los archivos Protocol Buffers ejecuta:

```bash
npm run generate-proto
```

## 📝 Mapeo de Tipos

| TypeScript | Protocol Buffers |
|------------|------------------|
| `string` | `string` |
| `number` | `double` |
| `boolean` | `bool` |
| `Date` | `string` (ISO format) |
| `any` | `string` (JSON) |
| `Interface` | `message` |
| `type Union` | `enum` |

## 🗂️ Estructura

- **Mensajes principales**: Un archivo .proto por cada interface
- **Enums**: Todos los tipos union en `enums.proto`
- **Imports**: Se resuelven automáticamente las dependencias entre archivos

## 🛠️ Uso en Otros Lenguajes

Estos archivos .proto pueden ser utilizados para generar código en múltiples lenguajes:

### Python

```bash
protoc --python_out=./generated --proto_path=./proto ./proto/*.proto
```

### Go

```bash
protoc --go_out=./generated --proto_path=./proto ./proto/*.proto
```

### Java

```bash
protoc --java_out=./generated --proto_path=./proto ./proto/*.proto
```

### C sharp

```bash
protoc --csharp_out=./generated --proto_path=./proto ./proto/*.proto
```

## ⚠️ Notas Importantes

1. **Fuente de verdad**: Las interfaces TypeScript siguen siendo la fuente de verdad
2. **Regeneración**: Los archivos .proto se regeneran completamente en cada ejecución
3. **Versionado**: Los archivos .proto deberían incluirse en el control de versiones
4. **Compatibilidad**: Se mantiene compatibilidad hacia atrás en la numeración de campos

## 🔍 Validación

Para validar que los archivos .proto son correctos:

```bash
# Instalar protoc (si no está instalado)
# macOS
brew install protobuf

# Validar archivos
protoc --proto_path=./proto --descriptor_set_out=/dev/null ./proto/*.proto
```
