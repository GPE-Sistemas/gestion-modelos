package esquema

// nodoJSON es el subconjunto de JSON Schema que emite `z.toJSONSchema` y que
// este paquete necesita leer. No pretende ser un parser de JSON Schema
// completo: es la forma concreta de NUESTRO bundle.
type nodoJSON struct {
	Tipo       string               `json:"type"`
	Ref        string               `json:"$ref"`
	Items      *nodoJSON            `json:"items"`
	Properties map[string]*nodoJSON `json:"properties"`
	AnyOf      []*nodoJSON          `json:"anyOf"`
	OneOf      []*nodoJSON          `json:"oneOf"`

	// Anotaciones de persistencia (.meta() de zod). La convención está
	// documentada en gestion-modelos/CLAUDE.md §5.
	Collection string        `json:"x-collection"`
	Bson       string        `json:"x-bson"`
	Setter     string        `json:"x-setter"`
	RefEntidad string        `json:"x-ref"`
	Populate   *populateJSON `json:"x-populate"`
	Computed   bool          `json:"x-computed"`
}

type populateJSON struct {
	Ref          string `json:"ref"`
	LocalField   string `json:"localField"`
	ForeignField string `json:"foreignField"`
	JustOne      bool   `json:"justOne"`
}

type bundleJSON struct {
	Defs map[string]*nodoJSON `json:"$defs"`
}

// resolver sigue un $ref y desenvuelve un array. Devuelve el nodo destino y si
// ese destino es una ENTIDAD (tiene x-collection): cruzar a una entidad es
// seguir un populate, no bajar a un sub-documento, y sus campos pertenecen al
// inventario de la otra entidad.
func (b *bundleJSON) resolver(n *nodoJSON) (destino *nodoJSON, esEntidad bool) {
	if n == nil {
		return nil, false
	}
	if n.Tipo == "array" && n.Items != nil {
		return b.resolver(n.Items)
	}
	if n.Ref == "" {
		return n, false
	}
	d := b.Defs[nombreDeRef(n.Ref)]
	if d == nil {
		return nil, false
	}
	return d, d.Collection != ""
}

// nombreDeRef saca el prefijo "#/$defs/" de una referencia.
func nombreDeRef(ref string) string {
	const prefijo = "#/$defs/"
	if len(ref) > len(prefijo) && ref[:len(prefijo)] == prefijo {
		return ref[len(prefijo):]
	}
	return ""
}

// propiedades devuelve las properties de un nodo, aplanando un anyOf/oneOf de
// nivel superior (z.union / z.discriminatedUnion): una unión no tiene
// properties propias, viven adentro de cada variante.
//
// Se hace la UNIÓN de todas las variantes, nunca la intersección: un campo que
// existe en una sola variante igual se persiste en esa variante. Que dos
// variantes DISCREPEN en la anotación no se contempla acá porque no puede
// pasar: lo prohíbe el chequeo de drift de gestion-datos-go, que falla la
// cosecha si encuentra una discrepancia.
func (b *bundleJSON) propiedades(n *nodoJSON) map[string]*nodoJSON {
	variantes := n.AnyOf
	if len(variantes) == 0 {
		variantes = n.OneOf
	}
	if len(variantes) == 0 {
		return n.Properties
	}
	out := map[string]*nodoJSON{}
	for _, v := range variantes {
		for k, hijo := range v.Properties {
			if _, ya := out[k]; !ya {
				out[k] = hijo
			}
		}
	}
	return out
}

// esArray dice si el nodo es un array en el documento.
func (n *nodoJSON) esArray() bool { return n.Tipo == "array" && n.Items != nil }

// anotado devuelve el nodo que lleva las anotaciones: para un array, el de los
// items (`z.array(X).meta()` cuelga del array, pero `z.array(X.meta())` cuelga
// de los items, y las dos formas se usan en el repo).
func (n *nodoJSON) anotado() *nodoJSON {
	if n.esArray() {
		return n.Items
	}
	return n
}

// anotacion busca una clave en el nodo y en sus items, en ese orden.
func (n *nodoJSON) anotacion(de func(*nodoJSON) string) string {
	if v := de(n); v != "" {
		return v
	}
	if n.esArray() {
		return de(n.Items)
	}
	return ""
}

// esPopulate dice si la prop es un virtual (x-populate) o un @Prop({ref})
// (x-ref): en los dos casos no es un campo de datos común.
func (n *nodoJSON) esPopulate() bool {
	if n.Populate != nil || n.RefEntidad != "" {
		return true
	}
	return n.esArray() && (n.Items.Populate != nil || n.Items.RefEntidad != "")
}

// esVirtual dice si la prop es un virtual declarado (x-populate): un nombre que
// existe en el toJSON pero NO es un path del documento. Distinto de esPopulate,
// que además incluye los x-ref — esos SÍ son paths del documento (guardan los
// ObjectIds) y por eso van a Fields y se inicializan a [] si son array.
func (n *nodoJSON) esVirtual() bool {
	if n.Populate != nil {
		return true
	}
	return n.esArray() && n.Items.Populate != nil
}

// esComputed dice si la prop es un getter del toJSON (x-computed): no es un
// path del documento, no se persiste ni se inicializa.
func (n *nodoJSON) esComputed() bool {
	return n.Computed || (n.esArray() && n.Items.Computed)
}
