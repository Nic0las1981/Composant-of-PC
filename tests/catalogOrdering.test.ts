import test from "node:test";
import assert from "node:assert/strict";
import type { ReleaseInfo } from "../src/data/releaseTimeline.ts";
import { compareReleaseInfo, releaseDateLabel, releaseBadge } from "../src/lib/catalogOrdering.ts";

const year = (value: number, month?: number, day?: number): ReleaseInfo => ({ year: value, month, day, basis: "model", label: "Modèle de test" });

test("chronology orders known releases in either direction and always leaves undated entries last", () => {
  const values = [null, year(2022), year(2025), null, year(2024)];
  assert.deepEqual([...values].sort((a, b) => compareReleaseInfo(a, b)).map(value => value?.year ?? null), [2025, 2024, 2022, null, null]);
  assert.deepEqual([...values].sort((a, b) => compareReleaseInfo(a, b, "oldest")).map(value => value?.year ?? null), [2022, 2024, 2025, null, null]);
  assert.deepEqual(values.map(value => value?.year ?? null), [null, 2022, 2025, null, 2024]);
});

test("known months distinguish releases in the same year without inventing January for a missing month", () => {
  const values = [year(2024), year(2024, 1), year(2024, 11), year(2023, 12)];
  assert.deepEqual([...values].sort((a, b) => compareReleaseInfo(a, b)), [values[2], values[1], values[0], values[3]]);
  assert.deepEqual([...values].sort((a, b) => compareReleaseInfo(a, b, "oldest")), [values[3], values[1], values[2], values[0]]);
});

test("chronological comparison remains antisymmetric and transitive across mixed precisions", () => {
  const values = [null, year(2024), year(2024, 1), year(2024, 1, 5), year(2024, 11), year(2023, 12)];
  for (const direction of ["newest", "oldest"] as const) {
    for (const a of values) for (const b of values) {
      assert.equal(Math.sign(compareReleaseInfo(a, b, direction)) + Math.sign(compareReleaseInfo(b, a, direction)), 0);
      for (const c of values) {
        if (compareReleaseInfo(a, b, direction) <= 0 && compareReleaseInfo(b, c, direction) <= 0) assert.ok(compareReleaseInfo(a, c, direction) <= 0);
      }
    }
  }
});

test("labels disclose whether a year describes a model, generation or commercial series", () => {
  assert.equal(releaseDateLabel(year(2024)), "2024");
  assert.equal(releaseDateLabel(year(2024, 11)), "novembre 2024");
  assert.equal(releaseDateLabel(year(2024, 11, 7)), "7 novembre 2024");
  assert.equal(releaseBadge(year(2024)), "Modèle · 2024");
  assert.equal(releaseBadge(year(2024, 11)), "Modèle · novembre 2024");
  assert.equal(releaseBadge({ ...year(2024), basis: "generation" }), "Génération · 2024");
  assert.equal(releaseBadge({ ...year(2024), basis: "series" }), "Gamme · 2024");
  assert.equal(releaseBadge(null), "Année non renseignée");
});
