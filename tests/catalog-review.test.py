"""Offline regression cases for identity gates; never contact a retailer."""
import runpy
from pathlib import Path
import unittest

rules=runpy.run_path(str(Path(__file__).resolve().parents[1]/'scripts/collect-catalog-review.py'))
match=rules['variant_match']
main_offer=runpy.run_path(str(Path(__file__).resolve().parents[1]/'scripts/primary-review-offer.py'))['main_offer']

class IdentityTests(unittest.TestCase):
    def setUp(self):
        self.component={'brand':'G.Skill','category':'ram','name':'Flare X5','originalRecord':{'name':'G.Skill Flare X5 32 GB'},'capacityGB':32,'memorySticks':2,'memoryType':'DDR5','memorySpeedMTs':6000,'casLatency':36,'finishName':'Noir'}
        self.page={'name':'G.Skill Flare X5 DDR5 6000 MHz 32 Go 2 x 16 Go CL36 Noir','mpn':'F5-6000J3636F16GX2-FX5','brand':{'name':'G.Skill'}}

    def test_exact_kit_is_accepted(self):
        self.assertTrue(match(self.component,self.page)[0])

    def test_ram_overclocking_alias_does_not_relax_gpu_oc_variants(self):
        c={**self.component,'brand':'Crucial','originalRecord':{'name':'Crucial Pro Overclocking 32 GB'}}
        p={**self.page,'name':'Crucial Pro OC DDR5 6000 MHz 32 Go 2 x 16 Go CL36 Noir','brand':{'name':'Crucial'}}
        self.assertTrue(match(c,p)[0])
        g={'brand':'ASUS','name':'DUAL','category':'gpu','originalRecord':{'name':'ASUS DUAL','chipset':'GeForce RTX 3060','memory':12}}
        self.assertFalse(match(g,{'name':'ASUS DUAL OC RTX 3060 12 Go','mpn':'NEW'})[0])

    def test_psu_efficiency_class_is_an_attribute_when_explicitly_labelled(self):
        c={'brand':'be quiet!','name':'Power Zone 2','category':'psu','wattage':1000}
        self.assertTrue(match(c,{'name':'be quiet! Power Zone 2 1000W 80 PLUS Platinum','mpn':'BP007EU'})[0])
        self.assertFalse(match(c,{'name':'be quiet! Power Zone 2 Platinum Edition 1000W','mpn':'DIFFERENT'})[0])

    def test_psu_generations_efficiency_modularity_and_chassis_cannot_be_substituted(self):
        c={'brand':'Corsair','name':'RM750','category':'psu','wattage':750,'originalRecord':{'name':'Corsair RM750','type':'ATX','efficiency':'gold','modular':'Full'}}
        self.assertFalse(match(c,{'name':'Corsair RM750e 750W 80 PLUS Gold Modulaire','mpn':'NEW'})[0])
        self.assertFalse(match(c,{'name':'Corsair RM750 750W 80 PLUS Platinum Modulaire','mpn':'NEW'})[0])
        self.assertFalse(match(c,{'name':'Corsair RM750 750W 80 PLUS Gold semi-modulaire','mpn':'NEW'})[0])
        self.assertFalse(match(c,{'name':'Corsair RM750 750W 80 PLUS Gold SFX Modulaire','mpn':'NEW'})[0])
        c={'brand':'Thermaltake','name':'Smart','category':'psu','wattage':500}
        self.assertFalse(match(c,{'name':'Thermaltake Smart W3 500W 80 PLUS','mpn':'NEW'})[0])
        c={'brand':'Seasonic','name':'PRIME Fanless PX-450','category':'psu','wattage':450}
        self.assertFalse(match(c,{'name':'Seasonic PRIME Fanless PX-500 450W 80 PLUS Platinum','mpn':'NEW'})[0])
        c={'brand':'be quiet!','name':'Pure Power 12 M','category':'psu','wattage':550}
        self.assertFalse(match(c,{'name':'be quiet! Pure Power 12 550W 80 PLUS Gold','mpn':'NEW'})[0])

    def test_mixed_finish_requires_all_explicit_product_colors(self):
        c={**self.component,'finishName':'Noir / Argent'}
        p={**self.page,'technicalText':'Couleur du produit: Noir, Argent'}
        self.assertTrue(match(c,p)[0])
        self.assertFalse(match(c,{**p,'technicalText':'Couleur du produit: Noir'})[0])
        self.assertFalse(match(c,{**p,'technicalText':'Couleur du rétroéclairage: Noir, Argent'})[0])

    def test_storage_capacity_ranking_normalizes_terabytes_to_gigabytes(self):
        c={'brand':'Samsung','name':'9100 PRO','category':'storage','capacityGB':2000}
        exact={'name':'Samsung 9100 PRO 2 To NVMe PCIe 5.0'}
        other={'name':'Samsung 9100 PRO 1 To NVMe PCIe 5.0'}
        self.assertGreater(rules['candidate_score'](c,exact),rules['candidate_score'](c,other))

    def test_missing_mpn_or_wrong_kit_cas_generation_and_finish_are_rejected(self):
        for title in ['G.Skill Flare X5 DDR5 6000 MHz 32 Go 1 x 32 Go CL36 Noir','G.Skill Flare X5 DDR5 6000 MHz 32 Go 2 x 16 Go CL30 Noir','G.Skill Flare X5 DDR4 6000 MHz 32 Go 2 x 16 Go CL36 Noir','G.Skill Flare X5 DDR5 6000 MHz 32 Go 2 x 16 Go CL36 Blanc']:
            with self.subTest(title=title):self.assertFalse(match(self.component,{**self.page,'name':title})[0])
        self.assertFalse(match(self.component,{**self.page,'mpn':''})[0])

    def test_description_color_cannot_override_selected_title(self):
        self.assertFalse(match(self.component,{**self.page,'name':self.page['name'].replace('Noir','Blanc'),'description':'Existe aussi en noir'})[0])

    def test_spd_and_other_supported_kits_cannot_override_title(self):
        self.assertFalse(match(self.component,{**self.page,'name':self.page['name'].replace('CL36','CL30'),'technicalText':'Latence CAS: 36'})[0])
        self.assertFalse(match(self.component,{**self.page,'name':self.page['name'].replace('6000','6400'),'technicalText':'Fréquence SPD: 6000 MHz'})[0])
        self.assertFalse(match(self.component,{**self.page,'name':self.page['name'].replace('2 x 16','1 x 32'),'description':'Autres kits: 2 x 16 Go'})[0])

    def test_a_pro_revision_does_not_replace_original_cooler(self):
        c={'brand':'Arctic','name':'Liquid Freezer III 420','category':'cooler'}
        self.assertFalse(match(c,{'name':'Arctic Liquid Freezer III Pro 420','mpn':'ACFRE00184A'})[0])

    def test_explicit_mpn_excludes_extended_warranty_bundle(self):
        c={'manufacturerPartNumber':'100-100001084WOF'}
        self.assertFalse(match(c,{'mpn':'100-100001084WOF/EW-1Y'})[0])
        self.assertTrue(match(c,{'mpn':'100-100001084WOF'})[0])

    def test_board_revision_cannot_replace_unversioned_archive(self):
        c={'brand':'ASRock','name':'B550M Pro4','category':'motherboard'}
        self.assertFalse(match(c,{'name':'ASRock B550M Pro4 R2.0','mpn':'90-MXNEW'})[0])

    def test_chipset_suffixes_are_not_lost_when_words_are_joined(self):
        c={'brand':'ASUS','name':'PRIME B650-PLUS','category':'motherboard'}
        self.assertFalse(match(c,{'name':'ASUS PRIME B650E-PLUS','mpn':'NEW'})[0])
        c={'brand':'ASUS','name':'DUAL','category':'gpu','originalRecord':{'name':'ASUS DUAL','chipset':'GeForce RTX 3060','memory':12}}
        self.assertFalse(match(c,{'name':'ASUS DUAL RTX3060Ti 12 Go','mpn':'NEW'})[0])

    def test_new_ssd_generation_is_not_the_archived_drive(self):
        c={'brand':'KIOXIA','name':'EXCERIA PRO','category':'storage','capacityGB':1000,'originalRecord':{'name':'KIOXIA EXCERIA PRO','interface':'M.2 PCIe 4.0 X4'}}
        self.assertFalse(match(c,{'name':'Kioxia EXCERIA PRO G2 1TB SSD PCIe Gen5','mpn':'NEW-G2'})[0])
        self.assertFalse(match(c,{'name':'Kioxia EXCERIA PRO 1TB SSD PCIe Gen5','mpn':'NEW'})[0])

    def test_only_primary_product_is_parsed(self):
        html='<script type="application/ld+json">{"@type":"product","name":"Original","mpn":"MAIN"}</script><div id="description"><p>Couleur: Noir</p></div><aside>Recommendation: meilleur prix 9 € blanc</aside>'
        p=rules['product'](html,'https://www.pccomponentes.fr/original')
        self.assertEqual(p['mpn'],'MAIN')
        self.assertEqual(p['technicalText'],'Couleur: Noir')
        self.assertNotIn('9',p['technicalText'])

class PrimaryOfferTests(unittest.TestCase):
    def setUp(self):
        self.page={'url':'https://www.pccomponentes.fr/exact','checkedAt':'2026-11-10T09:00:00Z'}
        self.offer={'@type':'Offer','price':119.95,'priceCurrency':'EUR','offeredBy':{'name':'Vendeur explicite'},'availability':'https://schema.org/InStock','itemCondition':'https://schema.org/NewCondition'}

    def test_aggregate_minimum_without_a_named_offer_is_not_a_price(self):
        self.assertIsNone(main_offer({'offers':{'@type':'AggregateOffer','lowPrice':9,'highPrice':99,'priceCurrency':'EUR'}},self.page,'EXACT'))

    def test_nested_offer_price_wins_over_aggregate_minimum(self):
        result=main_offer({'offers':{'@type':'AggregateOffer','lowPrice':9,'offers':self.offer}},self.page,'EXACT')
        self.assertEqual(result['amount'],119.95)
        self.assertEqual(result['seller'],'Vendeur explicite')
        self.assertEqual(result['shipping'],None)

    def test_missing_seller_currency_or_invalid_amount_is_rejected(self):
        for patch in [{'offeredBy':None},{'priceCurrency':'USD'},{'price':0},{'price':-1},{'price':'NaN'},{'price':'Infinity'}]:
            with self.subTest(patch=patch):self.assertIsNone(main_offer({'offers':{**self.offer,**patch}},self.page,'EXACT'))

    def test_used_state_overrides_a_new_product_wrapper(self):
        result=main_offer({'itemCondition':'https://schema.org/NewCondition','offers':{**self.offer,'itemCondition':'https://schema.org/UsedCondition'}},self.page,'EXACT')
        self.assertEqual(result['condition'],'refurbished')

if __name__=='__main__':unittest.main()
