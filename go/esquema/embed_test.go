package esquema

import (
	"encoding/json"
	"testing"
)

// El bundle embebido tiene que ser el mismo artefacto que consume el chequeo de
// drift: un objeto con $defs y los 81 schemas entidad (x-collection).
func TestElBundleEmbebidoTieneLasEntidades(t *testing.T) {
	var raiz struct {
		Defs map[string]json.RawMessage `json:"$defs"`
	}
	if err := json.Unmarshal(bundleCrudo, &raiz); err != nil {
		t.Fatalf("el bundle embebido no parsea: %v", err)
	}
	if len(raiz.Defs) == 0 {
		t.Fatal("el bundle no tiene $defs: ¿se corrió npm run gen:bundle-go?")
	}
	var entidades int
	for _, cruda := range raiz.Defs {
		var d struct {
			Collection string `json:"x-collection"`
		}
		if err := json.Unmarshal(cruda, &d); err == nil && d.Collection != "" {
			entidades++
		}
	}
	if entidades < 80 {
		t.Errorf("solo %d schemas con x-collection; esperaba al menos 80", entidades)
	}
}
