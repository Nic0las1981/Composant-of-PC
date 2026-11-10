import copy
import gzip
import json
from pathlib import Path
import runpy
import unittest

ROOT=Path(__file__).resolve().parents[1]
H=runpy.run_path(str(ROOT/'scripts/deep-gpu-followup-local.py'))
PRODUCTS=json.loads((ROOT/'data/deep-review/gpu-followup/local/products.json').read_text())
FACTS=json.loads((ROOT/'data/deep-review/gpu-followup/local/parsed-facts.json').read_text())
INPUT={x['component']['id']:x for x in json.load(gzip.open(ROOT/'data/deep-review/gpu/input.json.gz','rt'))}

class FollowupGpuTests(unittest.TestCase):
    def test_reversed_menu_recovers_non_oc_aero_without_inventing_sku(self):
        p=PRODUCTS['import-gpu-d41bb5dbed89']
        self.assertEqual(p['patch']['lengthMm'],175)
        self.assertEqual(p['patch']['powerW'],160)
        self.assertEqual(p['patch']['recommendedPsuW'],500)
        self.assertEqual(p['identityKind'],'manufacturer-model')
        self.assertEqual(p['mpn'],'')
        self.assertNotIn('manufacturerPartNumber',p['patch'])
        self.assertEqual(p['offers'],[])

    def test_memory_size_and_card_radiator_dimensions_are_separate(self):
        p=PRODUCTS['import-gpu-de4c76e01054']
        self.assertEqual(p['patch']['capacityGB'],11)
        self.assertEqual([p['patch'][k] for k in ['lengthMm','heightMm','thicknessMm']],[268,114,41])
        row=next(r for g in p['groups'] for r in g['rows'] if r['label']=='Card Dimension (mm)')
        self.assertIn('Cooler: 154 x 120 x 52',row['value'])

    def test_stale_url_with_different_oc_suffix_cannot_match(self):
        doc=next(d for d in H['documents']() if '/GeForce-RTX-2080-Ti-VENTUS-11G/Specification' in d['url'])
        bad=copy.deepcopy(doc)
        bad['url']=bad['url'].replace('VENTUS-11G/','VENTUS-11G-OCV1/')
        self.assertIsNone(H['parse_msi'](bad))
        self.assertNotIn('import-gpu-f9e2f59cdd88',PRODUCTS)

    def test_gddr5_identity_does_not_accept_gddr6_or_changed_length(self):
        item=INPUT['import-gpu-6bfb68924401']
        fact=next(f for f in FACTS if 'GeForce-GTX-1650-AERO-ITX-4G-OC/' in f['source']['url'])
        self.assertTrue(H['compatible'](item,fact)[0])
        altered=copy.deepcopy(fact);altered['values']['Memory']='4GB GDDR6'
        self.assertFalse(H['compatible'](item,altered)[0])
        altered=copy.deepcopy(fact);altered['patch']['lengthMm']=180
        self.assertEqual(H['compatible'](item,altered),(False,'archived_length_conflict'))

    def test_fan_count_and_diameter_require_exact_written_model_evidence(self):
        gaming=PRODUCTS['import-gpu-ae832418723f']
        self.assertEqual(gaming['patch']['fanCount'],2)
        self.assertEqual(gaming['patch']['fanSizeMm'],90)
        self.assertIn('Newsletter/201901',gaming['fieldEvidence']['fanSizeMm']['sourceURL'])
        self.assertEqual(PRODUCTS['import-gpu-d85ee557923d']['patch']['fanCount'],1)
        self.assertNotIn('fanSizeMm',PRODUCTS['import-gpu-d85ee557923d']['patch'])

    def test_every_new_compatibility_value_has_primary_evidence(self):
        for cid,p in PRODUCTS.items():
            for key in ['capacityGB','lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW']:
                self.assertIn(key,p['patch'],(cid,key))
                proof=p['fieldEvidence'][key]
                self.assertEqual(p['patch'][key],proof['value'],(cid,key))
                self.assertIn('msi.com/',proof['sourceURL'])
            self.assertTrue(p['patch']['lengthMm']>p['patch']['heightMm']>p['patch']['thicknessMm']>0,cid)

if __name__=='__main__':unittest.main()
