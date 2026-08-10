// Copia el bundle JSON Schema a go/esquema/bundle.json, que es lo que embebe el
// módulo Go con go:embed.
//
// POR QUÉ UNA COPIA Y NO LEER dist/: `dist` está en .gitignore, y go:embed solo
// puede incluir archivos que estén en el árbol del módulo al momento de
// compilar. Un consumidor que hace `go get` recibe el repo tal como está
// commiteado — si el bundle no está commiteado, no hay bundle.
//
// La copia se mantiene honesta por el workflow bundle-go.yml, que regenera y
// falla si queda diff.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');
const origen = resolve(raiz, 'dist/json-schema/index.json');
const destino = resolve(raiz, 'go/esquema/bundle.json');

let crudo;
try {
  crudo = readFileSync(origen, 'utf8');
} catch {
  console.error(
    `falta el bundle: ${origen}\n` +
      'generarlo con: npm run build && npm run gen:json-schema',
  );
  process.exit(1);
}

const bundle = JSON.parse(crudo);

// x-generated-at es el único campo no determinista del bundle: cambia en cada
// regeneración aunque no cambien los schemas. Sacarlo acá permite que el
// workflow bundle-go.yml detecte diferencias reales (cambios en src/)
// sin falsos positivos por timestamps. El lado TypeScript lo mantiene intacto
// en dist/json-schema/index.json porque puede necesitarlo.
delete bundle['x-generated-at'];

const defs = bundle.$defs ?? {};
const entidades = Object.values(defs).filter((d) => d['x-collection']).length;
if (entidades < 80) {
  console.error(
    `el bundle tiene ${entidades} schemas con x-collection y esperaba al menos 80: ` +
      'no se copia un bundle incompleto sobre el que ya está commiteado',
  );
  process.exit(1);
}

mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(bundle, null, 1) + '\n');
console.error(
  `${Object.keys(defs).length} schemas (${entidades} entidades) → ${destino}`,
);
