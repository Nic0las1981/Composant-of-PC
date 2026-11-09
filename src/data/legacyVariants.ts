import type { Component } from "./catalog.ts";

/** Audited colour-only pairs in the initial, hand-documented catalogue.
 * This is applied before ID indexes are built. Neither the original IDs nor
 * their prices, visual profiles and technical metadata are replaced.
 *
 * Do not group the black Liquid Freezer III with its white A-RGB version, or
 * assume the white Vengeance kit has the documented EXPO profile of the black
 * kit. Those differences need a separate, evidenced product variant definition.
 */
export const legacyVariantMetadata: Record<string, Pick<Component, "variantGroupId" | "variantGroupName" | "finishName">> = {
  "case-4000d": {
    variantGroupId: "legacy-case-corsair-4000d-airflow",
    variantGroupName: "4000D Airflow",
    finishName: "Noir",
  },
  "case-4000d-white": {
    variantGroupId: "legacy-case-corsair-4000d-airflow",
    variantGroupName: "4000D Airflow",
    finishName: "Blanc",
  },
  "case-north": {
    variantGroupId: "legacy-case-fractal-north-tempered-glass",
    variantGroupName: "North · Verre trempé",
    finishName: "Charcoal Black",
  },
  "case-north-white": {
    variantGroupId: "legacy-case-fractal-north-tempered-glass",
    variantGroupName: "North · Verre trempé",
    finishName: "Chalk White",
  },
};
