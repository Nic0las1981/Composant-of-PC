import unittest,runpy,pathlib,json
ROOT=pathlib.Path(__file__).resolve().parents[1]
C=runpy.run_path(str(ROOT/'scripts/build-storage-boards.py'))
class ExactStorageTables(unittest.TestCase):
 def test_capacity_units_do_not_merge_500_and_512(self):
  self.assertEqual(C['capacity']('500GB'),500);self.assertEqual(C['capacity']('512 GB'),512);self.assertEqual(C['capacity']('1TB (1024GB)'),1000)
 def test_variant_suffixes_stay_distinct(self):
  f=C['normmodel'];self.assertNotEqual(f('SPATIUM M480 HS','MSI'),f('SPATIUM M480 PLAY','MSI'));self.assertNotEqual(f('SPATIUM M570 FROZR','MSI'),f('SPATIUM M570 PRO FROZR','MSI'));self.assertNotEqual(f('SPATIUM M482 Eco-Pack','MSI'),f('SPATIUM M482','MSI'))
 def test_heatsink_dimensions_are_not_first_triplet(self):
  text='80.00mm (L) x 22.00mm (W) x 2.15mm (H) (w/o heatsink)\n80.40mm (L) x 23.00mm (W) x 20.40mm (H) (w/ heatsink)';self.assertIsNone(C['dims'](text));self.assertEqual(C['dims'](text.splitlines()[1]),(80.4,23,20.4))
 def test_m461_capacity_columns_are_not_family_maximum(self):
  records=[json.loads(p.read_text()) for p in (C['D']/'records').glob('*.json')];rr={C['capacity'](r['rows']['Capacity']):r for r in records if r.get('manufacturerModel','').startswith('SPATIUM M461 ')}
  self.assertEqual(rr[500]['rows']['Sequential Write up to (MB/s)'],'1700');self.assertEqual(rr[2000]['rows']['Sequential Write up to (MB/s)'],'4200');self.assertEqual(rr[500]['rows']['Terabytes Written (TBW)'],'110');self.assertEqual(rr[2000]['rows']['Terabytes Written (TBW)'],'450')
 def test_all_records_considered_and_pending_explained(self):
  self.assertEqual(len(C['INPUT']),93)
  for item in C['INPUT']:
   r=json.loads((C['D']/'records'/(item['component']['id']+'.json')).read_text())
   if r['state']!='exact_model_and_capacity':self.assertTrue(r['blocker']);self.assertTrue(r['followupEvidenceFiles'])
   else:
    p=C['build'](item,r)
    for f in p['fieldEvidence'].values():self.assertIn(f['sourceURL'],[s['url'] for s in p['sources']])
    if not p['mpn']:self.assertEqual(p['offers'],[])
 def test_acer_comma_columns_and_manual_dimensions_are_capacity_specific(self):
  rr=[json.loads(p.read_text()) for p in (C['D']/'records').glob('*.json')]
  fa={C['capacity'](r['rows']['Capacity']):r for r in rr if r.get('manufacturerModel','').startswith('Acer FA200')}
  self.assertEqual(fa[500]['rows']['Sequential Read speed'],'6300 MB/s');self.assertEqual(fa[4000]['rows']['Sequential Write speed'],'6100 MB/s');self.assertEqual(fa[500]['rows']['Warranty'],'5-Year/250 TBW')
  gm={C['capacity'](r['rows']['Capacity']):r for r in rr if r.get('manufacturerModel','').startswith('Predator GM7000')}
  self.assertEqual(gm[512]['patch']['heightMm'],2.2);self.assertEqual(gm[4000]['patch']['heightMm'],5.9)
if __name__=='__main__':unittest.main()
