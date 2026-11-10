/** Appearance cues for the exact listed models. These are illustration controls,
 * not mechanical specifications, manufacturer CAD, or a photographic fidelity flag.
 * Source inspections are recorded separately in data/deep-review/visual/icons. */
export type CoolerAppearance = {
  pumpShape?: 'arctic-vrm'|'kraken-round'|'capellix'|'corsair-lcd'|'deepcool-infinity'|'silent-loop'|'ek-nucleus';
  capStyle?: 'exposed-fins'|'thermalright-plate'|'deepcool-grid'|'digital-bridge'|'dark-rock';
  fanFrame?: 'round'|'square';
  bladeCount?: number;
  centralFan?: boolean;
  asymmetricTowers?: boolean;
};
const noctua:CoolerAppearance={capStyle:'exposed-fins',fanFrame:'round',bladeCount:7};
const thermalright:CoolerAppearance={capStyle:'thermalright-plate',fanFrame:'square',bladeCount:7};
const deepcool:CoolerAppearance={capStyle:'deepcool-grid',fanFrame:'square',bladeCount:9};
const arctic:CoolerAppearance={pumpShape:'arctic-vrm',fanFrame:'square',bladeCount:5};
const capellix:CoolerAppearance={pumpShape:'capellix',fanFrame:'square',bladeCount:9};
export const coolerAppearances:Record<string,CoolerAppearance>={
  'cooler-phantom':thermalright,
  'cooler-peerless':thermalright,
  'cooler-ak620':deepcool,
  'cooler-ak620-zero-dark':deepcool,
  'cooler-ak620-digital':{...deepcool,capStyle:'digital-bridge'},
  'cooler-nhd15':noctua,
  'cooler-nhd15-g2':{...noctua,bladeCount:9,asymmetricTowers:true},
  'cooler-nhd12l':{...noctua,bladeCount:9,centralFan:true,asymmetricTowers:true},
  'cooler-l9a':{capStyle:'exposed-fins',fanFrame:'square',bladeCount:9},
  'cooler-l9i-17xx':{capStyle:'exposed-fins',fanFrame:'square',bladeCount:9},
  'cooler-darkrockpro5':{capStyle:'dark-rock',fanFrame:'round',bladeCount:7},
  'cooler-lfiii240':arctic,
  'cooler-lfiii280':arctic,
  'cooler-lfiii360':arctic,
  'cooler-lfiii420':arctic,
  'cooler-lfiii360-argb-white':arctic,
  'cooler-h100i240':capellix,
  'cooler-h150i360':capellix,
  'cooler-h170i-lcd-420':{pumpShape:'corsair-lcd',fanFrame:'square',bladeCount:9},
  'cooler-kraken240':{pumpShape:'kraken-round',fanFrame:'square',bladeCount:7},
  'cooler-kraken360':{pumpShape:'kraken-round',fanFrame:'square',bladeCount:7},
  'cooler-ls520240':{pumpShape:'deepcool-infinity',fanFrame:'square',bladeCount:9},
  'cooler-ls720360':{pumpShape:'deepcool-infinity',fanFrame:'square',bladeCount:9},
  'cooler-silentloop2-360':{pumpShape:'silent-loop',fanFrame:'square',bladeCount:7},
  'cooler-ek-nucleus360':{pumpShape:'ek-nucleus',fanFrame:'square'},
};

export type CaseAppearance={
  frontPattern:'triangles'|'fine-mesh'|'faceted-mesh'|'hexagons'|'geometric-filter'|'wood-slats'|'glass'|'solid-wood'|'square-perforation';
  ioPosition?:'top'|'side'|'front-bottom'|'front-top';
  frontColumn?:boolean;
  lowerSideMesh?:boolean;
  lowerFrontCover?:boolean;
  angledIntake?:boolean;
};
export const caseAppearances:Record<string,CaseAppearance>={
  'case-h6':{frontPattern:'glass',ioPosition:'front-bottom',angledIntake:true},
  'case-h7':{frontPattern:'fine-mesh',ioPosition:'top'},
  'case-h9':{frontPattern:'glass',ioPosition:'top'},
  'case-4000d':{frontPattern:'triangles',ioPosition:'top'},
  'case-4000d-white':{frontPattern:'triangles',ioPosition:'top'},
  'case-5000d':{frontPattern:'triangles',ioPosition:'top'},
  'case-7000d':{frontPattern:'triangles',ioPosition:'top'},
  'case-3000d':{frontPattern:'triangles',ioPosition:'top'},
  'case-q300l':{frontPattern:'geometric-filter',ioPosition:'side'},
  'case-ap201':{frontPattern:'square-perforation',ioPosition:'front-top'},
  'case-terra':{frontPattern:'solid-wood',ioPosition:'front-bottom'},
  'case-north':{frontPattern:'wood-slats',ioPosition:'top'},
  'case-north-white':{frontPattern:'wood-slats',ioPosition:'top'},
  'case-o11':{frontPattern:'glass',ioPosition:'front-bottom',frontColumn:true},
  'case-meshify2':{frontPattern:'faceted-mesh',ioPosition:'top'},
  'case-pop-air-rgb':{frontPattern:'hexagons',ioPosition:'top',lowerFrontCover:true},
  'case-lancool3':{frontPattern:'fine-mesh',ioPosition:'front-top',lowerSideMesh:true},
  'case-xt-pro-ultra':{frontPattern:'fine-mesh',ioPosition:'top'},
  'case-p400a-digital':{frontPattern:'fine-mesh',ioPosition:'top'},
  'case-air903-base':{frontPattern:'fine-mesh',ioPosition:'top'},
};
