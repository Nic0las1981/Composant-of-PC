// Individually reviewed resolution: the B850 summary and manual describe the same five facts.
// Keep the complete manual restrictions and its registered source; no semantic merging rule.
import type {VerifiedFieldEvidence} from "./verifiedTypes.ts";
export const catalogFieldEvidence:Record<string,{mpn:string;fields:Record<string,VerifiedFieldEvidence>}> = {
  "import-mb-fd057324a4a8": {
    "mpn": "90-MXBQS0-A0UAYZ",
    "fields": {
      "storagePorts": {
        "value": "CPU: • 1 x Blazing M.2 Socket (M2_1, Key M), supports type 2280 PCIe Gen5x4 (128 Gb/s) mode* • 1 x Hyper M.2 Socket (M2_2, Key M), supports type 2260/2280 PCIe Gen4x4 (64 Gb/s) mode* Chipset: • 1 x Hyper M.2 Socket (M2_3, Key M), supports type 2230/2260/2280 PCIe Gen4x4 (64 Gb/s) mode* • 1 x Hyper M.2 Socket (M2_4, Key M), supports type 2260/2280 PCIe Gen4x4 (64 Gb/s) mode* ASMedia ASM1061: • 4 x SATA3 6.0 Gb/s Connectors * Supports NVMe SSD as boot disks * M2_1 is the irst priority for M.2 installation. * M2_1 will run at Gen5x4 with 9000 and 7000 series proces- sors and Gen4x4 with 8000 (Phoenix 1 and Phoenix 2) series processors. * M2_2 will run at Gen4x2 with 8000 (Phoenix 2) series proces- sors. * If M2_4 is occupied, PCIE2 will be disabled.",
        "sourceURL": "https://download.asrock.com/Manual/B850%20Steel%20Legend%20WiFi.pdf",
        "checkedAt": "2026-11-10T11:00:27+00:00"
      },
      "pcie": {
        "value": "CPU: Slot • 1 x PCIe 5.0 x16 Slot (PCIE1), supports x16 mode* • Chipset: • 1 x PCIe 4.0 x16 Slot (PCIE2), supports x4 mode* • 1 x Vertical M.2 Socket (Key E), supports type 2230 WiFi/ BT PCIe WiFi module * PCIE1 will run at Gen5x16 with 9000 and 7000 series processors, Gen4x8 with 8000 (Phoenix 1) series processors and Gen4x4 with 8000 (Phoenix 2) series processors. * If M2_4 is occupied, PCIE2 will be disabled. * Supports NVMe SSD as boot disks • 15μ Gold Contact in VGA PCIe Slot (PCIE1) TM",
        "sourceURL": "https://download.asrock.com/Manual/B850%20Steel%20Legend%20WiFi.pdf",
        "checkedAt": "2026-11-10T11:00:27+00:00"
      },
      "network": {
        "value": "• 2.5 Gigabit LAN 10/100/1000/2500 Mb/s • Dragon RTL8125BG • Supports Dragon 2.5G LAN Sotware - Smart Auto Adjust Bandwidth Control - Visual User Friendly UI - Visual Network Usage Statistics - Optimized Default Setting for Game, Browser, and Streaming Modes - User Customized Priority Control",
        "sourceURL": "https://download.asrock.com/Manual/B850%20Steel%20Legend%20WiFi.pdf",
        "checkedAt": "2026-11-10T11:00:27+00:00"
      },
      "audio": {
        "value": "• 7.1 CH HD Audio with Content Protection (Realtek ALC4082 Audio Codec) • Individual PCB Layers for R/L Audio Channel • Direct Drive Technology on Front headphone port (Supports up to 600 Ohm headsets) • Nahimic Audio",
        "sourceURL": "https://download.asrock.com/Manual/B850%20Steel%20Legend%20WiFi.pdf",
        "checkedAt": "2026-11-10T11:00:27+00:00"
      },
      "cpuSupport": {
        "value": "• Supports AMD Socket AM5 Ryzen 9000, 8000 and 7000 Series Processors* * he availability of expansion slots may vary by CPU. Please refer to PCIe/M.2 Bandwidth Table for details. (http://www. asrock.com/)",
        "sourceURL": "https://download.asrock.com/Manual/B850%20Steel%20Legend%20WiFi.pdf",
        "checkedAt": "2026-11-10T11:00:27+00:00"
      }
    }
  }
};
