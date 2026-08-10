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
		m.Fields = append(m.Fields, path)
		if nodo.esArray() && !nodo.esVirtual() {
			// Un virtual array (`ancestros`, x-populate) no es un path del
			// documento: Mongoose no lo inicializa a [] porque nunca lo
			// persiste. Un x-ref (`idsAncestros`) SÍ es un path real —
			// Mongoose lo inicializa igual, populate solo reemplaza sus
			// elementos — así que no se filtra acá.
			m.ArrayFields = append(m.ArrayFields, path)
		}
	}
	slices.Sort(m.Fields)
	slices.Sort(m.ArrayFields)
	return m
}
