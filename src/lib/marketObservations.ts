import type { Component } from "../data/catalog.ts";
import { getVerifiedProduct } from './verifiedOffers.ts';
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
  // A newly confirmed primary MPN may strengthen an existing audited match
  // only when it is the exact part number already present in that snapshot.
  // This does not redate its price or admit an unrelated replacement identity.
  const confirmed=getVerifiedProduct(component);
  const newlyConfirmed=expected.manufacturerPartNumber===null
    && Boolean(mapping.sourcePart.manufacturerPartNumber)
    && component.manufacturerPartNumber===mapping.sourcePart.manufacturerPartNumber
    && confirmed?.mpn===component.manufacturerPartNumber
    && confirmed.sources.some(source=>source.kind==='manufacturer');
  return component.id === expected.id &&
    component.category === expected.category &&
    component.brand === expected.brand &&
    component.name === expected.name &&
    (component.finishName ?? null) === expected.finishName &&
    ((component.manufacturerPartNumber ?? null) === expected.manufacturerPartNumber || newlyConfirmed);
}

/** No requests, conversion, price mutation or substitution of another variant. */
export function getMarketObservation(component: Component | null | undefined): MarketObservation | null {
  if (!component) return null;
  const mapping = mappingsById.get(component.id);
  if (!mapping || !matchesMarketMapping(component, mapping)) return null;
  return Object.hasOwn(marketObservations, component.id) ? marketObservations[component.id] : null;
}
