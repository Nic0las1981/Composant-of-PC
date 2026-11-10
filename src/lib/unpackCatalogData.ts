/** Build-time catalog compression changes storage only, never the data API.
 * Every object/array is reconstructed independently so callers may still mutate
 * a patch without changing another record. Only immutable strings are shared.
 */
export function unpackCatalogData(payload: string): unknown[] {
  const [strings, schemas, roots] = JSON.parse(payload) as [string[], string[][], unknown[]];
  function unpack(value: unknown): unknown {
    if (typeof value === 'string') {
      if (!value.startsWith('~')) return value;
      return value.startsWith('~~') ? value.slice(1) : strings[parseInt(value.slice(1), 36)];
    }
    if (!Array.isArray(value)) return value;
    const kind = value[0] as number;
    if (kind === -2) return undefined;
    if (kind === -3) return -0;
    if (kind === -1) {
      const result = new Array<unknown>(value.length - 1);
      for (let index = 1; index < value.length; index++) result[index - 1] = unpack(value[index]);
      return result;
    }
    const keys = schemas[kind];
    const result: Record<string, unknown> = {};
    for (let index = 0; index < keys.length; index++) result[keys[index]] = unpack(value[index + 1]);
    return result;
  }
  return roots.map(unpack);
}
