# Samsung OEM memory evidence

The five exact OEM MPN pages were fetched individually from Samsung and
CompuRAM. All five historical Samsung URLs currently redirect to
`https://semiconductor.samsung.com/dram/ddr/`, whose content does not identify
these MPNs. They are retained as failed primary-source attempts, not admitted
as exact product evidence. The CompuRAM tables identify each complete MPN,
capacity, rank count, chip arrangement, voltage, UDIMM format and 31.25 mm
height independently. The generated records label CompuRAM as a retailer.

No offers, extrapolated MPNs, assumed lengths, board thicknesses, memory-channel
counts or exact manufacturer images were added. The pre-existing public-SPD
provenance and CL22 value remain in the catalogue. New output does not promote
that independent SPD source into a Samsung manufacturer document.

Regenerate from saved evidence:

```sh
python data/deep-review/memory-storage/samsung/generate-oem.py
```

Refresh the observed URLs before regeneration:

```sh
python data/deep-review/memory-storage/samsung/collect-native.py data/deep-review/memory-storage/samsung/manufacturer-urls.json
python data/deep-review/memory-storage/samsung/collect-native.py data/deep-review/memory-storage/samsung/retailer-urls.json
```

Search review rejected this misleading result:
`https://www.semiconductorsamsung.com/datasheet/semiconductorsamsung/M378A1K43EB2-CWE.pdf`.
This is not the official `semiconductor.samsung.com` domain. More decisively,
the document content identifies B-die M378A1K43BB1/BB2 and M378A2K43BB1,
not the E-die M378A1K43EB2/CWE in the URL. Its dimensions and timing tables
must not be transferred to the requested MPN.

The Samsung public product-finder JavaScript identifies these read endpoints:
`/aemapi/semi/categoryIconList`, `/aemapi/semi/iaFindList`,
`/aemapi/semi/disconPrdList`, `/aemapi/semi/productSpecs`, and
`https://search.semiconductor.samsung.com/semi/search/query`.
Observed category IDs: DRAM 109, DDR 110, DDR4 139. Exact and M378-prefix
queries in the current search index returned no matches; this is not proof
that the parts do not exist. A public primary document has not been recovered.

The snapshot includes every Samsung memory/storage component: 5 OEM RAM and
28 SSD entries. SSD work was explicitly handed back to the parent after
prioritizing the five OEM modules. `audit.json` labels those 28 as delegated,
not reviewed or completed. The quarantined 990 EVO Plus 4 TB entry
`import-ssd-c684100ebdf8` must not reuse the old 2 TB MZ-V9S2T0BW mapping.
