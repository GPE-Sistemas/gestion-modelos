package esquema

import "slices"

// metadataDe arma la metadata de una entidad recorriendo su schema.
func (b *bundleJSON) metadataDe(nombre string, def *nodoJSON) *Metadata {
	m := &Metadata{
		Schema:     nombre,
		Collection: def.Collection,
		FieldTypes: map[string]FieldType{},
		Virtuals:   map[string]Virtual{},
	}
	for path, nodo := range b.propiedades(def) {
		if path == "_id" {
			// Lo maneja Mongo/Mongoose: ningún meta lo declara.
			continue
		}
		if nodo.esComputed() {
			// Getter del toJSON: no existe como path del documento.
			continue
		}
		// x-populate (virtual declarado) NO es un path del documento; x-ref SÍ.
		// Ver esVirtual en la tarea 3 — NO cambiar esto a esPopulate, que
		// además incluye los x-ref y dejaría `idsAncestros` fuera de Fields y
		// de ArrayFields. Va como guarda y no como `continue` porque la tarea 5
		// extrae los Virtuals en este mismo loop.
		if !nodo.esVirtual() {
			m.Fields = append(m.Fields, path)
			if nodo.esArray() {
				m.ArrayFields = append(m.ArrayFields, path)
			}
		}
		if ft, hay := castDe(nodo); hay {
			m.FieldTypes[path] = ft
		}
		b.recorrerAnidados(m, path, nodo, nil)
	}
	slices.Sort(m.Fields)
	slices.Sort(m.ArrayFields)
	return m
}

// recorrerAnidados baja al sub-documento de una prop y agrega los casteos de
// sus paths con notación de punto. Mongoose castea TODOS los paths de un
// sub-schema, no solo el _id.
//
// NO se baja:
//
//   - a otra ENTIDAD (x-collection): eso es un populate, y sus campos
//     pertenecen al inventario de la otra entidad;
//   - dentro de un x-populate o un x-computed: son un virtual y un getter, no
//     tienen hijos persistidos;
//   - dentro de un x-bson: 'mixed' (@Prop({type: Object})): Mongoose no declara
//     NADA adentro de un Mixed, así que no castea esos paths. Bajar igual
//     inventaría casteos que el legacy nunca tuvo — medido en el spike de la
//     etapa 1: 28 casteos falsos en 3 entidades.
//
// `visitados` corta los ciclos entre schemas que se referencian a sí mismos.
func (b *bundleJSON) recorrerAnidados(m *Metadata, prefijo string, nodo *nodoJSON, visitados []string) {
	if nodo.esPopulate() || nodo.esComputed() {
		return
	}
	if bsonDe(nodo) == "mixed" {
		return
	}
	destino, esEntidad := b.resolver(nodo)
	if destino == nil || esEntidad {
		return
	}
	if ref := nombreDeRef(refDe(nodo)); ref != "" {
		if slices.Contains(visitados, ref) {
			return
		}
		visitados = append(visitados, ref)
	}
	for hijo, hijoNodo := range b.propiedades(destino) {
		path := prefijo + "." + hijo
		if hijoNodo.esComputed() {
			continue
		}
		if ft, hay := castDe(hijoNodo); hay {
			m.FieldTypes[path] = ft
		}
		b.recorrerAnidados(m, path, hijoNodo, visitados)
	}
}

// refDe devuelve el $ref del nodo (o el de sus items si es un array).
func refDe(n *nodoJSON) string {
	if n.Ref != "" {
		return n.Ref
	}
	if n.esArray() {
		return n.Items.Ref
	}
	return ""
}

// bsonDe devuelve la anotación x-bson del nodo o de sus items.
func bsonDe(n *nodoJSON) string {
	return n.anotacion(func(x *nodoJSON) string { return x.Bson })
}

// castDe traduce la anotación de una prop al FieldType que le corresponde.
//
// El SETTER GANA sobre el tipo: Mongoose aplica el setter también al castear un
// filtro, así que un campo con `uppercase` se compara en mayúsculas sin importar
// que además sea string.
//
// Un `mixed` no castea NADA: es un @Prop({type: Object}) y adentro Mongoose no
// declara nada.
func castDe(n *nodoJSON) (FieldType, bool) {
	switch n.anotacion(func(x *nodoJSON) string { return x.Setter }) {
	case "uppercase":
		return Uppercase, true
	case "lowercase":
		return Lowercase, true
	}
	esArray := n.esArray()
	switch bsonDe(n) {
	case "objectId":
		if esArray {
			return ObjectIDArray, true
		}
		return ObjectID, true
	case "date":
		return Date, true
	case "mixed":
		return "", false
	}
	tipo := n.Tipo
	if esArray {
		tipo = n.Items.Tipo
	}
	switch tipo {
	case "number":
		return Number, true
	case "boolean":
		return Bool, true
	}
	return "", false
}
