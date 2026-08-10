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
		if v, hay := b.virtualDe(path, "", nodo); hay {
			m.Virtuals[path] = v
		}
		b.recorrerAnidados(m, path, nodo, nil, false)
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
//     tienen hijos persistidos.
//
// `dentroDeMixed` viaja por la recursión: un x-bson: 'mixed'
// (@Prop({type: Object})) apaga el CASTEO de lo que tiene adentro —Mongoose no
// declara NADA bajo un Mixed, así que castear ahí inventaría casteos que el
// legacy nunca tuvo (medido en el spike de la etapa 1: 28 casteos falsos en 3
// entidades)— pero NO apaga los Virtuals: un schema.virtual() se declara
// APARTE del @Prop y existe igual aunque el @Prop sea Mixed. Por eso el
// recorrido sigue bajando bajo un Mixed; lo que se apaga es solo `castDe`.
//
// `visitados` corta los ciclos entre schemas que se referencian a sí mismos.
func (b *bundleJSON) recorrerAnidados(m *Metadata, prefijo string, nodo *nodoJSON, visitados []string, dentroDeMixed bool) {
	if nodo.esPopulate() || nodo.esComputed() {
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
	dentroDeMixed = dentroDeMixed || bsonDe(nodo) == "mixed"
	for hijo, hijoNodo := range b.propiedades(destino) {
		path := prefijo + "." + hijo
		if hijoNodo.esComputed() {
			continue
		}
		// Un Mixed apaga el CASTEO de lo que tiene adentro (Mongoose no
		// declara ningún path bajo un @Prop({type: Object})) pero NO los
		// virtuals: un schema.virtual('detallesEmergencias.hospital', {...}) se
		// declara aparte del @Prop. El legacy tiene 11 así.
		if !dentroDeMixed {
			if ft, hay := castDe(hijoNodo); hay {
				m.FieldTypes[path] = ft
			}
		}
		if v, hay := b.virtualDe(path, prefijo+".", hijoNodo); hay {
			m.Virtuals[path] = v
		}
		b.recorrerAnidados(m, path, hijoNodo, visitados, dentroDeMixed)
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

// virtualDe arma el Virtual de una prop, si la prop declara uno.
//
// Son DOS formas distintas y las dos son populates reales:
//
//   - x-populate: un schema.virtual() declarado. Popula bajo el nombre de la
//     prop, y trae su propio localField.
//   - x-ref: un @Prop({ref}). Mongoose popula el path del id EN SU LUGAR, así
//     que el localField ES el path mismo.
//
// `prefijoAbsoluto` es lo que hay que anteponerle al localField de un
// x-populate anidado: en zod va RELATIVO al sub-documento (`idChofer` dentro de
// VehiculoSchema) y el motor resuelve los populates contra la raíz del
// documento (`vehiculo.idChofer`).
//
// Desvío del brief: la convención real del repo para un populate en un array
// es `z.array(X).meta({...})` — la anotación cuelga del nodo ARRAY, no de sus
// items (confirmado en 429 props del bundle: idsAncestros, ancestros, etc.).
// `nodo.anotado()` devuelve siempre los items para un array, así que un
// `n := nodo.anotado()` se queda sin la anotación en TODOS esos casos. Por eso
// populateDe/refEntidadDe miran primero el nodo mismo y recién si no hay nada
// ahí caen a los items, igual que ya hace `anotacion()` para x-bson/x-setter.
func (b *bundleJSON) virtualDe(path, prefijoAbsoluto string, nodo *nodoJSON) (Virtual, bool) {
	esArray := nodo.esArray()

	if p := populateDe(nodo); p != nil {
		local := p.LocalField
		if prefijoAbsoluto != "" && !contienePunto(local) {
			local = prefijoAbsoluto + local
		}
		return Virtual{
			Ref:          b.coleccionDeSchema(p.Ref),
			LocalField:   local,
			ForeignField: p.ForeignField,
			JustOne:      p.JustOne,
		}, true
	}
	if ref := refEntidadDe(nodo); ref != "" {
		return Virtual{
			Ref:          b.coleccionDeSchema(ref),
			LocalField:   path, // con x-ref el populate reemplaza el path del id
			ForeignField: "_id",
			JustOne:      !esArray,
		}, true
	}
	return Virtual{}, false
}

// populateDe devuelve la anotación x-populate del nodo o de sus items.
func populateDe(n *nodoJSON) *populateJSON {
	if n.Populate != nil {
		return n.Populate
	}
	if n.esArray() {
		return n.Items.Populate
	}
	return nil
}

// refEntidadDe devuelve la anotación x-ref del nodo o de sus items.
func refEntidadDe(n *nodoJSON) string {
	if n.RefEntidad != "" {
		return n.RefEntidad
	}
	if n.esArray() {
		return n.Items.RefEntidad
	}
	return ""
}

// coleccionDeSchema traduce el nombre de un schema ("ClienteSchema") al de su
// colección ("clientes"). Las anotaciones de zod referencian schemas porque es
// lo que existe en TypeScript; los consumidores necesitan la colección.
// Devuelve "" si el schema no existe o no es una entidad — que es un bundle
// roto, y lo caza el chequeo diferencial de la tarea 9.
func (b *bundleJSON) coleccionDeSchema(schema string) string {
	if d := b.Defs[schema]; d != nil {
		return d.Collection
	}
	return ""
}

func contienePunto(s string) bool {
	for i := range s {
		if s[i] == '.' {
			return true
		}
	}
	return false
}
