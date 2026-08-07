// Package esquema expone la metadata de persistencia de las entidades, derivada
// de las anotaciones .meta() de los schemas zod de gestion-modelos.
//
// Es la fuente única para las APIs Go: en vez de que cada repo declare a mano
// qué campos castea, qué paths son array y qué virtuals popula, todo sale del
// mismo bundle que ya usan los consumidores TypeScript.
//
// Lo que este paquete NO hace, a propósito:
//
//   - NO valida bodies. gestion-datos-go replica el strict mode de Mongoose,
//     que DESCARTA las claves desconocidas en silencio; validar con las reglas
//     de zod empezaría a RECHAZAR bodies que el legacy aceptaba, que es un
//     cambio de contrato.
//   - NO genera structs. Los motores que lo consumen trabajan con documentos
//     dinámicos (map[string]any / bson.M). Cuando gestion-trackers-go quiera
//     structs se agrega go/modelos, midiendo antes su drift.
package esquema

import _ "embed"

// bundleCrudo es el bundle JSON Schema commiteado. Se regenera con
// `npm run gen:bundle-go` desde dist/json-schema/index.json, que está
// gitignored y por eso no se puede embeber directo.
//
//go:embed bundle.json
var bundleCrudo []byte
