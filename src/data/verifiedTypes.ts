import type { Component } from './catalog.ts';

export interface VerifiedSource {
  name: string;
  url: string;
  checkedAt: string;
  kind: 'manufacturer' | 'retailer';
}
export interface VerifiedOffer {
  retailer: string;
  seller: string;
  url: string;
  productName: string;
  mpn: string;
  retailerReference?: string;
  amount: number;
  currency: 'EUR';
  market: 'FR';
  condition: 'new' | 'refurbished' | 'unknown';
  availability: 'in_stock' | 'out_of_stock' | 'discontinued' | 'unknown';
  priceKind: 'current' | 'last_known';
  shipping: number | null;
  shippingNote: string;
  checkedAt: string;
}
export interface VerifiedFieldEvidence {
  value: unknown;
  sourceURL: string;
  checkedAt: string;
  notApplicable?: boolean;
  reason?: string;
  /** Explicitly incompatible statements in the cited source remain unresolved. */
  conflicting?: boolean;
}
export interface VerifiedProduct {
  /** A documented model without a sales part number keeps mpn empty. */
  identityKind?: 'mpn' | 'manufacturer-model';
  manufacturerModel?: string;
  mpn: string;
  identityNote: string;
  sources: VerifiedSource[];
  groups: Array<{ title: string; rows: Array<{ label: string; value: string }> }>;
  patch: Partial<Component>;
  offers: VerifiedOffer[];
  notes: string[];
  fieldEvidence?: Record<string, VerifiedFieldEvidence>;
}

export function matchesProductIdentity(component: Component, product: VerifiedProduct | undefined): boolean {
  if (!product) return false;
  if (product.identityKind === 'manufacturer-model') return product.mpn === ''
    && Boolean(product.manufacturerModel?.trim()) && component.manufacturerModel === product.manufacturerModel;
  return Boolean(product.mpn.trim()) && component.manufacturerPartNumber?.trim().toUpperCase() === product.mpn.trim().toUpperCase();
}
