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
}
export interface VerifiedProduct {
  mpn: string;
  identityNote: string;
  sources: VerifiedSource[];
  groups: Array<{ title: string; rows: Array<{ label: string; value: string }> }>;
  patch: Partial<Component>;
  offers: VerifiedOffer[];
  notes: string[];
  fieldEvidence?: Record<string, VerifiedFieldEvidence>;
}
