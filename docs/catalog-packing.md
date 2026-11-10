# Catalog data packing

The production Vite build stores large static catalog literals using per-module
string and object-key dictionaries. The application still receives ordinary,
synchronous JavaScript objects. No component, technical row, source, price,
filter field, or historical record is removed. No additional request or storage
service is introduced. Development sources and collectors are unchanged.

`build/catalogDataPlugin.ts` applies this optimization only to production builds
and only inside `src/data/`. It does not evaluate code. The literal reader leaves
expressions, spreads, getters, computed properties, sparse arrays, and prototype
setters untouched. Existing imports and the identity, quarantine, price and
compatibility merge logic remain in their original order.

`build/catalogDataPacking.ts` stores repeated strings once and represents objects
as a schema index plus their values. The small decoder in
`src/lib/unpackCatalogData.ts` restores independent objects and arrays. Explicit
`undefined` and negative zero have dedicated tags; strings beginning with the
reference marker are escaped. Values, types, property order, and mutability are
preserved. There is no shared-object interning between products.

Every transformed module undergoes a complete deep equality check during the
build. The emitted `catalog-packing-report.json` lists the input SHA-256, number
of literals and byte counts for each module. The sources archive includes the
`build/` directory so it can reproduce the optimization.

## Validation

```sh
npx tsx --test tests/catalogDataPacking.test.ts
npx tsc -b
npx vite build --outDir /tmp/forge-packed-site
FORGE_PACKING_MANIFEST=/tmp/forge-packed-site/catalog-packing-report.json \
  node --expose-gc --import tsx scripts/benchmark-catalog-packing.ts
```

The regression test also compiles every original supported catalog literal with
esbuild and compares its actual JavaScript value with the restored value. This
checks the literal reader independently of the encoder/decoder round trip.
Separate cases cover undefined patches, key order, escaping, mutation isolation,
unsupported expressions, and deterministic output.

Measurements from the November 10 validation are retained in
`release/catalog-packing-review/`. The same-source data benchmark covered 35
production modules and 138 literals. Five cold trials used distinct V8 source
cache keys and alternating execution order; the warm series deliberately reused
compiled code. The benchmark excludes React, rendering, and network time.

| Same-source data benchmark | Original | Packed |
| --- | ---: | ---: |
| Encoded JavaScript | 66.07 MB | 24.43 MB |
| Gzip, level 9 | 5.13 MB | 3.28 MB |
| Cold compilation + initialization, median | 1,037 ms | 463 ms |
| Warm code-cache initialization + compilation, median | 233 ms | 304 ms |

The smaller transfer and cold parse have a measurable benefit. Reconstruction
adds about 71 ms in this warm-cache benchmark. These local Node engine timings
do not predict every browser or device. The optimized application still loads
the full synchronous catalog; on-demand detail loading would be a separate
architecture change.

The resulting main Vite bundle was 22.60 MB raw / 3.38 MB gzip (level 9), compared
with 60.26 MB / 4.92 MB in the preceding validation build. Collection continued
between those builds, so the table above provides the controlled same-source
comparison. The 3D bundle was unchanged at 1.15 MB raw / 0.32 MB gzip.

The compacted static build passed desktop/mobile detailed search, documented
model identity without an invented MPN, photo loading/fallback, and assembled /
exploded 3D checks. Nine further browser checks passed for chronological order,
commercial families, brand/search combinations, pagination resets, RAM-slot
filters, detail/comparison navigation, and the 360 px layout. The source-level
data tests remain independent of packing.

## Remaining duplication

The older verified, manual, individual, and comprehensive layers contain about
4.77 MB of JSON records superseded by later layers. They are retained because
the current provenance notice directly imports those tables and some records
are still active. Precomputing the final merged catalog could remove this cost,
but requires a separate behavior-preserving change. This optimization does not
alter that architecture or remove reviewed evidence.
