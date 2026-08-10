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
			// Lo maneja Mongo/Mongoose: ningún meta lo declara en Fields ni
			// en FieldTypes.
			continue
		}
		// Un x-computed es un getter del toJSON: no existe como path del
		// documento, así que no va a Fields ni a ArrayFields.
		if nodo.esComputed() {
			continue
		}
		// Un x-populate (virtual declarado, `ancestros`/`cliente`) NO es un
		// path del documento: Mongoose no lo persiste, y el strict mode que
		// replica el motor lo descartaría de un body. Un x-ref
		// (`idsAncestros`) SÍ lo es — guarda los ObjectIds, y el populate solo
		// reemplaza sus elementos al leer. La distinción vale para Fields y
		// para ArrayFields por igual: en los dos casos la pregunta es "¿existe
		// este path en el documento?".
		//
		// Va como GUARDA y no como `continue`: la tarea 5 extrae los Virtuals
		// en este mismo loop, y saltear la iteración los dejaría vacíos.
		if !nodo.esVirtual() {
			m.Fields = append(m.Fields, path)
			if nodo.esArray() {
				m.ArrayFields = append(m.ArrayFields, path)
			}
		}
	}
	slices.Sort(m.Fields)
	slices.Sort(m.ArrayFields)
	return m
}
