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
