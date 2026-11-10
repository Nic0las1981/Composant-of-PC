# GPU followup — 2026-11-10

This followup adds **122 individually verified GPU records** without modifying or
replacing the 1,733 records in `gpu/products.json`. All 122 had the baseline state
`exact_reference_unconfirmed`. The combined primary-source coverage is 1,855 of
2,474 GPUs; 608 of the baseline 730 unresolved identities remain unresolved.
The 11 previously confirmed records outside the primary extractor are unchanged.

Of the baseline unresolved population, **364 records were individually rechecked**:
176 ASUS, 102 Gigabyte, 84 MSI, and two exact PNY professional MPNs. The full ledger
in `review.json` distinguishes rechecked cases from cases not revisited in this pass.

| Brand | Newly verified | Commercial MPN | Manufacturer model only |
| --- | ---: | ---: | ---: |
| ASUS | 28 | 14 | 14 |
| Gigabyte | 55 | 21 | 34 |
| MSI | 37 | 0 | 37 |
| PNY | 2 | 2 | 0 |
| Total | 122 | 37 | 85 |

The additions contain **727 field evidence records**, **2,586 specification rows**,
49 explicit fan counts and 33 explicit fan diameters. Numbers come from complete
manufacturer documents, except the LDLC dimensions/fan count for its exact printed
Gigabyte MPN. No board power is inferred from a recommended system PSU or from TDP.

## Evidence and exclusions

- ASUS: complete model/capacity/suffix equality, 20 explicit LHR statements from
  the matching manufacturer's product page, and written cooling descriptions.
  GDDR6/GDDR6X ambiguity, differing revisions and archive conflicts stay unresolved.
  `asus/final-consistency-check.json` records the check against baseline identities
  and the agreement of eligible numeric specifications.
- Gigabyte: 624 technical tables and 112 feature documents examined, with 33
  official photographs visually inspected for finish. Twenty named revisions are
  confirmed; fourteen archives without revisions publish only facts common to all
  linked manufacturer revisions. Shared GV codes are not sold as invented
  revision-specific MPNs. Mixed fan sizes remain text, and two outer fans are never
  mistaken for a complete two-fan cooling system.
- MSI: 722 complete source documents examined, 694 technical tables parsed.
  Reversed label menus and the explicit `Memory Size` spelling are parsed without
  joining the GPU name to another value. The URL slug and printed model must agree;
  stale OCV1 pages presenting another model are rejected. Full model, capacity,
  OC/revision/VRAM, archive length and clock must agree. Existing quarantine and
  finish collisions remain blocked. All 37 retained cards have explicit three-axis
  dimensions, board power and recommended system PSU. SEA HAWK card dimensions are
  kept separate from its radiator and tube dimensions.
- PNY: the two original names contain the exact printed commercial MPN.
  `VCNRTX2000ADA-PB` and `VCNRTX4000ADALP-PB` use labelled 2.7-inch H × 6.6-inch L
  dimensions (68.58 × 167.64 mm). Neither millimetre thickness nor system PSU is
  inferred from `Dual Slot` or 70 W board power. Manufacturer datasheets are already
  archived under `gpu/secondary/sources` and cited by `professional/proofs.json`.

There is **one historical offer**, not a current purchasable price: LDLC
`PB00684438`, exact MPN `GV-N5060EAGLEOC ICE-8GD`, **529.95 EUR**, explicitly marked
`last_known` and `discontinued`. The page says `Dernier prix` and `Muséericorde`.
An Amazon snippet dated April was excluded. One subsequent Exa price search hit
HTTP 429; its saved error is not used as evidence or an offer. No imported archive
price or another SKU's offer is attached.

## Integration

`src/data/deepGpuFollowupCatalog.ts` exports `deepGpuFollowupProducts`. It is ready
to spread after `deepGpuProducts` in the parent-controlled `deepCatalog.ts`.
Every entry is a complete `VerifiedProduct` with groups, sources, notes, evidence,
patch and offers. Baseline confirmed records are asserted disjoint, so their
technical groups and evidence are preserved. Runtime assignments clear unknown
commercial MPNs and absent dimensions/power/fan fields, preventing an imported
archive value from surviving as a supposedly confirmed specification.

## Reproduction and validation

```sh
python scripts/deep-gpu-followup-asus.py
python scripts/deep-gpu-followup-gigabyte.py build
python scripts/deep-gpu-followup-local.py
python scripts/deep-gpu-followup-professional.py
python scripts/build-deep-gpu-followup.py
python tests/deep-gpu-followup-asus.test.py
python tests/deep-gpu-followup-gigabyte.test.py
python tests/deep-gpu-followup-local.test.py
npx tsx --test tests/deepGpuFollowupCatalog.test.ts
```

The generated summary and complete outcome ledger are in `summary.json` and
`review.json`. Baseline data, `deepCatalog.ts`, unrelated agent files, git commits,
and deployment are owned by the parent task and were not modified here.
