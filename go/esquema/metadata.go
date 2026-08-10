package esquema

import (
	"encoding/json"
	"fmt"
	"slices"
	"sync"
)

// FieldType es el casteo que hay que aplicarle a un path antes de mandarlo a
// Mongo. Los VALORES de estas constantes son los mismos que usa
// gestion-datos-go en internal/db/query: eso es a propósito, para que el
// consumidor convierta de tipo y no traduzca tabla contra tabla.
type FieldType string

const (
	ObjectID      FieldType = "objectId"
	ObjectIDArray FieldType = "objectIdArray"
	Date          FieldType = "date"
	Number        FieldType = "number"
	Bool          FieldType = "bool"
	String        FieldType = "string"
	Uppercase     FieldType = "uppercase"
	Lowercase     FieldType = "lowercase"
)

// Virtual es un populate declarado: un schema.virtual() (que popula bajo OTRO
// nombre) o un @Prop({ref}) (que popula el path del id EN SU LUGAR). En el
// segundo caso LocalField es el nombre del path mismo.
//
// Ref es el nombre de la COLECCIÓN destino, no el del schema: la traducción
// (ClienteSchema → clientes) la hace este paquete leyendo el x-collection del
// schema referenciado.
type Virtual struct {
	Ref          string
	LocalField   string
	ForeignField string
	JustOne      bool
}

// Metadata es la metadata de persistencia de una entidad.
type Metadata struct {
	// Schema es el nombre del $def, ej. "ActivoSchema".
	Schema string
	// Collection es el nombre de la colección Mongo (x-collection).
	Collection string
	// Fields son los paths top-level del documento, ordenados. Sin _id.
	Fields []string
	// FieldTypes son los paths que necesitan casteo, incluidos los anidados
	// con punto (los filtros del front los usan).
	FieldTypes map[string]FieldType
	// ArrayFields son los paths top-level de tipo array, ordenados: Mongoose
	// los inicializa a [] en documentos nuevos.
	ArrayFields []string
	// SubSchemas son los paths top-level que son un sub-schema real con clase
	// propia, no un @Prop({type:Object}). Ordenados.
	SubSchemas []string
	// Virtuals son los populates declarados, por nombre.
	Virtuals map[string]Virtual
}

// Registro es el índice de todas las entidades del bundle.
type Registro struct {
	porColeccion map[string]*Metadata
	porSchema    map[string]*Metadata
	todas        []*Metadata
}

// PorColeccion busca una entidad por el nombre de su colección Mongo.
func (r *Registro) PorColeccion(nombre string) (*Metadata, bool) {
	m, ok := r.porColeccion[nombre]
	return m, ok
}

// PorSchema busca una entidad por el nombre de su schema zod ("ActivoSchema").
func (r *Registro) PorSchema(nombre string) (*Metadata, bool) {
	m, ok := r.porSchema[nombre]
	return m, ok
}

// Todas devuelve todas las entidades, ordenadas por colección.
func (r *Registro) Todas() []*Metadata { return r.todas }

// cargar construye el registro una sola vez. Se memoiza porque el bundle es
// inmutable (está embebido en el binario) y parsearlo por llamada sería tirar
// trabajo: son ~1,3 MB de JSON.
var cargar = sync.OnceValues(construirRegistro)

// Cargar devuelve el registro de entidades. Es seguro llamarlo desde varias
// goroutines y desde el boot.
func Cargar() (*Registro, error) { return cargar() }

func construirRegistro() (*Registro, error) {
	var b bundleJSON
	if err := json.Unmarshal(bundleCrudo, &b); err != nil {
		return nil, fmt.Errorf("el bundle embebido no parsea: %w", err)
	}
	if len(b.Defs) == 0 {
		return nil, fmt.Errorf("el bundle embebido no tiene $defs")
	}

	r := &Registro{
		porColeccion: map[string]*Metadata{},
		porSchema:    map[string]*Metadata{},
	}
	for nombre, def := range b.Defs {
		if def.Collection == "" {
			continue // no es una entidad
		}
		m := b.metadataDe(nombre, def)
		if otra, repetida := r.porColeccion[m.Collection]; repetida {
			return nil, fmt.Errorf(
				"la colección %q la declaran dos schemas (%s y %s): x-collection tiene que ser único",
				m.Collection, otra.Schema, m.Schema)
		}
		r.porColeccion[m.Collection] = m
		r.porSchema[nombre] = m
		r.todas = append(r.todas, m)
	}
	slices.SortFunc(r.todas, func(a, b *Metadata) int {
		if a.Collection < b.Collection {
			return -1
		}
		if a.Collection > b.Collection {
			return 1
		}
		return 0
	})
	return r, nil
}
