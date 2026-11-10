# Gigabyte motherboard evidence

All 381 Gigabyte motherboard IDs in the retained input snapshot are matched to official manufacturer model pages. The collection contains 575 specification pages, including PCB revisions, and 10,412 technical sections attached to the catalogue IDs. Each ID has at least one manufacturer-provided product-photo URL; these URLs have not been visually inspected and do not constitute a fidelity certification.

Discovery uses the complete public Global consumer-products sitemap and the revision links exposed on specification pages. It does not call private APIs or the disallowed legacy crawler endpoints. Three missing names were resolved with 15 Exa search results followed by native page verification: the manufacturer's explicit B650E A PRO X USB4 alias, GA-AB350M-DS3H V2 revision 1.1, and the GA-A320MA-M.2 URL which omits the dot. The original input snapshot, discovery evidence, dated page receipts, response hashes and compressed native HTML are retained here.

Every official section is retained, including CPU restrictions, chipset, memory, display outputs, audio, LAN/WLAN, expansion slots, storage, USB, internal and rear I/O, hardware monitoring, BIOS, software, operating systems, physical format/dimensions and manufacturer remarks. Public source wording is retained inside the technical groups; section headings are translated.

An exact model does not identify an unspecified PCB revision. 108 catalogue IDs have multiple retrieved revision pages. Their tables remain explicitly separated. Only metadata values identical across the retrieved revisions are projected into compatibility fields. Revision-sensitive fields are explicitly cleared with `undefined` when necessary, rather than inheriting an older archive value. Textual differences remain available for review. The evidence map assigns a source to each field that is common across revisions; it never interprets two different tables as equal by fuzzy matching.

M.2 counts use each explicit storage connector paragraph. Wi-Fi/Key E and SATA-only connectors are excluded. CPU-dependent lane and availability conditions remain in the source text. DIMM capacity is extracted only from an explicit `single DIMM capacity` statement, never by dividing total capacity by slot count. Dimensions are converted from the manufacturer's stated centimetres. Unsupported socket or DDR enum values are not forced into the application schema.

Previously reviewed offers are preserved with their original seller, date, state and price; no new or refreshed price is invented by this manufacturer collection. New model-only records have no offer. Existing reviewed MPNs are retained; otherwise the manufacturer's exact model identifier is used without inventing a regional retailer SKU or PCB revision.

Reproduce from the retained input and HTTP receipts:

```sh
python scripts/gigabyte-motherboard-deep.py --reparse --build
python tests/gigabyte-motherboard-deep.test.py
```

Fetch missing public receipts, following linked revisions:

```sh
python scripts/gigabyte-motherboard-deep.py --fetch --reparse --build
```

The generated module is `src/data/deepGigabyteMotherboards.ts`, export `deepGigabyteMotherboardProducts`. The per-ID ledger is `per-id.json`; `photos.json` contains the precise image/source/model/revision associations. `summary.json` measures coverage of official model documents, not universal compatibility or purchasable current offers.
