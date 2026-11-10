# ASUS GPU follow-up, 10 November 2026

This isolated pass audits the 176 ASUS entries marked `exact_reference_unconfirmed` in the baseline GPU review. It publishes 28 newly documented entries: 14 printed MPN identities and 14 manufacturer-model identities. Twenty admissions include an explicit LHR statement on the feature page of the same model. Fourteen cards gain a written fan count; the non-OC RTX 3070 Noctua also gains its explicitly published 120 mm fan diameter.

The evidence combines the saved official ASUS specification and feature pages with 19 additional full Exa document reads. Ten Exa discovery searches requested 50 results; search highlights are discovery evidence only, never specification input. Original source hashes, paths, exact identity decisions and LHR/cooling quotes are in `proofs.json`. The generator reads all baseline files without rewriting them.

The remaining 148 entries stay unresolved. Capacity, GPU, OC, V2, EVO, MINI, WHITE and other edition tokens must match. LHR is admitted only when the same model page explicitly states it. RTX 4070 EVO GDDR6/GDDR6X and TUF RTX 3060 Ti memory variants remain ambiguous; no matching by archive length chooses a memory revision. Conflicting archive dimensions or clocks remain unresolved, including RX 7600 Dual OC V2, RTX 3080 Ti TUF OC, RTX 3080 Noctua and the erroneous ASUS GTX 1660 Ti dimension units.

No retail price is published in this pass. Imported prices and reference-GPU consumption are not transferred. A PSU recommendation remains distinct from GPU consumption. A source URL containing a SKU cannot by itself create an MPN; the code must be printed in the page body.

Rebuild and validate:

```sh
python scripts/deep-gpu-followup-asus.py
python tests/deep-gpu-followup-asus.test.py
```

The five regression tests cover same-model LHR evidence, white/V2 identity, ambiguous memory and contradictory archives, fan/geometry attribution, and refusing to infer an MPN from the URL. `products.json` is an isolated `Record<string, VerifiedProduct>` payload for the parent agent to merge into its follow-up module.
