import unittest,sys,copy
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from catalog_integrity_proofs import documented_capacity_correction, documented_wattage_correction

class CorrectionProofTest(unittest.TestCase):
 def setUp(self):
  self.source='https://manufacturer.test/exact.pdf'
  self.c={'id':'ssd','capacityGB':512,'primaryCorrectionProof':{'identityMatches':True,'capacityGB':512,'manufacturerSources':[self.source]}}
  self.old={'capacity':500}
  self.proof={'id':'ssd','field':'capacityGB','oldValue':500,'newValue':512,'sourceURL':self.source,'reason':'Exact published capacity for the same model.'}
 def test_exact_documented_archive_error(self):
  self.assertEqual(documented_capacity_correction(self.c,self.old,[self.proof]),self.proof)
 def test_neighbor_or_unsupported_correction_is_rejected(self):
  for key,value in [('id','other'),('field','wattage'),('oldValue',1000),('newValue',1024),('sourceURL','https://other.test'),('reason','')]:
   with self.subTest(key=key):
    p={**self.proof,key:value};self.assertIsNone(documented_capacity_correction(self.c,self.old,[p]))
 def test_runtime_identity_and_field_must_match(self):
  for key,value in [('identityMatches',False),('capacityGB',1024),('manufacturerSources',[])]:
   with self.subTest(key=key):
    c=copy.deepcopy(self.c);c['primaryCorrectionProof'][key]=value
    self.assertIsNone(documented_capacity_correction(c,self.old,[self.proof]))
 def test_wattage_correction_requires_its_own_exact_field_evidence(self):
  c={'id':'psu','wattage':650,'primaryCorrectionProof':{'identityMatches':True,'wattage':650,'manufacturerSources':[self.source]}}
  proof={'id':'psu','field':'wattage','oldValue':850,'newValue':650,'sourceURL':self.source,'reason':'Original part number and manufacturer both confirm 650 W.'}
  self.assertEqual(documented_wattage_correction(c,{'wattage':850},[proof]),proof)
  self.assertIsNone(documented_wattage_correction(c,{'wattage':750},[proof]))
  c['primaryCorrectionProof'].pop('wattage')
  self.assertIsNone(documented_wattage_correction(c,{'wattage':850},[proof]))
if __name__=='__main__':unittest.main()
