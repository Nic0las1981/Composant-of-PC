import importlib.util
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
D = ROOT / 'data/deep-review/gpu-followup/gigabyte'
spec = importlib.util.spec_from_file_location('followup_gigabyte', ROOT / 'scripts/deep-gpu-followup-gigabyte.py')
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)


class GigabyteFollowupEvidence(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.products = json.loads((D / 'products.json').read_text())
        cls.review = {x['id']: x for x in json.loads((D / 'review.json').read_text())}
        cls.proofs = {x['id']: x for x in json.loads((D / 'proofs.json').read_text())}

    def test_revision_comparison_withholds_fields_that_change(self):
        a = {'patch': {'lengthMm': 281, 'capacityGB': 8}, 'values': {'Core Clock': '1770 MHz', 'Memory Size': '8 GB'}}
        b = {'patch': {'lengthMm': 286, 'capacityGB': 8}, 'values': {'Core Clock': '1755 MHz', 'Memory Size': '8 GB'}}
        patch, values = M.common_facts([a, b])
        self.assertEqual(patch, {'capacityGB': 8})
        self.assertEqual(values, {'Memory Size': '8 GB'})
        card = self.products['import-gpu-52e2aaa95b6b']
        self.assertEqual(card['identityKind'], 'manufacturer-model')
        self.assertEqual(card['mpn'], '')
        self.assertFalse(any(row['label'] == 'Core Clock' for group in card['groups'] for row in group['rows']))
        self.assertEqual(len(self.proofs['import-gpu-52e2aaa95b6b']['sourceDocuments']), 2)

    def test_lhr_must_be_explicit_for_the_named_revision(self):
        # Rev 2.0 and 3.0 share their GV code. Only 3.0 says LHR.
        self.assertNotIn('import-gpu-f5a0817d5311', self.products)
        self.assertEqual(self.review['import-gpu-f5a0817d5311']['reason'], 'LHR_not_explicitly_confirmed_for_all_eligible_revisions')
        card = self.products['import-gpu-ad84ea9b3bbd']
        self.assertIn('Rev. 3.0', card['manufacturerModel'])
        self.assertEqual(card['patch']['lengthMm'], 281)
        self.assertEqual(card['mpn'], '')
        self.assertEqual(card['offers'], [])
        self.assertEqual(self.proofs['import-gpu-ad84ea9b3bbd']['sourceDocuments'][0]['revisions'], ['3.0'])

    def test_white_marketing_name_needs_actual_white_product_image(self):
        self.assertEqual(self.products['import-gpu-ee87f37e27bb']['mpn'], 'GV-N4080AERO OC-16GD')
        self.assertEqual(self.products['import-gpu-06f119ee831f']['mpn'], 'GV-N407SEAGLEOC ICE-12GD')
        for cid in ['import-gpu-7824bd6d66bd', 'import-gpu-24ad3cd55a34', 'import-gpu-e8b4ef0b09a4', 'import-gpu-da0d7332d880', 'import-gpu-f22d5ecfbb8f']:
            self.assertNotIn(cid, self.products, cid)
        for proof in self.proofs.values():
            if 'white' in (proof['archive'].get('color') or '').lower():
                self.assertTrue(proof['visualReferences'])
                self.assertTrue(all(x['visuallyInspected'] and x['inspectedFinish'] == 'white/silver' for x in proof['visualReferences']))

    def test_mixed_cooling_counts_are_not_inferred_from_a_subset(self):
        self.assertEqual(self.products['import-gpu-ee87f37e27bb']['patch']['fanCount'], 3)
        self.assertEqual(self.products['import-gpu-ee87f37e27bb']['patch']['fanSizeMm'], 110)
        # The 3080 sentence says 2 x 90 mm + 1 x 80 mm: no scalar size is invented.
        card = self.products['import-gpu-9cc835c8374c']
        self.assertNotIn('fanSizeMm', card['patch'])
        self.assertNotEqual(card['patch'].get('fanCount'), 2)
        self.assertTrue(any('2x 90mm and 1X80mm' in row['value'] for group in card['groups'] for row in group['rows']))

    def test_every_reviewed_card_has_an_outcome_and_numeric_facts_have_sources(self):
        self.assertEqual(len(self.review), 102)
        self.assertEqual(len(self.products), 55)
        for cid, card in self.products.items():
            self.assertEqual(self.review[cid]['state'], 'manufacturer_specs_enriched')
            if card['identityKind'] == 'manufacturer-model':
                self.assertEqual(card['offers'], [])
            for offer in card['offers']:
                self.assertEqual(offer['mpn'], card['mpn'])
            self.assertNotIn('powerW', card['patch'])
            for field in ['lengthMm', 'heightMm', 'thicknessMm', 'capacityGB', 'recommendedPsuW', 'fanCount', 'fanSizeMm']:
                if field in card['patch']:
                    self.assertEqual(card['fieldEvidence'][field]['value'], card['patch'][field])
                    source_url = card['fieldEvidence'][field]['sourceURL']
                    self.assertTrue(source_url.startswith('https://www.gigabyte.com/Graphics-Card/') or cid == 'import-gpu-f484f7fd45ed' and source_url == 'https://www.ldlc.com/fiche/PB00684438.html')
            for document in self.proofs[cid]['sourceDocuments']:
                source = json.loads((ROOT / document['path']).read_text())
                self.assertEqual(source['sha256'], document['sha256'])
                self.assertEqual(source['status'], 200)

    def test_archived_ldlc_price_is_not_presented_as_current(self):
        card = self.products['import-gpu-f484f7fd45ed']
        self.assertEqual(card['mpn'], 'GV-N5060EAGLEOC ICE-8GD')
        self.assertEqual([card['patch'][x] for x in ['lengthMm', 'heightMm', 'thicknessMm']], [208, 120, 40])
        self.assertEqual(card['patch']['fanCount'], 2)
        offer, = card['offers']
        self.assertEqual(offer['amount'], 529.95)
        self.assertEqual(offer['priceKind'], 'last_known')
        self.assertEqual(offer['availability'], 'discontinued')
        self.assertEqual(offer['mpn'], card['mpn'])
        self.assertFalse(any('amazon' in source['url'] for source in card['sources']))


if __name__ == '__main__':
    unittest.main()
