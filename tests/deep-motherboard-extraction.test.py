import pathlib,runpy,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
C=runpy.run_path(str(ROOT/'scripts/deep-motherboard-core.py'))
class ExtractionTests(unittest.TestCase):
 def test_named_slots_are_deduplicated_across_cpu_conditions(self):
  self.assertEqual(C['nvme_count']('Ryzen 9000: M.2_1 PCIe 5.0 x4. Ryzen 8000: M.2_1 PCIe 4.0 x4.'),1)
 def test_concatenated_msi_labels_include_first_socket(self):
  self.assertEqual(C['nvme_count']('3xM.2M.2_1 PCIe 4.0 x4M.2_2 PCIe 4.0 x4M.2_3 PCIe 3.0 x4'),3)
 def test_sata_only_and_wireless_are_not_nvme(self):
  self.assertEqual(C['nvme_count']('M2_1 PCIe 4.0 x4 / SATA. M2_2 SATA-only; PCIe not supported. M2_3 Key E WiFi PCIe.'),1)
 def test_unnamed_repeated_cpu_descriptions_are_not_added(self):
  self.assertIsNone(C['nvme_count']('Ryzen: 1 x M.2 Socket 3 PCIe x4\nAthlon: 1 x M.2 Socket 3 PCIe x2'))
 def test_one_explicit_storage_total(self):
  self.assertEqual(C['nvme_count']('2 x M.2 Slots with PCIe 4.0 x4 support'),2)
 def test_capacity_does_not_create_per_dimm_limit(self):
  p=C['make_product']({'brand':'ASUS','name':'EXACT'},None,{'CPU':'AMD AM5','Memory':'4 x DIMM DDR5, Max. 256 GB','Storage':'M.2_1 PCIe 5.0','Form Factor':'ATX, 30.5 cm x 24.4 cm'},{'name':'Manufacturer','url':'https://example.com/exact','kind':'manufacturer','checkedAt':'2026-11-10T00:00:00Z'})
  self.assertEqual(p['patch']['memorySlots'],4);self.assertEqual(p['patch']['maxMemoryGB'],256);self.assertNotIn('maxMemoryPerSlotGB',p['patch']);self.assertEqual(p['patch']['heightMm'],305)
 def test_msi_unlabelled_axes_remain_unknown(self):
  p=C['make_product']({'brand':'MSI','name':'EXACT'},None,{'CPU':'LGA1700','Memory':'2x DDR5, Maximum Memory Capacity 96GB','PCB Info':'Mini-ITX, 170 mm x 170 mm'},{'name':'Manufacturer','url':'https://example.com/exact','kind':'manufacturer','checkedAt':'2026-11-10T00:00:00Z'})
  self.assertEqual(p['patch']['memorySlots'],2);self.assertNotIn('heightMm',p['patch']);self.assertIn('boardDimensions',p['fieldEvidence'])
if __name__=='__main__':unittest.main()
