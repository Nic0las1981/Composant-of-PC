import importlib.machinery,json,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
reference=importlib.machinery.SourceFileLoader('gpu_reference',str(ROOT/'scripts/deep-gpu-reference.py')).load_module()
powercolor=importlib.machinery.SourceFileLoader('gpu_powercolor',str(ROOT/'scripts/deep-gpu-powercolor.py')).load_module()
class PrimaryGpuParsing(unittest.TestCase):
 def source(self,name):
  f=ROOT/'tests/fixtures/deep-gpu'/name
  return reference.extract_reference(json.loads(f.with_suffix('.json').read_text()),f.with_suffix('.html').read_text())
 def test_obsolete_commented_header_is_not_a_model(self):
  cards=self.source('5080')
  self.assertEqual(len(cards),1);c=cards[0]
  self.assertEqual(c['model'],'GeForce RTX 5080 Founders Edition')
  self.assertEqual(c['capacityGB'],16);self.assertEqual(c['patch']['powerW'],360)
  self.assertEqual(c['patch']['recommendedPsuW'],850)
  self.assertNotIn('thicknessMm',c['patch'])
 def test_family_columns_and_mixed_vram_variants_stay_separate(self):
  cards=self.source('4070-family')
  self.assertEqual([c['model'] for c in cards],['GeForce RTX 4070 SUPER Founders Edition'])
  self.assertEqual(cards[0]['patch'],{'capacityGB':12,'lengthMm':244.0,'heightMm':112.0,'powerW':220.0,'recommendedPsuW':650.0})
  self.assertIn('7168',cards[0]['values'].values())
  self.assertNotIn('7680',cards[0]['values'].values())
 def test_outer_two_fans_are_not_the_total_fan_count(self):
  patch,_,_=powercolor.fans('The outer two fans feature a reverse-rotation design that effectively reduces air turbulence during intake.')
  self.assertNotIn('fanCount',patch)
  patch,_,_=powercolor.fans('The cooler uses two 100 mm fans and one 90 mm fan.')
  self.assertEqual(patch['fanCount'],3)
  self.assertNotIn('fanSizeMm',patch)
if __name__=='__main__':unittest.main()
