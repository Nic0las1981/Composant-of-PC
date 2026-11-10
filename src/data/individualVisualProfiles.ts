import type {BoardVisualProfile,GpuVisualProfile,RamVisualProfile,StorageVisualProfile,PsuVisualProfile} from './visualProfiles';

/** Explicit per-reference reconstructions from the photos and dimensional evidence
 * listed in data/individual-review/visual-references.json. Never used as input
 * to compatibility calculations. Fine geometry remains illustrative. */
export const individualBoardProfiles:Record<string,BoardVisualProfile>={
 'import-mb-fd057324a4a8':{id:'import-mb-fd057324a4a8',name:'ASRock B850 Steel Legend WiFi',category:'motherboard',design:'steel-legend-b850',fidelity:'reconstructed',color:'#ecefeb',accent:'#a6aeb0',rgb:true,heightMm:305,widthMm:244,slots:4,pcbColor:'#e6e9e4',heatsinkColor:'#dce0dc',formFactor:'ATX'},
};
export const individualGpuProfiles:Record<string,GpuVisualProfile>={};
for(const [id,capacity] of [['import-gpu-a682aa002297',8],['import-gpu-a12582346528',16]] as const)individualGpuProfiles[id]={id,name:`ASRock Radeon RX 9060 XT Steel Legend ${capacity}GB OC`,category:'gpu',design:'steel-legend-rx9060xt',fidelity:'reconstructed',color:'#e9ecea',accent:'#aab1b2',rgb:true,lengthMm:298,heightMm:131,thicknessMm:51,fanCount:3,fanSizeMm:90,shroudColor:'#ecefed',backplateColor:'#e2e5e1',fanLayout:'inline',fanRgb:true};
export const individualRamProfiles:Record<string,RamVisualProfile>={
 'import-ram-8b162aa67690':{id:'import-ram-8b162aa67690',name:'Crucial Pro Overclocking 32 Go DDR5-6000 CL36 Blanc',category:'ram',design:'crucial-pro-overclocking',fidelity:'reconstructed',color:'#f2f1ed',accent:'#9da2a0',rgb:false,heightMm:35,lengthMm:133,thicknessMm:8,sticks:2,heatspreaderColor:'#f2f1ed',hasHeatspreader:true,pcbColor:'#191d1c'},
};
export const individualStorageProfiles:Record<string,StorageVisualProfile>={
 'import-ssd-8a91162ac077':{id:'import-ssd-8a91162ac077',name:'Samsung 9100 PRO 2 To',category:'storage',design:'samsung-9100-pro',fidelity:'reconstructed',color:'#151a19',accent:'#ed1735',rgb:false,widthMm:22.15,lengthMm:80.15,heightMm:2.38,labelColor:'#151616',hasHeatsink:false},
};
export const individualPsuProfiles:Record<string,PsuVisualProfile>={
 'import-psu-3f7709be66e0':{id:'import-psu-3f7709be66e0',name:'be quiet! Power Zone 2 1000 W',category:'psu',design:'power-zone-2',fidelity:'reconstructed',color:'#242625',accent:'#d17c36',rgb:false,widthMm:150,heightMm:86,depthMm:160,fanSizeMm:140,format:'ATX'},
};

// Separately identified variants share only the manufacturer-confirmed exterior
// envelope. Their own catalogue records retain capacity, wattage and offers.
for (const [id,capacity] of [['import-ssd-af0ab1572ccd',1],['import-ssd-40f0be19dbba',4]] as const) {
 individualStorageProfiles[id]={...individualStorageProfiles['import-ssd-8a91162ac077'],id,name:`Samsung 9100 PRO ${capacity} To`};
}
for (const [id,watts] of [['import-psu-01e3e8ba588f',750],['import-psu-a92896f7672c',850]] as const) {
 individualPsuProfiles[id]={...individualPsuProfiles['import-psu-3f7709be66e0'],id,name:`be quiet! Power Zone 2 ${watts} W`};
}
