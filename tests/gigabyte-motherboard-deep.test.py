import pathlib, runpy, unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]
M=runpy.run_path(str(ROOT/'scripts/gigabyte-motherboard-deep.py'))

def page(storage, memory='4 x DDR5 DIMM sockets supporting up to 256 GB (64 GB single DIMM capacity) of system memory'):
 return {'url':'https://www.gigabyte.com/Motherboard/Test/sp','checkedAt':'2026-11-10T13:00:00Z','sections':{'CPU':'AMD Socket AM5','Memory':memory,'Storage Interface':storage,'Form Factor':'ATX Form Factor; 30.5cm x 24.4cm'},'sectionItems':{}}

class GigabyteEvidenceTests(unittest.TestCase):
 def test_revision_and_model_discriminants(self):
  self.assertNotEqual(M['normalized']('B760 DS3H DDR4'),M['normalized']('B760 DS3H'))
  self.assertNotEqual(M['normalized']('MODEL+'),M['normalized']('MODEL'))
  self.assertTrue(M['revision_covers']('1.0','1.x'))
  self.assertFalse(M['revision_covers']('2.0','1.x'))
  self.assertTrue(M['revision_covers']('1.0/1.1','1.0/1.1'))
  self.assertFalse(M['revision_covers']('1.0',None))

 def test_nvme_counts_exclude_wifi_and_sata_only(self):
  p=page('1 x M.2 connector (Socket 3, M key, PCIe 4.0 x4 SSD support) 1 x M.2 connector (Socket 3, SATA SSD support only) 1 x M.2 connector (Key E, Wi-Fi PCIe module) 4 x SATA connectors')
  patch,_=M['derive'](p);self.assertEqual(patch['m2Slots'],1)

 def test_nvme_headers_outside_list_items_and_cpu_restrictions(self):
  p=page('1 x M.2 connector (M2A_CPU), supporting Socket 3 SSDs: Ryzen 9000 supports PCIe 5.0 x4 SSDs; Ryzen 8000 supports PCIe 4.0 x4. 2 x M.2 connectors (M2B/M2C), PCIe 4.0 x4 SSDs. 4 x SATA connectors')
  patch,facts=M['derive'](p);self.assertEqual(patch['m2Slots'],3)
  self.assertIn('Ryzen 8000',facts['storagePorts']['value'])

 def test_unspecified_m2_interface_stays_unknown(self):
  patch,_=M['derive'](page('1 x M.2 connector (Socket 3, M key) 4 x SATA connectors'))
  self.assertNotIn('m2Slots',patch)

 def test_total_memory_and_dimensions_are_explicit(self):
  patch,facts=M['derive'](page('4 x SATA connectors'))
  self.assertEqual(patch['maxMemoryGB'],256);self.assertEqual(patch['memorySlots'],4)
  self.assertEqual(patch['maxMemoryPerSlotGB'],64)
  self.assertEqual((patch['heightMm'],patch['widthMm']),(305,244))
  self.assertEqual(facts['memoryCapacity']['sourceURL'],'https://www.gigabyte.com/Motherboard/Test/sp')
  without_per_slot,_=M['derive'](page('4 x SATA connectors','4 x DDR5 DIMM sockets supporting up to 256 GB of system memory'))
  self.assertNotIn('maxMemoryPerSlotGB',without_per_slot)

 def test_bare_ddr_dimm_label_retains_generation_from_exact_memory_text(self):
  patch,_=M['derive'](page('4 x SATA connectors','Support DDR4 3200 MT/s. 2 x DDR DIMM sockets supporting up to 64 GB system memory'))
  self.assertEqual(patch['memoryType'],'DDR4');self.assertEqual(patch['memorySlots'],2)

 def test_mobile_desktop_duplicate_tables_are_not_added(self):
  block='<ul class="spec-item-list"><li class="spec-title"><div>Storage Interface</div></li><li class="spec-desc"><div>1 x M.2 connector, PCIe 4.0 x4 SSD</div></li></ul>'
  p=M['parse_page']('<html><h1>MODEL (Rev. 1.0)</h1>'+block+block+'</html>','https://www.gigabyte.com/Motherboard/MODEL-rev-10/sp')
  self.assertEqual(len(p['sections']),1);self.assertEqual(p['revision'],'1.0')

if __name__=='__main__':unittest.main()
