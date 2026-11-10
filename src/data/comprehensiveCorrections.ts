import {comprehensiveMemoryStorage} from './comprehensiveMemoryStorage.ts';
import type {VerifiedProduct} from './verifiedTypes.ts';

// The manufacturer's exact-capacity table resolves the retailer's x16/8 mm
// errors. The offer remains tied to the same MPN and its original observation.
const ud85=comprehensiveMemoryStorage['import-ssd-a56f9a7de0e6'];
export const comprehensiveCorrections:Record<string,VerifiedProduct>={
 'import-ssd-a56f9a7de0e6':{
  ...ud85,
  sources:[...ud85.sources,{name:'Silicon Power — UD85, tableau des capacités',url:'https://www.silicon-power.com/product-detail/PCIe-Gen4-x4-UD85',checkedAt:'2026-11-10T11:32:30.810519Z',kind:'manufacturer'}],
  groups:[{title:'Spécifications fabricant Silicon Power',rows:[
   {label:'Référence fabricant',value:'SP01KGBP44UD8505'},
   {label:'Capacité',value:'1 To'},
   {label:'Format',value:'M.2 2280'},
   {label:'Interface et protocole',value:'PCIe 4.0 x4 · NVMe 1.4'},
   {label:'Longueur',value:'80 mm'},{label:'Largeur',value:'22 mm'},{label:'Hauteur',value:'3,5 mm'},
   {label:'Lecture séquentielle',value:'Jusqu’à 3600 Mo/s — version 1 To'},
   {label:'Écriture séquentielle',value:'Jusqu’à 2800 Mo/s — version 1 To'},
   {label:'Type NAND',value:'3D NAND ; type de cellule non publié sur cette fiche'},
   {label:'Mémoire tampon',value:'Host Memory Buffer (HMB) ; ne prouve pas la présence de DRAM dédiée'},
   {label:'Garantie',value:'5 ans limitée, sous réserve du seuil TBW et des conditions fabricant'},
  ]}],
  patch:{...ud85.patch,lengthMm:80,widthMm:22,heightMm:3.5,
   description:'Silicon Power UD85 1 To, référence SP01KGBP44UD8505. PCIe 4.0 ×4, NVMe 1.4 ; module de 80 × 22 × 3,5 mm. Débits séquentiels fabricant jusqu’à 3600 / 2800 Mo/s. Endurance chiffrée et type de cellule NAND restant à confirmer.',
   specs:['1 To','M.2 2280 · NVMe 1.4','PCIe 4.0 ×4','Lecture jusqu’à 3600 Mo/s · écriture jusqu’à 2800 Mo/s','Dimensions : 80 × 22 × 3,5 mm']},
  notes:[...ud85.notes,'La fiche fabricant du MPN exact corrige les indications marchandes PCIe ×16 et hauteur 8 mm : le UD85 utilise PCIe 4.0 ×4 et mesure 3,5 mm de haut. Le US85 PCIe 5.0 est une autre famille, avec un autre MPN.'],
 },
};
