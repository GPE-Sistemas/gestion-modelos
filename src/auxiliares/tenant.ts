/**
 * Devuelve cuál de los clientes de la jerarquía de un documento es el tenant
 * SEPARADO al que pertenece: el que tiene IP y bloque de puertos propios en
 * `gestion-api-alarmas`. `undefined` si ninguno lo es, que es el caso de la
 * enorme mayoría — esos entran por el ingreso compartido.
 *
 * `tenantsSeparados` es el conjunto de `_id` de los clientes de NIVEL 1 con
 * `config.tenant.numero` cargado. Quien llama lo mantiene: en `api-cache` vive
 * en memoria y se refresca con los eventos de `clientes`.
 *
 * **Por qué se pregunta por el conjunto y no por la posición en la jerarquía.**
 * La versión anterior tomaba `idsAncestros[1]`, apoyada en dos supuestos que no
 * están protegidos por ningún test ni constraint: que el orden es raíz→padre
 * (lo fija un único `append` en `ApplyClienteOnCreate` de gestion-datos-go) y
 * que hay exactamente un nivel por encima del nivel 1. Si cualquiera cambia, la
 * clave se sigue escribiendo pero prefijada con el cliente equivocado, y eso no
 * lo detecta nadie. Preguntar "¿cuál de estos está separado?" no depende de
 * ninguna posición: si mañana la jerarquía crece para arriba, sigue dando bien.
 *
 * Además es la pregunta que de verdad importa. El lector —`api-alarmas`—
 * conoce su cliente porque resolvió su número al arrancar, y quiere las alarmas
 * de ese subtree. El nivel nunca le importó.
 *
 * Recorre del más cercano al más lejano, así que si alguna vez hubiera tenants
 * anidados gana el más específico.
 *
 * Es función pura del documento y del conjunto: no lee la base. Por eso se
 * puede usar en el camino de escritura del cache, que corre una vez por
 * documento en cada sync completo.
 */
export function tenantDeDocumento(
  doc: { idCliente?: string; idsAncestros?: string[] } | undefined,
  tenantsSeparados: ReadonlySet<string>,
): string | undefined {
  if (!doc?.idCliente) return undefined;
  if (tenantsSeparados.has(doc.idCliente)) return doc.idCliente;
  const ancestros = Array.isArray(doc.idsAncestros) ? doc.idsAncestros : [];
  for (let i = ancestros.length - 1; i >= 0; i--) {
    if (tenantsSeparados.has(ancestros[i])) return ancestros[i];
  }
  return undefined;
}

/**
 * ¿Este cliente es un tenant separado? Es la condición de entrada al conjunto
 * de `tenantDeDocumento`, y vive acá para que la escriba una sola vez quien la
 * necesite.
 *
 * Exige nivel 1 además del número: el borde del tenant es el nivel 1 por
 * definición, y sin el chequeo un número cargado por error en el admin o en un
 * nivel 2 se colaría al conjunto y empezaría a capturar alarmas ajenas.
 *
 * El número tiene que ser mayor a cero: el 0 está reservado para el ingreso
 * compartido, así que un cliente con `numero: 0` NO está separado.
 */
export function esTenantSeparado(cliente?: {
  nivel?: number;
  config?: { tenant?: { numero?: number } };
}): boolean {
  return cliente?.nivel === 1 && (cliente?.config?.tenant?.numero ?? 0) > 0;
}

/**
 * Clave de Redis de una alarma por comunicador, scopeada al tenant. Es la que
 * escribe `gestion-api-cache` y la que lee `gestion-api-alarmas`: vive acá para
 * que no puedan divergir — si difieren, toda lectura falla el cache en silencio
 * y cae al fallback HTTP contra datos.
 *
 * La clave vieja `dispositivoalarmas:idUnicoComunicador:<X>` sigue existiendo
 * durante la transición: sin tenant, dos clientes con el mismo comunicador se
 * pisan.
 */
export function keyAlarmaPorComunicador(
  tenant: string,
  idUnicoComunicador: string,
): string {
  return `dispositivoalarmas:tenant:${tenant}:idUnicoComunicador:${idUnicoComunicador}`;
}
