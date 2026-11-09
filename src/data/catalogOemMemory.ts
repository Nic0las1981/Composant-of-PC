import type { Component } from "./catalog.ts";

// Selected factual metadata from public SPD samples, with both DDR4 CRCs
// verified. These individual modules are not invented retail kits. Evidence,
// immutable source paths and verification procedure: docs/OEM-MEMORY.md.
const snapshot = "a5391203743ec9a263fe922d8a9fd55ad7891c68";

const records = [
  {
    partNumber: "M378A1K43EB2-CWE",
    capacityGB: 8,
    ranks: 1,
    sourcePath: "Dumps/SPD 2021-10-22/Samsung M378A1K43EB2-CWE.thp",
    sha256: "abb548155320c18e54cd4beed8e74fde28469e5f7c6ffd568999959a690fe7d6",
  },
  {
    partNumber: "M378A2G43AB3-CWE",
    capacityGB: 16,
    ranks: 1,
    sourcePath: "Dumps/SPD 2021-01-01/Samsung M378A2G43AB3-CWE.thp",
    sha256: "929ec7609eca1a368c3e4fea57a5e284cf98db7813fc2a57e47071181caae9b7",
  },
  {
    partNumber: "M378A2G43BB3-CWE",
    capacityGB: 16,
    ranks: 1,
    sourcePath: "Dumps/Samsung M378A2G43BB3-CWE.thp",
    sha256: "2f8e5a02773f2df1101346c1c70afcb3c7c5db7133ff1818deb16adc6a51940a",
  },
  {
    partNumber: "M378A2K43EB1-CWE",
    capacityGB: 16,
    ranks: 2,
    sourcePath: "Dumps/Samsung M378A2K43EB1-CWE.thp",
    sha256: "4b7c85fc6ea3971d52c8219b72bc19f7ed7b06f26e41ae1817ef66cc00c33035",
  },
  {
    partNumber: "M378A4G43AB2-CWE",
    capacityGB: 32,
    ranks: 2,
    sourcePath: "Dumps/SPD 2020-12-01/Samsung M378A4G43AB2-CWE.thp",
    sha256: "8fd0a5bd827d3a85da7e231688fb7f83546fe73d6e28f45d7d78ec80369909a3",
  },
] as const;

export const catalogOemMemory: Component[] = records.map((record) => ({
  id: `oem-ram-samsung-${record.partNumber.toLowerCase()}`,
  category: "ram",
  brand: "Samsung",
  name: `${record.partNumber} ${record.capacityGB} Go (1 × ${record.capacityGB} Go) DDR4-3200 ${record.ranks}Rx8 UDIMM`,
  manufacturerPartNumber: record.partNumber,
  price: 0,
  priceStatus: "unknown",
  detailLevel: "partial",
  description: `Barrette OEM individuelle de ${record.capacityGB} Go, organisation ${record.ranks}Rx8. Caractéristiques électriques relevées dans un échantillon SPD public ; vitesse effective selon la plateforme. Le rang ne désigne ni les canaux mémoire, ni le nombre de faces du circuit.`,
  specs: [
    `${record.capacityGB} Go · 1 × ${record.capacityGB} Go`,
    "DDR4 · 3200 MT/s · horloge correspondante 1600 MHz",
    `Organisation ${record.ranks}Rx8 · ${record.ranks === 1 ? "1 rang" : `${record.ranks} rangs`} · puces x8`,
    "UDIMM de bureau · non enregistrée · non ECC",
    "JEDEC · CL22 à 3200 MT/s · 1,2 V",
    "PCB vert · sans dissipateur · sans RGB",
    `Référence fabricant : ${record.partNumber}`,
  ],
  source: {
    dataset: "passnet-spd/Unsorted-SPD-Dumps",
    url: `https://github.com/passnet-spd/Unsorted-SPD-Dumps/blob/${snapshot}/${record.sourcePath.split("/").map(encodeURIComponent).join("/")}`,
    snapshot,
    date: "2024-09-06",
    rowId: `sha256:${record.sha256}`,
  },
  capacityGB: record.capacityGB,
  memorySticks: 1,
  memoryType: "DDR4",
  memorySpeedMTs: 3200,
  memoryProfile: "JEDEC",
  casLatency: 22,
  memoryModuleFormat: "DIMM",
  memoryModuleKind: "UDIMM",
  memoryRegistered: false,
  memoryEcc: false,
  memoryRankCount: record.ranks,
  memoryDeviceWidthBits: 8,
  memoryVoltageV: 1.2,
  memoryHeatspreader: false,
  color: "#247847",
  accent: "#6fbb74",
  rgb: false,
}));
