package esquema

import (
	"slices"
	"testing"
)

func cargarParaTest(t *testing.T) *Registro {
	t.Helper()
	r, err := Cargar()
	if err != nil {
		t.Fatalf("Cargar: %v", err)
	}
	return r
}

func TestCargarIndexaLasEntidadesPorColeccionYPorSchema(t *testing.T) {
	r := cargarParaTest(t)

	if n := len(r.Todas()); n < 80 {
		t.Errorf("Todas() devolvió %d entidades; esperaba al menos 80", n)
	}

	m, ok := r.PorColeccion("activos")
	if !ok {
		t.Fatal(`PorColeccion("activos") no encontró la entidad`)
	}
	if m.Schema != "ActivoSchema" {
		t.Errorf("Schema = %q; esperaba ActivoSchema", m.Schema)
	}

	porSchema, ok := r.PorSchema("ActivoSchema")
	if !ok {
		t.Fatal(`PorSchema("ActivoSchema") no encontró la entidad`)
	}
	if porSchema != m {
		t.Error("PorColeccion y PorSchema devolvieron instancias distintas")
	}
}

func TestFieldsTraeLosPathsTopLevelSinID(t *testing.T) {
	m, _ := cargarParaTest(t).PorColeccion("activos")

	// Muestras del ActivoSchema: campos de datos y un populate declarado.
	for _, esperado := range []string{"idCliente", "vehiculo", "idTracker", "fechaAlta"} {
		if !slices.Contains(m.Fields, esperado) {
			t.Errorf("Fields no tiene %q", esperado)
		}
	}
	// _id lo maneja Mongo: nunca va en Fields (el motor lo acepta aparte).
	if slices.Contains(m.Fields, "_id") {
		t.Error("Fields incluye _id y no debería")
	}
	// Los virtuals declarados (x-populate) NO son paths del documento: el
	// strict mode que replica el motor los descartaría de un body, y el
	// activos/meta.go escrito a mano no los declara. La aserción NEGATIVA es
	// tan necesaria como la positiva: sin ella, un Fields que incluye los
	// cuatro virtuals pasa el test igual.
	for _, virtual := range []string{"cliente", "ancestros", "grupo", "tracker"} {
		if slices.Contains(m.Fields, virtual) {
			t.Errorf("Fields incluye el virtual %q: es un x-populate, no un path del documento", virtual)
		}
	}
	if !slices.IsSorted(m.Fields) {
		t.Error("Fields tiene que venir ordenado para que el diff contra el meta sea estable")
	}
}

func TestArrayFieldsSonLosArraysTopLevelPersistidos(t *testing.T) {
	m, _ := cargarParaTest(t).PorColeccion("activos")

	if !slices.Contains(m.ArrayFields, "idsAncestros") {
		t.Error("ArrayFields no tiene idsAncestros")
	}
	// `ancestros` es un x-populate (virtual): no es un path del documento, así
	// que Mongoose no lo inicializa a [].
	if slices.Contains(m.ArrayFields, "ancestros") {
		t.Error("ArrayFields incluye el virtual `ancestros` y no debería")
	}
	// `vehiculo` es un objeto, no un array.
	if slices.Contains(m.ArrayFields, "vehiculo") {
		t.Error("ArrayFields incluye `vehiculo`, que es un objeto")
	}
}

func TestFieldTypesCasteaLosTiposDeLaAnotacion(t *testing.T) {
	m, _ := cargarParaTest(t).PorColeccion("activos")

	casos := map[string]FieldType{
		"idCliente":                     ObjectID,
		"idsAncestros":                  ObjectIDArray,
		"fechaAlta":                     Date,
		"puedeSolicitarServicioTecnico": Bool,
		// El setter gana sobre el tipo: Mongoose lo aplica también al castear.
		"vehiculo.patente": Uppercase,
		// Dot-paths del sub-schema Vehiculo.
		"vehiculo.idChofer":             ObjectID,
		"vehiculo.idsRecorridos":        ObjectIDArray,
		"vehiculo.dentroDelRecorrido":   Bool,
		"vehiculo.capacidadCombustible": Number,
	}
	for path, esperado := range casos {
		if real, ok := m.FieldTypes[path]; !ok {
			t.Errorf("FieldTypes no tiene %q (esperaba %v)", path, esperado)
		} else if real != esperado {
			t.Errorf("FieldTypes[%q] = %v; esperaba %v", path, real, esperado)
		}
	}
}

func TestFieldTypesNoBajaDentroDeUnMixed(t *testing.T) {
	m, _ := cargarParaTest(t).PorColeccion("temas")

	// `payload` es @Prop({type: Object}) en el legacy: adentro de un Mixed
	// Mongoose no declara nada, así que no castea esos paths. Si el emisor
	// bajara igual, inventaría casteos que el legacy nunca tuvo.
	for path := range m.FieldTypes {
		if len(path) > len("payload.") && path[:len("payload.")] == "payload." {
			t.Errorf("FieldTypes tiene %q, que está adentro de un Mixed", path)
		}
	}
}

func TestFieldTypesCasteaElIDDeUnSubdocumentoConID(t *testing.T) {
	m, _ := cargarParaTest(t).PorColeccion("recorridos")

	// `paradas` es el único sub-documento CON _id del legacy: el front filtra
	// recorridos por {paradas._id}, así que ese path necesita el casteo.
	if real, ok := m.FieldTypes["paradas._id"]; !ok || real != ObjectID {
		t.Errorf("FieldTypes[\"paradas._id\"] = %v, %v; esperaba objectId, true", real, ok)
	}
	if real := m.FieldTypes["paradas.tiempoParada"]; real != Number {
		t.Errorf("FieldTypes[\"paradas.tiempoParada\"] = %v; esperaba number", real)
	}
}
