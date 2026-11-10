"""ASUS follow-up regressions: suffix identity and evidence attribution."""
import copy
import gzip
import json
from pathlib import Path
import runpy
import unittest

ROOT = Path(__file__).resolve().parents[1]
H = runpy.run_path(str(ROOT / 'scripts/deep-gpu-followup-asus.py'))
D = ROOT / 'data/deep-review/gpu-followup/asus'
PRODUCTS = json.loads((D / 'products.json').read_text())
PROOFS = {p['id']: p for p in json.loads((D / 'proofs.json').read_text())}
INPUT = {i['component']['id']: i for i in json.load(gzip.open(ROOT / 'data/deep-review/gpu/input.json.gz', 'rt'))}


class AsusFollowupTests(unittest.TestCase):
    def test_lhr_admission_requires_explicit_same_model_document(self):
        cid = 'import-gpu-beaa800ac2f2'
        proof = PROOFS[cid]
        self.assertIn('with LHR (lite hash rate)', proof['lhrProof']['quote'])
        self.assertEqual(H['model_key'](proof['source']['url']), H['model_key'](proof['lhrProof']['url']))
        facts = json.loads((ROOT / 'data/deep-review/gpu/board-brands/parsed.json').read_text())
        fact = next(p for p in facts if p['source']['url'] == proof['source']['url'])
        self.assertFalse(H['matching'](INPUT[cid], fact, [])[0])
        sibling = {'url': proof['lhrProof']['url'].replace('-v2-', '-v3-'), 'status': 200,
                   'text': proof['lhrProof']['quote'], 'checkedAt': proof['lhrProof']['checkedAt']}
        self.assertFalse(H['matching'](INPUT[cid], fact, [sibling])[0])

    def test_white_and_standard_v2_remain_separate(self):
        white = PRODUCTS['import-gpu-a354d38a4460']
        black = PRODUCTS['import-gpu-cb7bb9298707']
        self.assertEqual(white['mpn'], 'ROG-STRIX-RTX3070-O8G-WHITE-V2')
        self.assertEqual(black['mpn'], 'ROG-STRIX-RTX3070-O8G-V2-GAMING')
        self.assertNotEqual(white['mpn'], black['mpn'])

    def test_ambiguous_memory_and_conflicting_archive_stay_unresolved(self):
        for cid in ['import-gpu-5a55cf09062f', 'import-gpu-67f655477634',
                    'import-gpu-98f8d83aee15', 'import-gpu-e3e6254605db',
                    'import-gpu-ad2b07bc1551', 'import-gpu-171139639768',
                    'import-gpu-c255f436f24c', 'import-gpu-9dd8dc5c9e59']:
            self.assertNotIn(cid, PRODUCTS)

    def test_count_is_whole_cooler_and_every_geometry_field_is_evidenced(self):
        self.assertEqual(PRODUCTS['import-gpu-e86971fd0eb1']['patch']['fanCount'], 3)
        noctua = PRODUCTS['import-gpu-2c018702802b']
        self.assertEqual(noctua['patch']['fanCount'], 2)
        self.assertEqual(noctua['patch']['fanSizeMm'], 120)
        for cid, product in PRODUCTS.items():
            sources = {s['url'] for s in product['sources']}
            self.assertEqual(product['offers'], [], cid)
            self.assertNotIn('price', product['patch'], cid)
            self.assertNotIn('powerW', product['patch'], cid)
            for field in ['lengthMm', 'heightMm', 'thicknessMm', 'recommendedPsuW', 'capacityGB', 'fanCount', 'fanSizeMm']:
                if field in product['patch']:
                    evidence = product['fieldEvidence'][field]
                    self.assertEqual(evidence['value'], product['patch'][field], (cid, field))
                    self.assertIn(evidence['sourceURL'], sources, (cid, field))
            if product['identityKind'] == 'manufacturer-model':
                self.assertEqual(product['mpn'], '')
                self.assertNotIn('manufacturerPartNumber', product['patch'])

    def test_mpn_cannot_be_inferred_from_the_url(self):
        docs = H['read_exa']()
        doc = next(d for d in docs if d['url'].endswith('tuf-rtx5090-32g-gaming/techspec/'))
        self.assertEqual(H['parse_exa'](doc)['mpn'], '')
        doc = next(d for d in docs if d['url'].endswith('dual-rx7800xt-o16g/techspec/'))
        self.assertEqual(H['parse_exa'](doc)['mpn'], 'DUAL-RX7800XT-O16G')


if __name__ == '__main__':
    unittest.main()
