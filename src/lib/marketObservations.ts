import type { Component } from "../data/catalog.ts";
import {
  MARKET_MAPPINGS,
  marketObservations,
  type MarketMapping,
  type MarketObservation,
} from "../data/marketObservations.ts";

export type { MarketObservation } from "../data/marketObservations.ts";

const mappingsById = new Map(MARKET_MAPPINGS.map(mapping => [mapping.component.id, mapping]));

/** A changed identity requires a new audit, even when the saved ID is reused. */
export function matchesMarketMapping(component: Component, mapping: MarketMapping): boolean {
  const expected = mapping.component;
  return component.id === expected.id &&
    component.category === expected.category &&
    component.brand === expected.brand &&
    component.name === expected.name &&
    (component.finishName ?? null) === expected.finishName &&
    (component.manufacturerPartNumber ?? null) === expected.manufacturerPartNumber;
}

/** No requests, conversion, price mutation or substitution of another variant. */
export function getMarketObservation(component: Component | null | undefined): MarketObservation | null {
  if (!component) return null;
  const mapping = mappingsById.get(component.id);
  if (!mapping || !matchesMarketMapping(component, mapping)) return null;
  return Object.hasOwn(marketObservations, component.id) ? marketObservations[component.id] : null;
}
