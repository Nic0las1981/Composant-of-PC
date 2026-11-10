import ts from 'typescript';
import {isDeepStrictEqual} from 'node:util';
import {unpackCatalogData} from '../src/lib/unpackCatalogData.ts';

type Literal = undefined | null | boolean | number | string | Literal[] | {[key: string]: Literal};
const unsupported = Symbol('not a static literal');

/** Interpret literals, not JavaScript. Expressions, spreads, getters, holes and
 * references remain untouched; no generator or collected source is executed.
 */
function readLiteral(node: ts.Expression): Literal {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) {
    const number = Number(node.text);
    if (!Number.isFinite(number)) throw unsupported;
    return number;
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return readLiteral(node.expression);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) {
    const number = -Number(node.operand.text);
    if (!Number.isFinite(number)) throw unsupported;
    return number;
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(readLiteral);
  if (ts.isObjectLiteralExpression(node)) {
    const result: {[key: string]: Literal} = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) throw unsupported;
      const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) || ts.isNumericLiteral(property.name)
        ? property.name.text : null;
      // __proto__ has special semantics in an object literal. Such literals are
      // deliberately left as code instead of being treated as ordinary data.
      if (key === null || key === '__proto__') throw unsupported;
      result[key] = readLiteral(property.initializer);
    }
    return result;
  }
  throw unsupported;
}

/** Schema keys and repeated string values are stored once per module. Numeric
 * values retain their type; undefined and negative zero have explicit tags.
 * Repeated objects are not interned, preserving their independent identity.
 */
export function packCatalogData(roots: unknown[]): string {
  const counts = new Map<string, number>();
  function count(value: unknown) {
    if (typeof value === 'string') counts.set(value, (counts.get(value) ?? 0) + 1);
    else if (value && typeof value === 'object') Object.values(value).forEach(count);
  }
  roots.forEach(count);
  const strings = [...counts]
    .filter(([value, count]) => count > 1 && (JSON.stringify(value).length - 7) * count > JSON.stringify(value).length + 10)
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value);
  const stringIds = new Map(strings.map((value, index) => [value, index]));
  const schemas: string[][] = [];
  const schemaIds = new Map<string, number>();
  function pack(value: unknown): unknown {
    if (value === undefined) return [-2];
    if (Object.is(value, -0)) return [-3];
    if (typeof value === 'string') {
      const index = stringIds.get(value);
      return index === undefined ? (value.startsWith('~') ? `~${value}` : value) : `~${index.toString(36)}`;
    }
    if (!value || typeof value !== 'object') return value;
    if (Array.isArray(value)) return [-1, ...value.map(pack)];
    const keys = Object.keys(value);
    if (keys.includes('__proto__')) throw new Error('Catalog packing does not support __proto__ properties');
    const signature = JSON.stringify(keys);
    let index = schemaIds.get(signature);
    if (index === undefined) {
      index = schemas.length;
      schemas.push(keys);
      schemaIds.set(signature, index);
    }
    return [index, ...keys.map(key => pack((value as Record<string, unknown>)[key]))];
  }
  const data = roots.map(pack);
  const payload = JSON.stringify([strings, schemas, data]);
  if (!isDeepStrictEqual(unpackCatalogData(payload), roots)) throw new Error('Catalog packing changed a data value');
  return payload;
}

export interface PackedDataModule {
  code: string;
  payload: string;
  originalLiterals: string[];
  roots: unknown[];
  literalCount: number;
  originalBytes: number;
  packedBytes: number;
}

/** Transform only large top-level data initializers. Imports and merging,
 * quarantine, identity, pricing and compatibility logic keep their order.
 */
export function packDataModule(source: string, filename: string, decoderImport: string, minimumLiteralSize = 10_000): PackedDataModule | null {
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  // Generated data never shadows undefined. If a future module does, keep it
  // entirely unchanged rather than interpreting that identifier incorrectly.
  let shadowsUndefined = false;
  function inspect(node: ts.Node) {
    if ((ts.isVariableDeclaration(node) || ts.isParameter(node) || ts.isImportSpecifier(node) || ts.isBindingElement(node)
      || ts.isImportClause(node) || ts.isNamespaceImport(node) || ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)
      || ts.isFunctionExpression(node) || ts.isClassExpression(node))
      && node.name && ts.isIdentifier(node.name) && node.name.text === 'undefined') shadowsUndefined = true;
    ts.forEachChild(node, inspect);
  }
  if (source.includes('undefined')) inspect(ast);
  if (shadowsUndefined) return null;
  const candidates: Array<{start: number; end: number; value: Literal; literal: string}> = [];
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      const initializer = declaration.initializer;
      if (!initializer || initializer.end - initializer.pos < minimumLiteralSize) continue;
      try {
        const value = readLiteral(initializer);
        candidates.push({start: initializer.getStart(ast), end: initializer.end, value, literal: initializer.getText(ast)});
      } catch (error) {
        if (error !== unsupported) throw error;
      }
    }
  }
  if (!candidates.length) return null;
  const roots = candidates.map(candidate => candidate.value);
  const payload = packCatalogData(roots);
  let prefix = '__forgePackedCatalog';
  while (source.includes(prefix)) prefix += '_';
  let code = source;
  for (let index = candidates.length - 1; index >= 0; index--) {
    const candidate = candidates[index];
    code = code.slice(0, candidate.start) + `${prefix}[${index}]` + code.slice(candidate.end);
  }
  code = `import {unpackCatalogData as ${prefix}Unpack} from ${JSON.stringify(decoderImport)};\nconst ${prefix}=${prefix}Unpack(${JSON.stringify(payload)});\n${code}`;
  if (Buffer.byteLength(code) >= Buffer.byteLength(source)) return null;
  return {code, payload, roots, originalLiterals: candidates.map(candidate => candidate.literal), literalCount: candidates.length,
    originalBytes: Buffer.byteLength(source), packedBytes: Buffer.byteLength(code)};
}
