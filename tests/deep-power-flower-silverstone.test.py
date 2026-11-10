import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
FIXTURES = ROOT / 'tests/fixtures/deep-power'

def module(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / ('scripts/' + name + '.py'))
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded

flower = module('deep-power-flower')
silver = module('deep-power-silverstone')

class PrimaryTableRegression(unittest.TestCase):
    def test_merged_columns_keep_each_power_and_connector_scope(self):
        rows = flower.parse_dirac({'url': 'https://dirac.co.jp/leadex-iii-gold/'}, (FIXTURES / 'dirac-leadex-iii-gold.html').read_bytes())
        models = {r['patch']['wattage']: r for r in rows}
        self.assertEqual(set(models), {550, 650, 750, 850})
        self.assertEqual(models[750]['patch']['depthMm'], 160)
        self.assertEqual(models[750]['patch']['fanSizeMm'], 130)
        self.assertTrue(any('4 (2)' == v or '4(2)' == v for k, v in models[750]['values'].items() if 'CPU' in k or 'EPS' in k or '8pin' in k))

    def test_unusual_dirac_se_axes_are_not_compatibility_dimensions(self):
        rows = flower.parse_dirac({'url': 'https://dirac.co.jp/leadex-platinum-se/'}, (FIXTURES / 'dirac-leadex-platinum-se.html').read_bytes())
        for row in rows:
            if row['patch']['wattage'] in [1000, 1200]:
                self.assertNotIn('widthMm', row['patch'])
                self.assertNotIn('depthMm', row['patch'])

    def test_original_manufacturer_axes_resolve_se1200_and_combined_rail(self):
        row = flower.parse_markdown_primary({'url': 'https://www.super-flower1.e-goodnews.com.tw/product-data.php?lang=en&productID=139', 'text': (FIXTURES / 'superflower-se1200.txt').read_text()})
        self.assertEqual(row['code'], 'SF-1200F14MP')
        self.assertEqual(row['patch']['depthMm'], 180)
        self.assertEqual(row['patch']['widthMm'], 150)
        self.assertTrue(any('+3.3V et +5V ensemble : 100W' in value for value in row['values'].values()))

    def test_silverstone_mixed_revision_axes_cannot_choose_first(self):
        row = silver.parse({'url': 'https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-GS/', 'text': (FIXTURES / 'silverstone-st85fgs.txt').read_text()})
        self.assertEqual(row['mpns'], ['SST-ST85F-GS'])
        self.assertNotIn('depthMm', row['patch'])
        self.assertIn('V1:', row['values']['Dimension'])
        self.assertIn('V2:', row['values']['Dimension'])

if __name__ == '__main__':
    unittest.main()
