import type { Component } from "../data/catalog.ts";
import { getReleaseInfo, type ReleaseInfo } from "../data/releaseTimeline.ts";

export type ChronologyDirection = "newest" | "oldest";

/** Unknown releases remain last in both directions. Missing month/day never
 * becomes a fabricated January 1: undetailed entries follow dated entries of
 * the same year (or month), with a stable alphabetical tie-breaker.
 */
export function compareReleaseInfo(left: ReleaseInfo | null, right: ReleaseInfo | null, direction: ChronologyDirection = "newest"): number {
  if (!left || !right) return left ? -1 : right ? 1 : 0;
  const sign = direction === "newest" ? -1 : 1;
  for (const field of ["year", "month", "day"] as const) {
    const a = left[field], b = right[field];
    if (a === undefined || b === undefined) return a === undefined ? b === undefined ? 0 : 1 : -1;
    if (a !== b) return sign * (a - b);
  }
  return 0;
}

export function compareByRecency(left: Component, right: Component, direction: ChronologyDirection = "newest"): number {
  return compareReleaseInfo(getReleaseInfo(left), getReleaseInfo(right), direction)
    || left.brand.localeCompare(right.brand, "fr")
    || left.name.localeCompare(right.name, "fr", { numeric: true })
    || left.id.localeCompare(right.id);
}

export function releaseDateLabel(release: ReleaseInfo): string {
  if (!release.month) return String(release.year);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric", month: "long", ...(release.day ? { day: "numeric" as const } : {}), timeZone: "UTC",
  }).format(new Date(Date.UTC(release.year, release.month - 1, release.day ?? 1)));
}

export function releaseBadge(release: ReleaseInfo | null): string {
  if (!release) return "Année non renseignée";
  return `${release.basis === "model" ? "Modèle" : release.basis === "generation" ? "Génération" : "Gamme"} · ${releaseDateLabel(release)}`;
}
