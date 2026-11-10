import importlib.util
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('deep_prices',ROOT/'scripts/collect-deep-prices.py')
prices=importlib.util.module_from_spec(spec);spec.loader.exec_module(prices)

class ExactOfferDiscovery(unittest.TestCase):
    def test_tracking_query_does_not_hide_a_primary_fnac_product(self):
        page='<a href="https://www.fnac.com/Exact-model/a123456/w-4?oref=tracking">Product</a>'
        self.assertEqual(prices.discovery(page,'https://www.fnac.com/', 'Fnac'),['https://www.fnac.com/Exact-model/a123456/w-4'])
    def test_marketplace_url_is_discovery_only(self):
        page='<a href="https://www.fnac.com/mp123456/Exact-model/w-4?oref=tracking">Product</a>'
        self.assertEqual(prices.discovery(page,'https://www.fnac.com/', 'Fnac'),['https://www.fnac.com/mp123456/Exact-model/w-4'])
        self.assertFalse(prices.identity({'name':'Exact model'},'MZ-V9S4T0BW','Fnac')[0])
    def test_capacity_suffix_and_variant_remain_exact(self):
        self.assertFalse(prices.identity({'mpn':'MZ-V9S2T0BW'},'MZ-V9S4T0BW','PcComponentes')[0])
        self.assertFalse(prices.identity({'description':'CMK32GX5M2B6000Z28W'},'CMK32GX5M2B6000Z28','Fnac')[0])
    def test_fnac_primary_description_requires_complete_delimited_code(self):
        p={'description':'AMD Ryzen 7 (100-100000910WOF) — boîte sans ventilateur'}
        self.assertTrue(prices.identity(p,'100-100000910WOF','Fnac')[0])
        self.assertFalse(prices.identity({**p,'mpn':'100-100000910'},'100-100000910WOF','Fnac')[0])
    def test_no_code_in_primary_product_means_no_identity(self):
        self.assertFalse(prices.identity({'name':'990 EVO Plus 4 To','sku':'retailer-code'},'MZ-V9S4T0BW','Amazon')[0])

if __name__=='__main__':unittest.main()
