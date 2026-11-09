import { catalog, type CategoryId, type Component, type Selection } from "../data/catalog.ts";

/** A product model with real, independently selectable retail finishes.
 * Variant IDs stay unchanged: saved builds, per-slot RAM, prices and visual
 * profiles always refer to the actual chosen Component, never to this group.
 */
export interface VariantGroup {
  id: string;
  name: string;
  category: CategoryId;
  variants: Component[];
}

/** Only explicit, audited metadata can collapse variants. Similar names,
 * capacity, prices or a shared commercial family are never enough.
 */
export function getVariantGroupId(component: Component): string {
  const declared = component.variantGroupId?.trim();
  return declared ? `${component.category}:group:${declared}` : `${component.category}:variant:${component.id}`;
}

/** Can group a filtered subset without reintroducing excluded variants.
 * Input order is retained so a caller can sort/filter the real variants first.
 */
export function groupVariants(components: readonly Component[]): VariantGroup[] {
  const groups = new Map<string, VariantGroup>();
  const seen = new Set<string>();
  for (const component of components) {
    if (seen.has(component.id)) continue;
    seen.add(component.id);
    const id = getVariantGroupId(component);
    let group = groups.get(id);
    if (!group) {
      group = {
        id,
        name: component.variantGroupName?.trim() || component.name,
        category: component.category,
        variants: [],
      };
      groups.set(id, group);
    }
    group.variants.push(component);
  }
  return [...groups.values()];
}

const catalogGroups = groupVariants(catalog);
const groupsById = new Map(catalogGroups.map((group) => [group.id, group]));
const groupsByComponentId = new Map(catalogGroups.flatMap((group) => group.variants.map((variant) => [variant.id, group] as const)));

export function getCatalogGroups(category?: CategoryId): VariantGroup[] {
  return category ? catalogGroups.filter((group) => group.category === category) : [...catalogGroups];
}

/** Accepts a component, a real variant ID or an already resolved group ID. */
export function getVariantGroup(componentOrId: Component | string | null | undefined): VariantGroup | undefined {
  if (!componentOrId) return undefined;
  if (typeof componentOrId === "string") return groupsByComponentId.get(componentOrId) ?? groupsById.get(componentOrId);
  return groupsByComponentId.get(componentOrId.id) ?? groupsById.get(getVariantGroupId(componentOrId));
}

/** Never invent a black/white retail finish from a schematic render colour. */
export function getVariantLabel(component: Component): string {
  return component.finishName?.trim() || "Coloris non renseigné";
}

/** Preserve an already chosen colour whenever it belongs to the displayed
 * group. Otherwise retain stable catalogue order; an unknown price is not a
 * reason to pick a supposedly cheaper finish.
 */
export function getDefaultVariant(group: VariantGroup, selected?: string | null | Selection): Component {
  const selectedId = typeof selected === "object" && selected !== null ? selected[group.category] : selected;
  const current = selectedId ? group.variants.find((variant) => variant.id === selectedId) : undefined;
  const fallback = group.variants[0];
  if (!fallback) throw new Error("Un groupe de variantes doit contenir au moins une référence");
  return current ?? fallback;
}

