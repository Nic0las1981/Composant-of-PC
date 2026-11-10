// Generated from native NZXT public support specifications.
import type {VerifiedProduct} from "./verifiedTypes.ts";
export const deepNzxtMotherboardProducts:Record<string,VerifiedProduct> = {
  "import-mb-342b9ba35fc9": {
    "mpn": "N7-B65XT-W1",
    "identityNote": "NZXT documente N7 B650E et la référence commerciale N7-B65XT-W1 pour la finition White. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "AM5",
      "memoryType": "DDR5",
      "maxMemoryGB": 128,
      "m2Slots": 3,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-B65XT-W1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 B650E",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "AMD® B650E"
          },
          {
            "label": "Socket Type",
            "value": "AMD®AM5"
          },
          {
            "label": "CPU Support",
            "value": "AMD Socket AM5 Ryzen™ Processors7000 Series*\n\n8000 & 9000 Series**\n* BIOS version 1.21 required forAMD® Ryzen™ 7000 Series X3D CPUs.\n\n** BIOS version 3.01 or newer required for  AMD® Ryzen™ 8000 & 9000"
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "Dual-Band WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "NZXT CAM Support",
            "value": "Yes"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR5 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual-Channel"
          },
          {
            "label": "Max Memory Speed",
            "value": "Please refer to Memory QVL on the download page for further information."
          },
          {
            "label": "XMP Support",
            "value": "Yes"
          },
          {
            "label": "AMD EXPO Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics & Audio",
        "rows": [
          {
            "label": "Audio Codec",
            "value": "ALC1220 Codec"
          },
          {
            "label": "Graphics Controller",
            "value": "AMD RDNA™ Graphics\n(Requires a supported AMD Ryzen CPU with embedded graphics)"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI 2.1, supports HDR & HDCP 2.3"
          },
          {
            "label": "Maximum Resolution",
            "value": "4830 x 2160 (4K) @ 60Hz"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Support",
        "rows": [
          {
            "label": "PCIe Slots",
            "value": "PCIEX16_1\n\nPCIe 5.0 x16 (Supports x16 Mode) via CPU\n\nSupports NVMe SSD as boot disks.\nPCIEX16_2 & PCIEX16_3\n\nPCIe 4.0 x16 (Supports x2 Mode) via Chipset\n\nSupports NVMe SSD as boot disks."
          },
          {
            "label": "M.2 Socket (E-Key)",
            "value": "1 (Supports 2230 form factor Wi-Fi/BT PCIe modules) via Chipset"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "3"
          },
          {
            "label": "M.2 Slots",
            "value": "M.2_1\n\nPCIe 5.0(Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_2\n\nPCIe 4.0 (Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_3\n\nPCIe 4.0 (Supports x2 Mode) via Chipset\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks."
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/10 for SATA storage devices\n\nSupports RAID 0/1/10 for M.2 NVMe storage devices"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "MediaTek MT7921K (RZ608) Wi-Fi 6E\n\nSupports IEEE 802.11 a/b/g/n/ac/ax\n\nSupports Dual Band 2x2 with extended 6GHz band support*\n\nSupports MU-MIMO\n\nSupports Bluetooth + High speed class II\n* Wi-Fi 6E (6GHz band) will be supported by Microsoft® Windows® 11.  Availability may vary by country and region. A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "4"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "Wireless Antenna",
            "value": "2"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Audio Jacks",
            "value": "1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1x Line In\n\n1 x Line Out (Speaker Left/Right)\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button\n\n1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "3"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "1"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x 4-pin (PWM) CPU_FAN connector (Up to 24W per channel)\n\n1 x 4-pin (PWM) AIO_PUMP connector (Up to 24W per channel)\n\n5 x 4-pin (PWM) SYS_FAN connectors (Up to 24W per channel)"
          },
          {
            "label": "NZXT RGB Header (4-pin)",
            "value": "4"
          },
          {
            "label": "5V ARGB Header",
            "value": "2"
          },
          {
            "label": "ATX Power Header",
            "value": "1x 24-pin ATX Power Connector\n\n1x 8+4-pin ATX 12V Power Connector"
          },
          {
            "label": "Additional Features",
            "value": "Power Button\n\nReset Button\n\nPOST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-B65XT-B1 (Black)\n\nN7-B65XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074842884 (Black)\n\n810074842877 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547202822 (Black)\n\n5056547202815 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "AM5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 3,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "AMD® B650E",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 3\nM.2 Slots: M.2_1\n\nPCIe 5.0(Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_2\n\nPCIe 4.0 (Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_3\n\nPCIe 4.0 (Supports x2 Mode) via Chipset\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/10 for SATA storage devices\n\nSupports RAID 0/1/10 for M.2 NVMe storage devices",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "pcie": {
        "value": "PCIe Slots: PCIEX16_1\n\nPCIe 5.0 x16 (Supports x16 Mode) via CPU\n\nSupports NVMe SSD as boot disks.\nPCIEX16_2 & PCIEX16_3\n\nPCIe 4.0 x16 (Supports x2 Mode) via Chipset\n\nSupports NVMe SSD as boot disks.\nM.2 Socket (E-Key): 1 (Supports 2230 form factor Wi-Fi/BT PCIe modules) via Chipset",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type-C): 1\nUSB 3.2 Gen 2 (Type-A): 2\nUSB 3.2 Gen 1 (Type-A): 4\nUSB 2.0 (Type-A): 2\nWireless Antenna: 2\nLAN (RJ45): 1\nHDMI™ 2.1: 1\nAudio Jacks: 1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1x Line In\n\n1 x Line Out (Speaker Left/Right)\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x BIOS Flashback Button\n\n1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 3\nM.2 (E-Key) Slot: 1\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 1\nUSB 2.0 Header: 2\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x 4-pin (PWM) CPU_FAN connector (Up to 24W per channel)\n\n1 x 4-pin (PWM) AIO_PUMP connector (Up to 24W per channel)\n\n5 x 4-pin (PWM) SYS_FAN connectors (Up to 24W per channel)\nNZXT RGB Header (4-pin): 4\n5V ARGB Header: 2\nATX Power Header: 1x 24-pin ATX Power Connector\n\n1x 8+4-pin ATX 12V Power Connector\nAdditional Features: Power Button\n\nReset Button\n\nPOST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\nOnboard WLAN (WiFi) Controller: MediaTek MT7921K (RZ608) Wi-Fi 6E\n\nSupports IEEE 802.11 a/b/g/n/ac/ax\n\nSupports Dual Band 2x2 with extended 6GHz band support*\n\nSupports MU-MIMO\n\nSupports Bluetooth + High speed class II\n* Wi-Fi 6E (6GHz band) will be supported by Microsoft® Windows® 11.  Availability may vary by country and region. A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: 5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "audio": {
        "value": "ALC1220 Codec",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: AMD®AM5\nAMD Socket AM5 Ryzen™ Processors7000 Series*\n\n8000 & 9000 Series**\n* BIOS version 1.21 required forAMD® Ryzen™ 7000 Series X3D CPUs.\n\n** BIOS version 3.01 or newer required for  AMD® Ryzen™ 8000 & 9000",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 B650E"
  },
  "import-mb-7be55d3a4ea0": {
    "mpn": "N7-Z79XT-W1",
    "identityNote": "NZXT documente N7 Z790 et la référence commerciale N7-Z79XT-W1 pour la finition White. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "LGA1700",
      "memoryType": "DDR5",
      "maxMemoryGB": 192,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-Z79XT-W1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 Z790",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "Intel® Z790"
          },
          {
            "label": "Socket Type",
            "value": "Intel® LGA 1700"
          },
          {
            "label": "CPU Support",
            "value": "Intel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 14th Generation support may require an additional BIOS update prior to installation."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.3"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Hybrid Technology\n\nIntel® Turbo Boost Max 3.0 Technology\n\nIntel® Thermal Velocity Boost (TVB)\n\nIntel® Adaptive Boost Technology (ABT)"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR5 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "192 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Max Memory Speed",
            "value": "7200+ MHz (Overclock)\nPlease refer to Memory QVL for more details."
          },
          {
            "label": "Memory Supported",
            "value": "Non-ECC un-buffered memory"
          },
          {
            "label": "Intel® XMP 2.0 Support",
            "value": "Yes"
          },
          {
            "label": "AMD Extended Profiles for Overclocking (AMD EXPO™) Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "Intel® Xe Graphics"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1 TMDS Compatible"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Additional Features",
            "value": "HDCP 2.3 Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "2"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "2"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1 *\n\nPCIe Gen 5 x16\nPCIEX16_2 & PCIEX16_3 *\n\nPCIe Gen 4 x4\nPCIEX1_1, PCIEX1_2\n\nPCIe Gen 3.0 x1\n* Supports NVMe SSD as boot disks"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "2 (M2_1, M2_3)"
          },
          {
            "label": "M2 Type 2242/2260/2280/22110 Slots\n(M-Key)",
            "value": "1 (M2_2)"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.3"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Audio",
        "rows": [
          {
            "label": "Audio Controller",
            "value": "Realtek® ALC1220 Codec"
          },
          {
            "label": "Channels",
            "value": "8-channel High Definition Audio"
          },
          {
            "label": "Playback",
            "value": "32-bit @ 192,000 Hz DAC"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.0",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "3"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "1 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "4 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "2 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "0"
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-Z79XT-B1 (Black)\n\nN7-Z79XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074843010 (Black)\n\n810074843003 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547202952 (Black)\n\n5056547202945 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "LGA1700",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 192,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "Intel® Z790",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 2 (M2_1, M2_3)\nM2 Type 2242/2260/2280/22110 Slots\n(M-Key): 1 (M2_2)\nM.2 Type: M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices\nAdditional Features: Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 2\nUSB 3.2 Gen 1 (Type-A): 3\nUSB 2.0 (Type-A): 2\nHDMI™ 2.0: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 3\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 1 (Up to 2 ports per header)\nUSB 2.0 Header: 2 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 4 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 2 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 0\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: Bluetooth V5.3\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: Intel® LGA 1700\nIntel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 14th Generation support may require an additional BIOS update prior to installation.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 Z790"
  },
  "import-mb-81e31a06a072": {
    "mpn": "N7-B55XT-W1",
    "identityNote": "NZXT documente N7 B550 et la référence commerciale N7-B55XT-W1 pour la finition White. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "AM4",
      "memoryType": "DDR4",
      "maxMemoryGB": 128,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-B55XT-W1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 B550",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "AMD® B550"
          },
          {
            "label": "Socket Type",
            "value": "AMD®AM4"
          },
          {
            "label": "CPU Support",
            "value": "AMD Socket AM4 Ryzen™ Processors\n3000, 4000, and 5000 Series\n\nDoes notsupport AMD Ryzen™ 5 3400G or Ryzen™ 3 3200G"
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Multi-GPU Support",
            "value": "AMD 2-Way CrossFireX™ Technology"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR4 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Base Frequency Support",
            "value": "3200 MHz\n\n2933 MHz\n\n2667 MHz\n\n2400 MHz\n\n2133 MHz"
          },
          {
            "label": "Max Memory Speed",
            "value": "4666+ MHz (Vermeer & Matisse CPU)\n\n4733+ MHz (Renoir APU)"
          },
          {
            "label": "ECC Support",
            "value": "ECC and non-ECC un-buffered memory"
          },
          {
            "label": "XMP Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "AMD Radeon™ Vega Series Graphics\n(Requires a supported AMD Ryzen APU)"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Maximum Shared Memory",
            "value": "16GB (with 32GB DRAM installed)"
          },
          {
            "label": "Microsoft PlayReady® Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "2"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1\n\nPCIe 4.0 x16 (Vermeer & Matisse CPUs)\n\nPCIe 3.0 x16 (Renoir CPUs)\nPCIE3\n\nPCIe 3.0 x4\nPCIE2 & PCIE4\n\nPCIe 3.0 x1"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "2"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1\n\nPCIe 4.0 x4 (Vermeer & Matisse CPUs)\n\nPCIe 3.0 x4 (Renoir CPUs)\nM2_2\n\nPCIe 3.0 x2 orSATA *\n* M2_2 and SATA3_5_6 use shared lanes."
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "6 *\nSupport for RAID 0/1/5/10, NCQ, AHCI, and Hot Plug\n\n* M2_2 and SATA3_5_6 use shared lanes."
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz)\n\nSupports MU-MIMO"
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "4"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button\n\n1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "2"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "6"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "3 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "1 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters."
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-B55XT-B1 (Black)\n\nN7-B55XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "815671015242 (Black)\n\n815671015235 (White)"
          },
          {
            "label": "EAN",
            "value": "5060301696680 (Black)\n\n5060301696697 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "AM4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "AMD® B550",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 2\nM.2 Type: M2_1\n\nPCIe 4.0 x4 (Vermeer & Matisse CPUs)\n\nPCIe 3.0 x4 (Renoir CPUs)\nM2_2\n\nPCIe 3.0 x2 orSATA *\n* M2_2 and SATA3_5_6 use shared lanes.\nSATA 6Gb/s Ports: 6 *\nSupport for RAID 0/1/5/10, NCQ, AHCI, and Hot Plug\n\n* M2_2 and SATA3_5_6 use shared lanes.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 3\nUSB 3.2 Gen 1 (Type-A): 4\nUSB 2.0 (Type-A): 2\nHDMI™ 2.1: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x BIOS Flashback Button\n\n1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 2\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 6\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 2 (Up to 2 ports per header)\nUSB 2.0 Header: 3 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 1 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters.\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz)\n\nSupports MU-MIMO\nBluetooth Version: Bluetooth V5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: AMD®AM4\nAMD Socket AM4 Ryzen™ Processors\n3000, 4000, and 5000 Series\n\nDoes notsupport AMD Ryzen™ 5 3400G or Ryzen™ 3 3200G",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 B550"
  },
  "import-mb-d34a1f02e431": {
    "mpn": "N9-X87XT-B1",
    "identityNote": "NZXT documente N9 X870E et la référence commerciale N9-X87XT-B1 pour la finition Black. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "AM5",
      "memoryType": "DDR5",
      "maxMemoryGB": 192,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N9-X87XT-B1",
      "detailLevel": "partial",
      "manufacturerModel": "N9 X870E",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "AMD® X870E"
          },
          {
            "label": "Socket Type",
            "value": "AMD®AM5"
          },
          {
            "label": "CPU Support",
            "value": "AMD® Socket AM5 Ryzen™ Processors7000, 8000, and 9000* Series\n* BIOS version 3.20 required for44 9800X3D support.  See note at bottom of spec sheet for more details."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "Tri-Band WiFi 7, Bluetooth 5.4"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "NZXT CAM Support",
            "value": "Yes"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR5 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "192 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Max Memory Speed",
            "value": "Please refer to Memory QVL on the download page for further information."
          },
          {
            "label": "XMP Support",
            "value": "Yes"
          },
          {
            "label": "AMD EXPO Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics & Audio",
        "rows": [
          {
            "label": "Audio Codec",
            "value": "Realtek® ALC4080"
          },
          {
            "label": "Graphics Controller",
            "value": "AMD RDNA™ Graphics\n(Requires a supported AMD Ryzen CPU with embedded graphics)"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "2 x USB4, Supports HDCP 2.3\n\nOnly the CPU's embedded graphics can be displayed through USB4 ports.  To display to a USB-C monitor, please use AM5 Ryzen™ 9000, 8000, or 7000 processors with embedded graphics support."
          },
          {
            "label": "Maximum Resolution",
            "value": "7680 x 4320 @ 30Hz"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Support",
        "rows": [
          {
            "label": "PCIe Slots",
            "value": "PCIEX16_1\n\nPCIe 5.0 x16 (supports x16 mode) via CPU\nPCIEX16_2\n\nPCIe 3.0 x 16 (supports x2 mode) via Chipset"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "4"
          },
          {
            "label": "M.2 Slots",
            "value": "M2_1\n\nBlazing M.2 Socket, PCIe 5.0 (supports x4 mode) @ 128 Gb/s via CPU\n\nSupports 2280 form factor\nM2_2, M2_3, M2_4\n\nHyper M.2 Socket, PCIe 4.0 (supports x4 mode) @ 64 Gb/s via Chipset\n\nSupports 2280 form factor"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0, RAID 1, and RAID 10 for SATA storage devices\n\nSupports RAID 0, RAID 1, and RAID 10 for NVMe storage devices"
          },
          {
            "label": "Supports NVMe SSD as boot disks",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8126CG\n\n5 Gigabit LAN 10/100/1000/2500/5000 MB/s"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "MediaTek MT7925B232M Wi-Fi 7\n\nSupports IEEE 802.11 a/b/g/n/ac/ax/axe/be\n\nSupports 2.4 GHz / 5 GHz / 6 GHz* frequency band\n\nSupports 160 MHz channel bandwidth with 6 GHz* frequency band\n\n1 antenna to support 2 (transmit) x 2 (receive) diversity technology\n\nSupports Bluetooth\n\nSupports MU-MIMO\n* Wi-Fi 7 (6GHz band) will be supported by Microsoft® Windows® 11.  The availability will depend on the different regulation status of each country and region.  It will be activated (for supported countries) through Windows Update and software updates once available."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.4"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 4 (Type C) (40 Gb/s)*\n*Supports USB PD 3.0 up to 5V@3A (15W) charging)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "5"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "Audio Jacks",
            "value": "1 x Line Out\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button\n\n1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "4"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN\n\n1 x AIO_PUMP\n\n3 x SYS_FAN"
          },
          {
            "label": "NZXT RGB + PWM Header (8-pin)",
            "value": "2"
          },
          {
            "label": "NZXT RGB Header (4-pin)",
            "value": "1 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "2 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n2 x 8-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x Digital Debug LED\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N9-X87XT-B1 (Black)\n\nN9-X87XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074847308 (Black)\n\n810074847292 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547207261 (Black)\n\n5056547207254 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "AM5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "memoryType": {
        "value": "DDR5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "memoryCapacity": {
        "value": 192,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "chipset": {
        "value": "AMD® X870E",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 4\nM.2 Slots: M2_1\n\nBlazing M.2 Socket, PCIe 5.0 (supports x4 mode) @ 128 Gb/s via CPU\n\nSupports 2280 form factor\nM2_2, M2_3, M2_4\n\nHyper M.2 Socket, PCIe 4.0 (supports x4 mode) @ 64 Gb/s via Chipset\n\nSupports 2280 form factor\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0, RAID 1, and RAID 10 for SATA storage devices\n\nSupports RAID 0, RAID 1, and RAID 10 for NVMe storage devices\nSupports NVMe SSD as boot disks: Yes",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "pcie": {
        "value": "PCIe Slots: PCIEX16_1\n\nPCIe 5.0 x16 (supports x16 mode) via CPU\nPCIEX16_2\n\nPCIe 3.0 x 16 (supports x2 mode) via Chipset",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "rearIO": {
        "value": "USB 4 (Type C) (40 Gb/s)*\n*Supports USB PD 3.0 up to 5V@3A (15W) charging): 2\nUSB 3.2 Gen 2 (Type-A): 5\nUSB 3.2 Gen 1 (Type-A): 3\nUSB 2.0 (Type-A): 2\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\nAudio Jacks: 1 x Line Out\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x BIOS Flashback Button\n\n1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 4\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 2 (Up to 2 ports per header)\nUSB 2.0 Header: 2 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN\n\n1 x AIO_PUMP\n\n3 x SYS_FAN\nNZXT RGB + PWM Header (8-pin): 2\nNZXT RGB Header (4-pin): 1 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 2 *\n* Supports up to 40 LEDs per header\nATX Power Header: 1 x 24-pin ATX Power\n\n2 x 8-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x Digital Debug LED\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8126CG\n\n5 Gigabit LAN 10/100/1000/2500/5000 MB/s\nOnboard WLAN (WiFi) Controller: MediaTek MT7925B232M Wi-Fi 7\n\nSupports IEEE 802.11 a/b/g/n/ac/ax/axe/be\n\nSupports 2.4 GHz / 5 GHz / 6 GHz* frequency band\n\nSupports 160 MHz channel bandwidth with 6 GHz* frequency band\n\n1 antenna to support 2 (transmit) x 2 (receive) diversity technology\n\nSupports Bluetooth\n\nSupports MU-MIMO\n* Wi-Fi 7 (6GHz band) will be supported by Microsoft® Windows® 11.  The availability will depend on the different regulation status of each country and region.  It will be activated (for supported countries) through Windows Update and software updates once available.\nBluetooth Version: Bluetooth V5.4\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "audio": {
        "value": "Realtek® ALC4080",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "cpuSupport": {
        "value": "Socket: AMD®AM5\nAMD® Socket AM5 Ryzen™ Processors7000, 8000, and 9000* Series\n* BIOS version 3.20 required for44 9800X3D support.  See note at bottom of spec sheet for more details.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N9 X870E"
  },
  "import-mb-bf441b24004c": {
    "mpn": "N7-Z69XT-B1",
    "identityNote": "NZXT documente N7 Z690 et la référence commerciale N7-Z69XT-B1 pour la finition Black. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "LGA1700",
      "memoryType": "DDR4",
      "maxMemoryGB": 128,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-Z69XT-B1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 Z690",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "Intel® Z690"
          },
          {
            "label": "Socket Type",
            "value": "Intel® LGA 1700"
          },
          {
            "label": "CPU Support",
            "value": "Intel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Multi-GPU Support",
            "value": "AMD Quad CrossFireX™ and CrossFireX™ *\n\n* Only supported on PCIe Gen 4 x1 Slots"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Hybrid Technology\n\nIntel® Turbo Boost Max 3.0 Technology"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR4 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Base Frequency Support",
            "value": "2933 MHz\n\n2800 MHz\n\n2666 MHz\n\n2400 MHz\n\n2133 MHz"
          },
          {
            "label": "Max Memory Speed",
            "value": "5000+ MHz (Overclock) *\nPlease refer to Memory QVL for more details.\n\n*Supports DDR4 3200 MHz natively"
          },
          {
            "label": "Memory Supported",
            "value": "Non-ECC un-buffered memory\n\nSupports ECC UDIMM Memory (operates in non-ECC mode)"
          },
          {
            "label": "Intel® XMP 2.0 Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "Intel® Xe Graphics"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1 TMDS Compatible"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Additional Features",
            "value": "HDCP 2.3 Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "2"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "2"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1 *PCIe Gen 5 x16\n\nPCIEX16_2 *PCIe Gen 4 x4\n\nPCIEX16_3 *PCIe 3.0 x4\n\nPCIEX1_1, PCIEX1_2PCIe Gen 4 x1\n* Supports NVMe SSD as boot disks"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "2 (M2_1, M2_3)"
          },
          {
            "label": "M2 Type 2242/2260/2280/22110 Slots\n(M-Key)",
            "value": "1 (M2_2)"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1, M2_2PCIe Gen 4 x4 *\n\nM2_3PCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Audio",
        "rows": [
          {
            "label": "Audio Controller",
            "value": "Realtek® ALC1220 Codec"
          },
          {
            "label": "Channels",
            "value": "8-channel High Definition Audio"
          },
          {
            "label": "Playback",
            "value": "32-bit @ 192,000 Hz DAC"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x Clear CMOS Button\n\n1 x BIOS Flashback Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "3"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "1 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "1 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "1 *\n*Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters."
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-Z69XT-B1 (Black)\n\nN7-Z69XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074840194 (Black)\n\n810074840187 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547200125 (Black)\n\n5056547200118 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "LGA1700",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "Intel® Z690",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 2 (M2_1, M2_3)\nM2 Type 2242/2260/2280/22110 Slots\n(M-Key): 1 (M2_2)\nM.2 Type: M2_1, M2_2PCIe Gen 4 x4 *\n\nM2_3PCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices\nAdditional Features: Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 2\nUSB 3.2 Gen 1 (Type-A): 3\nUSB 2.0 (Type-A): 2\nHDMI™ 2.1: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x Clear CMOS Button\n\n1 x BIOS Flashback Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 3\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 1 (Up to 2 ports per header)\nUSB 2.0 Header: 2 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 1 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 1 *\n*Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters.\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: Bluetooth V5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: Intel® LGA 1700\nIntel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 Z690"
  },
  "import-mb-7a5b3d0ce34e": {
    "mpn": "N7-Z69XT-W1",
    "identityNote": "NZXT documente N7 Z690 et la référence commerciale N7-Z69XT-W1 pour la finition White. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "LGA1700",
      "memoryType": "DDR4",
      "maxMemoryGB": 128,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-Z69XT-W1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 Z690",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "Intel® Z690"
          },
          {
            "label": "Socket Type",
            "value": "Intel® LGA 1700"
          },
          {
            "label": "CPU Support",
            "value": "Intel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Multi-GPU Support",
            "value": "AMD Quad CrossFireX™ and CrossFireX™ *\n\n* Only supported on PCIe Gen 4 x1 Slots"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Hybrid Technology\n\nIntel® Turbo Boost Max 3.0 Technology"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR4 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Base Frequency Support",
            "value": "2933 MHz\n\n2800 MHz\n\n2666 MHz\n\n2400 MHz\n\n2133 MHz"
          },
          {
            "label": "Max Memory Speed",
            "value": "5000+ MHz (Overclock) *\nPlease refer to Memory QVL for more details.\n\n*Supports DDR4 3200 MHz natively"
          },
          {
            "label": "Memory Supported",
            "value": "Non-ECC un-buffered memory\n\nSupports ECC UDIMM Memory (operates in non-ECC mode)"
          },
          {
            "label": "Intel® XMP 2.0 Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "Intel® Xe Graphics"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1 TMDS Compatible"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Additional Features",
            "value": "HDCP 2.3 Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "2"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "2"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1 *PCIe Gen 5 x16\n\nPCIEX16_2 *PCIe Gen 4 x4\n\nPCIEX16_3 *PCIe 3.0 x4\n\nPCIEX1_1, PCIEX1_2PCIe Gen 4 x1\n* Supports NVMe SSD as boot disks"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "2 (M2_1, M2_3)"
          },
          {
            "label": "M2 Type 2242/2260/2280/22110 Slots\n(M-Key)",
            "value": "1 (M2_2)"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1, M2_2PCIe Gen 4 x4 *\n\nM2_3PCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Audio",
        "rows": [
          {
            "label": "Audio Controller",
            "value": "Realtek® ALC1220 Codec"
          },
          {
            "label": "Channels",
            "value": "8-channel High Definition Audio"
          },
          {
            "label": "Playback",
            "value": "32-bit @ 192,000 Hz DAC"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x Clear CMOS Button\n\n1 x BIOS Flashback Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "3"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "1 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "1 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "1 *\n*Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters."
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-Z69XT-B1 (Black)\n\nN7-Z69XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074840194 (Black)\n\n810074840187 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547200125 (Black)\n\n5056547200118 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "LGA1700",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "Intel® Z690",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 2 (M2_1, M2_3)\nM2 Type 2242/2260/2280/22110 Slots\n(M-Key): 1 (M2_2)\nM.2 Type: M2_1, M2_2PCIe Gen 4 x4 *\n\nM2_3PCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices\nAdditional Features: Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 2\nUSB 3.2 Gen 1 (Type-A): 3\nUSB 2.0 (Type-A): 2\nHDMI™ 2.1: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x Clear CMOS Button\n\n1 x BIOS Flashback Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 3\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 1 (Up to 2 ports per header)\nUSB 2.0 Header: 2 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 1 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 1 *\n*Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters.\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: Bluetooth V5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: Intel® LGA 1700\nIntel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693508967323-N7-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 Z690"
  },
  "import-mb-efe60d5c17fa": {
    "mpn": "N5-Z69XT-B1",
    "identityNote": "NZXT documente N5 Z690 et la référence commerciale N5-Z69XT-B1 pour la finition Black. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "LGA1700",
      "memoryType": "DDR4",
      "maxMemoryGB": 128,
      "m2Slots": 3,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N5-Z69XT-B1",
      "detailLevel": "partial",
      "manufacturerModel": "N5 Z690",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "Intel® Z690"
          },
          {
            "label": "Socket Type",
            "value": "Intel® LGA 1700"
          },
          {
            "label": "CPU Support",
            "value": "Intel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Multi-GPU Support",
            "value": "AMD Quad CrossFireX™ and CrossFireX™ *\n\n* Only supported on PCIe Gen 3 x1 Slots"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Hybrid Technology\n\nIntel® Turbo Boost Max 3.0 Technology"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR4 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Base Frequency Support",
            "value": "2933 MHz\n\n2800 MHz\n\n2666 MHz\n\n2400 MHz\n\n2133 MHz"
          },
          {
            "label": "Max Memory Speed",
            "value": "5000+ MHz (Overclock) *\nPlease refer to Memory QVL for more details.\n\n* Supports DDR4 3200 MHz natively"
          },
          {
            "label": "Memory Supported",
            "value": "Non-ECC un-buffered memory\n\nSupports ECC UDIMM Memory (operates in non-ECC mode)"
          },
          {
            "label": "Intel® XMP 2.0 Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "Intel® Xe Graphics"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1 TMDS Compatible"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Additional Features",
            "value": "HDCP 2.3 Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x1 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "3"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1 *\n\nPCIe Gen 5 x16\nPCIEX16_2 *\n\nPCIe Gen 4 x4\nPCIEX16_3 *\n\nPCIe 3.0 x4\nPCIEX1_1, PCIEX1_2\n\nPCIe 3.0 x1\n* Supports NVMe SSD as boot disks"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "4"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\nM2_4\n\nPCIe 3.0 x4 *\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Audio",
        "rows": [
          {
            "label": "Audio Controller",
            "value": "Realtek® ALC897 Codec"
          },
          {
            "label": "Channels",
            "value": "8-channel High Definition Audio"
          },
          {
            "label": "Playback",
            "value": "32-bit @ 192,000 Hz DAC"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "4"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Speaker/Line-Out\n\n1 x Line-In\n\n1 x Microphone"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "4"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "1 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n4 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "1 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters."
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x POST LEDs\n\n1 x SPI TPM Header"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N5-Z69XT-B1 (Black)\n\nN5-Z69XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "815671016034 (Black)\n\n815671016027 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547200149 (Black)\n\n5056547200132 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "LGA1700",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "memoryType": {
        "value": "DDR4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "m2": {
        "value": 3,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "chipset": {
        "value": "Intel® Z690",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 4\nM.2 Type: M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\nM2_4\n\nPCIe 3.0 x4 *\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices\nAdditional Features: Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 1\nUSB 3.2 Gen 1 (Type-A): 4\nUSB 2.0 (Type-A): 2\nHDMI™ 2.1: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Speaker/Line-Out\n\n1 x Line-In\n\n1 x Microphone\nAdditional Features: 1 x BIOS Flashback Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 4\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 2 (Up to 2 ports per header)\nUSB 2.0 Header: 1 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n4 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 1 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters.\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x POST LEDs\n\n1 x SPI TPM Header",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: Bluetooth V5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "cpuSupport": {
        "value": "Socket: Intel® LGA 1700\nIntel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N5 Z690"
  },
  "import-mb-0761e1a03547": {
    "mpn": "N9-X87XT-W1",
    "identityNote": "NZXT documente N9 X870E et la référence commerciale N9-X87XT-W1 pour la finition White. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "AM5",
      "memoryType": "DDR5",
      "maxMemoryGB": 192,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N9-X87XT-W1",
      "detailLevel": "partial",
      "manufacturerModel": "N9 X870E",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "AMD® X870E"
          },
          {
            "label": "Socket Type",
            "value": "AMD®AM5"
          },
          {
            "label": "CPU Support",
            "value": "AMD® Socket AM5 Ryzen™ Processors7000, 8000, and 9000* Series\n* BIOS version 3.20 required for44 9800X3D support.  See note at bottom of spec sheet for more details."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "Tri-Band WiFi 7, Bluetooth 5.4"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "NZXT CAM Support",
            "value": "Yes"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR5 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "192 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Max Memory Speed",
            "value": "Please refer to Memory QVL on the download page for further information."
          },
          {
            "label": "XMP Support",
            "value": "Yes"
          },
          {
            "label": "AMD EXPO Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics & Audio",
        "rows": [
          {
            "label": "Audio Codec",
            "value": "Realtek® ALC4080"
          },
          {
            "label": "Graphics Controller",
            "value": "AMD RDNA™ Graphics\n(Requires a supported AMD Ryzen CPU with embedded graphics)"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "2 x USB4, Supports HDCP 2.3\n\nOnly the CPU's embedded graphics can be displayed through USB4 ports.  To display to a USB-C monitor, please use AM5 Ryzen™ 9000, 8000, or 7000 processors with embedded graphics support."
          },
          {
            "label": "Maximum Resolution",
            "value": "7680 x 4320 @ 30Hz"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Support",
        "rows": [
          {
            "label": "PCIe Slots",
            "value": "PCIEX16_1\n\nPCIe 5.0 x16 (supports x16 mode) via CPU\nPCIEX16_2\n\nPCIe 3.0 x 16 (supports x2 mode) via Chipset"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "4"
          },
          {
            "label": "M.2 Slots",
            "value": "M2_1\n\nBlazing M.2 Socket, PCIe 5.0 (supports x4 mode) @ 128 Gb/s via CPU\n\nSupports 2280 form factor\nM2_2, M2_3, M2_4\n\nHyper M.2 Socket, PCIe 4.0 (supports x4 mode) @ 64 Gb/s via Chipset\n\nSupports 2280 form factor"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0, RAID 1, and RAID 10 for SATA storage devices\n\nSupports RAID 0, RAID 1, and RAID 10 for NVMe storage devices"
          },
          {
            "label": "Supports NVMe SSD as boot disks",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8126CG\n\n5 Gigabit LAN 10/100/1000/2500/5000 MB/s"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "MediaTek MT7925B232M Wi-Fi 7\n\nSupports IEEE 802.11 a/b/g/n/ac/ax/axe/be\n\nSupports 2.4 GHz / 5 GHz / 6 GHz* frequency band\n\nSupports 160 MHz channel bandwidth with 6 GHz* frequency band\n\n1 antenna to support 2 (transmit) x 2 (receive) diversity technology\n\nSupports Bluetooth\n\nSupports MU-MIMO\n* Wi-Fi 7 (6GHz band) will be supported by Microsoft® Windows® 11.  The availability will depend on the different regulation status of each country and region.  It will be activated (for supported countries) through Windows Update and software updates once available."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.4"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 4 (Type C) (40 Gb/s)*\n*Supports USB PD 3.0 up to 5V@3A (15W) charging)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "5"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "Audio Jacks",
            "value": "1 x Line Out\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button\n\n1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "4"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN\n\n1 x AIO_PUMP\n\n3 x SYS_FAN"
          },
          {
            "label": "NZXT RGB + PWM Header (8-pin)",
            "value": "2"
          },
          {
            "label": "NZXT RGB Header (4-pin)",
            "value": "1 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "2 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n2 x 8-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x Digital Debug LED\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N9-X87XT-B1 (Black)\n\nN9-X87XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074847308 (Black)\n\n810074847292 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547207261 (Black)\n\n5056547207254 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "AM5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "memoryType": {
        "value": "DDR5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "memoryCapacity": {
        "value": 192,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "chipset": {
        "value": "AMD® X870E",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 4\nM.2 Slots: M2_1\n\nBlazing M.2 Socket, PCIe 5.0 (supports x4 mode) @ 128 Gb/s via CPU\n\nSupports 2280 form factor\nM2_2, M2_3, M2_4\n\nHyper M.2 Socket, PCIe 4.0 (supports x4 mode) @ 64 Gb/s via Chipset\n\nSupports 2280 form factor\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0, RAID 1, and RAID 10 for SATA storage devices\n\nSupports RAID 0, RAID 1, and RAID 10 for NVMe storage devices\nSupports NVMe SSD as boot disks: Yes",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "pcie": {
        "value": "PCIe Slots: PCIEX16_1\n\nPCIe 5.0 x16 (supports x16 mode) via CPU\nPCIEX16_2\n\nPCIe 3.0 x 16 (supports x2 mode) via Chipset",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "rearIO": {
        "value": "USB 4 (Type C) (40 Gb/s)*\n*Supports USB PD 3.0 up to 5V@3A (15W) charging): 2\nUSB 3.2 Gen 2 (Type-A): 5\nUSB 3.2 Gen 1 (Type-A): 3\nUSB 2.0 (Type-A): 2\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\nAudio Jacks: 1 x Line Out\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x BIOS Flashback Button\n\n1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 4\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 2 (Up to 2 ports per header)\nUSB 2.0 Header: 2 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN\n\n1 x AIO_PUMP\n\n3 x SYS_FAN\nNZXT RGB + PWM Header (8-pin): 2\nNZXT RGB Header (4-pin): 1 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 2 *\n* Supports up to 40 LEDs per header\nATX Power Header: 1 x 24-pin ATX Power\n\n2 x 8-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x Digital Debug LED\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8126CG\n\n5 Gigabit LAN 10/100/1000/2500/5000 MB/s\nOnboard WLAN (WiFi) Controller: MediaTek MT7925B232M Wi-Fi 7\n\nSupports IEEE 802.11 a/b/g/n/ac/ax/axe/be\n\nSupports 2.4 GHz / 5 GHz / 6 GHz* frequency band\n\nSupports 160 MHz channel bandwidth with 6 GHz* frequency band\n\n1 antenna to support 2 (transmit) x 2 (receive) diversity technology\n\nSupports Bluetooth\n\nSupports MU-MIMO\n* Wi-Fi 7 (6GHz band) will be supported by Microsoft® Windows® 11.  The availability will depend on the different regulation status of each country and region.  It will be activated (for supported countries) through Windows Update and software updates once available.\nBluetooth Version: Bluetooth V5.4\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "audio": {
        "value": "Realtek® ALC4080",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "cpuSupport": {
        "value": "Socket: AMD®AM5\nAMD® Socket AM5 Ryzen™ Processors7000, 8000, and 9000* Series\n* BIOS version 3.20 required for44 9800X3D support.  See note at bottom of spec sheet for more details.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/40065553382683-N9-X870E-Specs",
        "checkedAt": "2026-11-10T14:01:45+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N9 X870E"
  },
  "import-mb-d2c7d688f1da": {
    "mpn": "N7-B65XT-B1",
    "identityNote": "NZXT documente N7 B650E et la référence commerciale N7-B65XT-B1 pour la finition Black. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "AM5",
      "memoryType": "DDR5",
      "maxMemoryGB": 128,
      "m2Slots": 3,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-B65XT-B1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 B650E",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "AMD® B650E"
          },
          {
            "label": "Socket Type",
            "value": "AMD®AM5"
          },
          {
            "label": "CPU Support",
            "value": "AMD Socket AM5 Ryzen™ Processors7000 Series*\n\n8000 & 9000 Series**\n* BIOS version 1.21 required forAMD® Ryzen™ 7000 Series X3D CPUs.\n\n** BIOS version 3.01 or newer required for  AMD® Ryzen™ 8000 & 9000"
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "Dual-Band WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "NZXT CAM Support",
            "value": "Yes"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR5 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual-Channel"
          },
          {
            "label": "Max Memory Speed",
            "value": "Please refer to Memory QVL on the download page for further information."
          },
          {
            "label": "XMP Support",
            "value": "Yes"
          },
          {
            "label": "AMD EXPO Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics & Audio",
        "rows": [
          {
            "label": "Audio Codec",
            "value": "ALC1220 Codec"
          },
          {
            "label": "Graphics Controller",
            "value": "AMD RDNA™ Graphics\n(Requires a supported AMD Ryzen CPU with embedded graphics)"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI 2.1, supports HDR & HDCP 2.3"
          },
          {
            "label": "Maximum Resolution",
            "value": "4830 x 2160 (4K) @ 60Hz"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Support",
        "rows": [
          {
            "label": "PCIe Slots",
            "value": "PCIEX16_1\n\nPCIe 5.0 x16 (Supports x16 Mode) via CPU\n\nSupports NVMe SSD as boot disks.\nPCIEX16_2 & PCIEX16_3\n\nPCIe 4.0 x16 (Supports x2 Mode) via Chipset\n\nSupports NVMe SSD as boot disks."
          },
          {
            "label": "M.2 Socket (E-Key)",
            "value": "1 (Supports 2230 form factor Wi-Fi/BT PCIe modules) via Chipset"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "3"
          },
          {
            "label": "M.2 Slots",
            "value": "M.2_1\n\nPCIe 5.0(Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_2\n\nPCIe 4.0 (Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_3\n\nPCIe 4.0 (Supports x2 Mode) via Chipset\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks."
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/10 for SATA storage devices\n\nSupports RAID 0/1/10 for M.2 NVMe storage devices"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "MediaTek MT7921K (RZ608) Wi-Fi 6E\n\nSupports IEEE 802.11 a/b/g/n/ac/ax\n\nSupports Dual Band 2x2 with extended 6GHz band support*\n\nSupports MU-MIMO\n\nSupports Bluetooth + High speed class II\n* Wi-Fi 6E (6GHz band) will be supported by Microsoft® Windows® 11.  Availability may vary by country and region. A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "4"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "Wireless Antenna",
            "value": "2"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Audio Jacks",
            "value": "1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1x Line In\n\n1 x Line Out (Speaker Left/Right)\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button\n\n1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "3"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "1"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x 4-pin (PWM) CPU_FAN connector (Up to 24W per channel)\n\n1 x 4-pin (PWM) AIO_PUMP connector (Up to 24W per channel)\n\n5 x 4-pin (PWM) SYS_FAN connectors (Up to 24W per channel)"
          },
          {
            "label": "NZXT RGB Header (4-pin)",
            "value": "4"
          },
          {
            "label": "5V ARGB Header",
            "value": "2"
          },
          {
            "label": "ATX Power Header",
            "value": "1x 24-pin ATX Power Connector\n\n1x 8+4-pin ATX 12V Power Connector"
          },
          {
            "label": "Additional Features",
            "value": "Power Button\n\nReset Button\n\nPOST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-B65XT-B1 (Black)\n\nN7-B65XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074842884 (Black)\n\n810074842877 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547202822 (Black)\n\n5056547202815 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "AM5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 3,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "AMD® B650E",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 3\nM.2 Slots: M.2_1\n\nPCIe 5.0(Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_2\n\nPCIe 4.0 (Supports x4 Mode) via CPU\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nM.2_3\n\nPCIe 4.0 (Supports x2 Mode) via Chipset\n\nSupports 2242, 2260, & 2280 form factor\n\nSupports NVMe SSD as boot disks.\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/10 for SATA storage devices\n\nSupports RAID 0/1/10 for M.2 NVMe storage devices",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "pcie": {
        "value": "PCIe Slots: PCIEX16_1\n\nPCIe 5.0 x16 (Supports x16 Mode) via CPU\n\nSupports NVMe SSD as boot disks.\nPCIEX16_2 & PCIEX16_3\n\nPCIe 4.0 x16 (Supports x2 Mode) via Chipset\n\nSupports NVMe SSD as boot disks.\nM.2 Socket (E-Key): 1 (Supports 2230 form factor Wi-Fi/BT PCIe modules) via Chipset",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type-C): 1\nUSB 3.2 Gen 2 (Type-A): 2\nUSB 3.2 Gen 1 (Type-A): 4\nUSB 2.0 (Type-A): 2\nWireless Antenna: 2\nLAN (RJ45): 1\nHDMI™ 2.1: 1\nAudio Jacks: 1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1x Line In\n\n1 x Line Out (Speaker Left/Right)\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x BIOS Flashback Button\n\n1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 3\nM.2 (E-Key) Slot: 1\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 1\nUSB 2.0 Header: 2\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x 4-pin (PWM) CPU_FAN connector (Up to 24W per channel)\n\n1 x 4-pin (PWM) AIO_PUMP connector (Up to 24W per channel)\n\n5 x 4-pin (PWM) SYS_FAN connectors (Up to 24W per channel)\nNZXT RGB Header (4-pin): 4\n5V ARGB Header: 2\nATX Power Header: 1x 24-pin ATX Power Connector\n\n1x 8+4-pin ATX 12V Power Connector\nAdditional Features: Power Button\n\nReset Button\n\nPOST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\nOnboard WLAN (WiFi) Controller: MediaTek MT7921K (RZ608) Wi-Fi 6E\n\nSupports IEEE 802.11 a/b/g/n/ac/ax\n\nSupports Dual Band 2x2 with extended 6GHz band support*\n\nSupports MU-MIMO\n\nSupports Bluetooth + High speed class II\n* Wi-Fi 6E (6GHz band) will be supported by Microsoft® Windows® 11.  Availability may vary by country and region. A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: 5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "audio": {
        "value": "ALC1220 Codec",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: AMD®AM5\nAMD Socket AM5 Ryzen™ Processors7000 Series*\n\n8000 & 9000 Series**\n* BIOS version 1.21 required forAMD® Ryzen™ 7000 Series X3D CPUs.\n\n** BIOS version 3.01 or newer required for  AMD® Ryzen™ 8000 & 9000",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/41500739318043-N7-B650E-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 B650E"
  },
  "import-mb-6a7f99d034ac": {
    "mpn": "N7-Z79XT-B1",
    "identityNote": "NZXT documente N7 Z790 et la référence commerciale N7-Z79XT-B1 pour la finition Black. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "LGA1700",
      "memoryType": "DDR5",
      "maxMemoryGB": 192,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-Z79XT-B1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 Z790",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "Intel® Z790"
          },
          {
            "label": "Socket Type",
            "value": "Intel® LGA 1700"
          },
          {
            "label": "CPU Support",
            "value": "Intel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 14th Generation support may require an additional BIOS update prior to installation."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.3"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Hybrid Technology\n\nIntel® Turbo Boost Max 3.0 Technology\n\nIntel® Thermal Velocity Boost (TVB)\n\nIntel® Adaptive Boost Technology (ABT)"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR5 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "192 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Max Memory Speed",
            "value": "7200+ MHz (Overclock)\nPlease refer to Memory QVL for more details."
          },
          {
            "label": "Memory Supported",
            "value": "Non-ECC un-buffered memory"
          },
          {
            "label": "Intel® XMP 2.0 Support",
            "value": "Yes"
          },
          {
            "label": "AMD Extended Profiles for Overclocking (AMD EXPO™) Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "Intel® Xe Graphics"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1 TMDS Compatible"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Additional Features",
            "value": "HDCP 2.3 Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "2"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "2"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1 *\n\nPCIe Gen 5 x16\nPCIEX16_2 & PCIEX16_3 *\n\nPCIe Gen 4 x4\nPCIEX1_1, PCIEX1_2\n\nPCIe Gen 3.0 x1\n* Supports NVMe SSD as boot disks"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "2 (M2_1, M2_3)"
          },
          {
            "label": "M2 Type 2242/2260/2280/22110 Slots\n(M-Key)",
            "value": "1 (M2_2)"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.3"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Audio",
        "rows": [
          {
            "label": "Audio Controller",
            "value": "Realtek® ALC1220 Codec"
          },
          {
            "label": "Channels",
            "value": "8-channel High Definition Audio"
          },
          {
            "label": "Playback",
            "value": "32-bit @ 192,000 Hz DAC"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "2"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.0",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "3"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "1 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "4 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "2 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "0"
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-Z79XT-B1 (Black)\n\nN7-Z79XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "810074843010 (Black)\n\n810074843003 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547202952 (Black)\n\n5056547202945 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "LGA1700",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR5",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 192,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "Intel® Z790",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 2 (M2_1, M2_3)\nM2 Type 2242/2260/2280/22110 Slots\n(M-Key): 1 (M2_2)\nM.2 Type: M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices\nAdditional Features: Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 2\nUSB 3.2 Gen 1 (Type-A): 3\nUSB 2.0 (Type-A): 2\nHDMI™ 2.0: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 3\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 1 (Up to 2 ports per header)\nUSB 2.0 Header: 2 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 4 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 2 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 0\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: Bluetooth V5.3\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: Intel® LGA 1700\nIntel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 14th Generation support may require an additional BIOS update prior to installation.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37693799549211-N7-Z790-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 Z790"
  },
  "import-mb-711c7b0835b7": {
    "mpn": "N7-B55XT-B1",
    "identityNote": "NZXT documente N7 B550 et la référence commerciale N7-B55XT-B1 pour la finition Black. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "AM4",
      "memoryType": "DDR4",
      "maxMemoryGB": 128,
      "m2Slots": 2,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N7-B55XT-B1",
      "detailLevel": "partial",
      "manufacturerModel": "N7 B550",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "AMD® B550"
          },
          {
            "label": "Socket Type",
            "value": "AMD®AM4"
          },
          {
            "label": "CPU Support",
            "value": "AMD Socket AM4 Ryzen™ Processors\n3000, 4000, and 5000 Series\n\nDoes notsupport AMD Ryzen™ 5 3400G or Ryzen™ 3 3200G"
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Multi-GPU Support",
            "value": "AMD 2-Way CrossFireX™ Technology"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR4 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Base Frequency Support",
            "value": "3200 MHz\n\n2933 MHz\n\n2667 MHz\n\n2400 MHz\n\n2133 MHz"
          },
          {
            "label": "Max Memory Speed",
            "value": "4666+ MHz (Vermeer & Matisse CPU)\n\n4733+ MHz (Renoir APU)"
          },
          {
            "label": "ECC Support",
            "value": "ECC and non-ECC un-buffered memory"
          },
          {
            "label": "XMP Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "AMD Radeon™ Vega Series Graphics\n(Requires a supported AMD Ryzen APU)"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Maximum Shared Memory",
            "value": "16GB (with 32GB DRAM installed)"
          },
          {
            "label": "Microsoft PlayReady® Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "2"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1\n\nPCIe 4.0 x16 (Vermeer & Matisse CPUs)\n\nPCIe 3.0 x16 (Renoir CPUs)\nPCIE3\n\nPCIe 3.0 x4\nPCIE2 & PCIE4\n\nPCIe 3.0 x1"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "2"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1\n\nPCIe 4.0 x4 (Vermeer & Matisse CPUs)\n\nPCIe 3.0 x4 (Renoir CPUs)\nM2_2\n\nPCIe 3.0 x2 orSATA *\n* M2_2 and SATA3_5_6 use shared lanes."
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "6 *\nSupport for RAID 0/1/5/10, NCQ, AHCI, and Hot Plug\n\n* M2_2 and SATA3_5_6 use shared lanes."
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz)\n\nSupports MU-MIMO"
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "3"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "4"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button\n\n1 x Clear CMOS Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "2"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "6"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "3 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "1 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters."
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N7-B55XT-B1 (Black)\n\nN7-B55XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "815671015242 (Black)\n\n815671015235 (White)"
          },
          {
            "label": "EAN",
            "value": "5060301696680 (Black)\n\n5060301696697 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "AM4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryType": {
        "value": "DDR4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "m2": {
        "value": 2,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "chipset": {
        "value": "AMD® B550",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 2\nM.2 Type: M2_1\n\nPCIe 4.0 x4 (Vermeer & Matisse CPUs)\n\nPCIe 3.0 x4 (Renoir CPUs)\nM2_2\n\nPCIe 3.0 x2 orSATA *\n* M2_2 and SATA3_5_6 use shared lanes.\nSATA 6Gb/s Ports: 6 *\nSupport for RAID 0/1/5/10, NCQ, AHCI, and Hot Plug\n\n* M2_2 and SATA3_5_6 use shared lanes.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 3\nUSB 3.2 Gen 1 (Type-A): 4\nUSB 2.0 (Type-A): 2\nHDMI™ 2.1: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Front Surround/Stereo LR\n\n1 x Center/Subwoofer\n\n1 x Rear Surround\n\n1 x Line-In\n\n1 x Microphone\n\n1 x Optical SPDIF Out\nAdditional Features: 1 x BIOS Flashback Button\n\n1 x Clear CMOS Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 2\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 6\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 2 (Up to 2 ports per header)\nUSB 2.0 Header: 3 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n5 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 1 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters.\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x Power Button\n\n1 x Reset Button\n\n1 x POST LEDs",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz)\n\nSupports MU-MIMO\nBluetooth Version: Bluetooth V5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "cpuSupport": {
        "value": "Socket: AMD®AM4\nAMD Socket AM4 Ryzen™ Processors\n3000, 4000, and 5000 Series\n\nDoes notsupport AMD Ryzen™ 5 3400G or Ryzen™ 3 3200G",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37547153004827-N7-B550-Specs",
        "checkedAt": "2026-11-10T14:01:42+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N7 B550"
  },
  "import-mb-41eff72a5398": {
    "mpn": "N5-Z69XT-W1",
    "identityNote": "NZXT documente N5 Z690 et la référence commerciale N5-Z69XT-W1 pour la finition White. Les références des autres finitions restent distinctes.",
    "sources": [
      {
        "name": "NZXT — spécifications et références couleur officielles",
        "url": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "socket": "LGA1700",
      "memoryType": "DDR4",
      "maxMemoryGB": 128,
      "m2Slots": 3,
      "formFactor": "ATX",
      "manufacturerPartNumber": "N5-Z69XT-W1",
      "detailLevel": "partial",
      "manufacturerModel": "N5 Z690",
      "memorySlots": 4
    },
    "groups": [
      {
        "title": "NZXT — General",
        "rows": [
          {
            "label": "Form Factor",
            "value": "ATX"
          },
          {
            "label": "Chipset",
            "value": "Intel® Z690"
          },
          {
            "label": "Socket Type",
            "value": "Intel® LGA 1700"
          },
          {
            "label": "CPU Support",
            "value": "Intel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation."
          },
          {
            "label": "DIMM Slots",
            "value": "4"
          },
          {
            "label": "Wireless Support",
            "value": "WiFi 6E, Bluetooth 5.2"
          },
          {
            "label": "Operating System",
            "value": "Windows® 10 64-bit or newer"
          },
          {
            "label": "Multi-GPU Support",
            "value": "AMD Quad CrossFireX™ and CrossFireX™ *\n\n* Only supported on PCIe Gen 3 x1 Slots"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Hybrid Technology\n\nIntel® Turbo Boost Max 3.0 Technology"
          },
          {
            "label": "Warranty",
            "value": "3 Years"
          }
        ]
      },
      {
        "title": "NZXT — Memory",
        "rows": [
          {
            "label": "DIMM Type",
            "value": "DDR4 288-pin"
          },
          {
            "label": "Max Memory Capacity",
            "value": "128 GB"
          },
          {
            "label": "Memory Architecture",
            "value": "Dual Channel"
          },
          {
            "label": "Base Frequency Support",
            "value": "2933 MHz\n\n2800 MHz\n\n2666 MHz\n\n2400 MHz\n\n2133 MHz"
          },
          {
            "label": "Max Memory Speed",
            "value": "5000+ MHz (Overclock) *\nPlease refer to Memory QVL for more details.\n\n* Supports DDR4 3200 MHz natively"
          },
          {
            "label": "Memory Supported",
            "value": "Non-ECC un-buffered memory\n\nSupports ECC UDIMM Memory (operates in non-ECC mode)"
          },
          {
            "label": "Intel® XMP 2.0 Support",
            "value": "Yes"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Graphics",
        "rows": [
          {
            "label": "Graphics Controller",
            "value": "Intel® Xe Graphics"
          },
          {
            "label": "Integrated Graphics Output",
            "value": "HDMI™ 2.1 TMDS Compatible"
          },
          {
            "label": "Maximum Resolution",
            "value": "4096 x 2160 @ 60Hz"
          },
          {
            "label": "Additional Features",
            "value": "HDCP 2.3 Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Expansion Slots",
        "rows": [
          {
            "label": "PCIe x16 (x16 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x4 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe x16 (x1 Mode) Slots",
            "value": "1"
          },
          {
            "label": "PCIe  x1 Slots",
            "value": "3"
          },
          {
            "label": "PCIe Type",
            "value": "PCIEX16_1 *\n\nPCIe Gen 5 x16\nPCIEX16_2 *\n\nPCIe Gen 4 x4\nPCIEX16_3 *\n\nPCIe 3.0 x4\nPCIEX1_1, PCIEX1_2\n\nPCIe 3.0 x1\n* Supports NVMe SSD as boot disks"
          }
        ]
      },
      {
        "title": "NZXT — Storage Support",
        "rows": [
          {
            "label": "M.2 Type 2242/2260/2280 Slots\n(M-Key)",
            "value": "4"
          },
          {
            "label": "M.2 Type",
            "value": "M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\nM2_4\n\nPCIe 3.0 x4 *\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks"
          },
          {
            "label": "SATA 6Gb/s Ports",
            "value": "4"
          },
          {
            "label": "RAID Support",
            "value": "Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices"
          },
          {
            "label": "Additional Features",
            "value": "Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory"
          }
        ]
      },
      {
        "title": "NZXT — Network and Wireless Support",
        "rows": [
          {
            "label": "Onboard LAN Controller",
            "value": "Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az"
          },
          {
            "label": "Onboard WLAN (WiFi) Controller",
            "value": "Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality."
          },
          {
            "label": "Bluetooth Version",
            "value": "Bluetooth V5.2"
          },
          {
            "label": "Included Antenna(s)",
            "value": "2x \"Pen Type\" RP-SMA Male Compatible"
          }
        ]
      },
      {
        "title": "NZXT — Integrated Audio",
        "rows": [
          {
            "label": "Audio Controller",
            "value": "Realtek® ALC897 Codec"
          },
          {
            "label": "Channels",
            "value": "8-channel High Definition Audio"
          },
          {
            "label": "Playback",
            "value": "32-bit @ 192,000 Hz DAC"
          }
        ]
      },
      {
        "title": "NZXT — Rear I/O",
        "rows": [
          {
            "label": "USB 3.2 Gen 2 (Type C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 2 (Type-A)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 (Type-A)",
            "value": "4"
          },
          {
            "label": "USB 2.0 (Type-A)",
            "value": "2"
          },
          {
            "label": "HDMI™ 2.1",
            "value": "1"
          },
          {
            "label": "Wireless Antenna",
            "value": "2 (2T2R)"
          },
          {
            "label": "LAN (RJ45)",
            "value": "1"
          },
          {
            "label": "5.1-Channel Audio Jacks",
            "value": "1 x Speaker/Line-Out\n\n1 x Line-In\n\n1 x Microphone"
          },
          {
            "label": "Additional Features",
            "value": "1 x BIOS Flashback Button"
          }
        ]
      },
      {
        "title": "NZXT — Internal I/O",
        "rows": [
          {
            "label": "M.2 (M-Key) Slot",
            "value": "4"
          },
          {
            "label": "M.2 (E-Key) Slot",
            "value": "1 *\n* For included wireless card"
          },
          {
            "label": "SATA 6Gbps Port",
            "value": "4"
          },
          {
            "label": "USB 3.2 Gen 2 Header (for Type-C)",
            "value": "1"
          },
          {
            "label": "USB 3.2 Gen 1 Header (for Type-A)",
            "value": "2 (Up to 2 ports per header)"
          },
          {
            "label": "USB 2.0 Header",
            "value": "1 (Up to 2 ports per header)"
          },
          {
            "label": "Front Panel Audio",
            "value": "1"
          },
          {
            "label": "4-pin PWM Fan Header",
            "value": "1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n4 x SYS_FAN (Up to 24W)"
          },
          {
            "label": "NZXT RGB Header",
            "value": "2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header."
          },
          {
            "label": "5V ARGB Header",
            "value": "1 *\n* Supports up to 40 LEDs per header"
          },
          {
            "label": "12V RGB Header",
            "value": "1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters."
          },
          {
            "label": "ATX Power Header",
            "value": "1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power"
          },
          {
            "label": "Additional Features",
            "value": "1 x POST LEDs\n\n1 x SPI TPM Header"
          }
        ]
      },
      {
        "title": "NZXT — Product Info",
        "rows": [
          {
            "label": "Model Number",
            "value": "N5-Z69XT-B1 (Black)\n\nN5-Z69XT-W1 (White)"
          },
          {
            "label": "UPC",
            "value": "815671016034 (Black)\n\n815671016027 (White)"
          },
          {
            "label": "EAN",
            "value": "5056547200149 (Black)\n\n5056547200132 (White)"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.",
      "Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.",
      "Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus."
    ],
    "fieldEvidence": {
      "socket": {
        "value": "LGA1700",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "memoryType": {
        "value": "DDR4",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "memoryCapacity": {
        "value": 128,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "m2": {
        "value": 3,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "formFactor": {
        "value": "ATX",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "chipset": {
        "value": "Intel® Z690",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "storagePorts": {
        "value": "M.2 Type 2242/2260/2280 Slots\n(M-Key): 4\nM.2 Type: M2_1, M2_2\n\nPCIe Gen 4 x4 *\nM2_3\n\nPCIe Gen 4 x4 * orSATA\nM2_4\n\nPCIe 3.0 x4 *\n* Supports Intel® Volume Management Device, Intel® Optane Technology, & NVMe SSD as boot disks\nSATA 6Gb/s Ports: 4\nRAID Support: Supports RAID 0/1/5/10 for SATA storage devices\n\nSupports RAID 0/1/5 for M.2 NVMe storage devices\nAdditional Features: Intel® Smart Response Technology\n\nIntel® Rapid Storage Technology\n\nIntel® Optane Memory",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "rearIO": {
        "value": "USB 3.2 Gen 2 (Type C): 1\nUSB 3.2 Gen 2 (Type-A): 1\nUSB 3.2 Gen 1 (Type-A): 4\nUSB 2.0 (Type-A): 2\nHDMI™ 2.1: 1\nWireless Antenna: 2 (2T2R)\nLAN (RJ45): 1\n5.1-Channel Audio Jacks: 1 x Speaker/Line-Out\n\n1 x Line-In\n\n1 x Microphone\nAdditional Features: 1 x BIOS Flashback Button",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "internalIO": {
        "value": "M.2 (M-Key) Slot: 4\nM.2 (E-Key) Slot: 1 *\n* For included wireless card\nSATA 6Gbps Port: 4\nUSB 3.2 Gen 2 Header (for Type-C): 1\nUSB 3.2 Gen 1 Header (for Type-A): 2 (Up to 2 ports per header)\nUSB 2.0 Header: 1 (Up to 2 ports per header)\nFront Panel Audio: 1\n4-pin PWM Fan Header: 1 x CPU_FAN (Up to 24W)\n\n1 x AIO_PUMP (Up to 24W)\n\n4 x SYS_FAN (Up to 24W)\nNZXT RGB Header: 2 *\n* Supports up to 5 NZXT RGB devices, 40 LEDs total per header.\n5V ARGB Header: 1 *\n* Supports up to 40 LEDs per header\n12V RGB Header: 1 *\n* Supports 5050 RGB LED strips with a maximum power rating of 12V 3A (36W) and length within 2 meters.\nATX Power Header: 1 x 24-pin ATX Power\n\n1 x 8-pin ATX 12V Power\n\n1 x 4-pin ATX 12V Power\nAdditional Features: 1 x POST LEDs\n\n1 x SPI TPM Header",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "network": {
        "value": "Onboard LAN Controller: Realtek® RTL8125BG 2.5G LAN\n\nSupport for Wake-on-LAN\n\nSupports Energy Efficient Ethernet 802.3az\nOnboard WLAN (WiFi) Controller: Intel Dual Band Wireless-AX210 Wi-Fi 6E\n\nSupports WiFi 802.11 a/b/g/n/ac/ax\n\nSupports Bluetooth\n\nSupport for dual band frequency (2.4/5GHz, 6GHz *)\n\nSupports MU-MIMO\n*Wi-Fi 6E (6GHz band) is supported by Microsoft® Windows® 11, availability may vary based on country and region.  A 6GHz compatible router is required for 6E functionality.\nBluetooth Version: Bluetooth V5.2\nIncluded Antenna(s): 2x \"Pen Type\" RP-SMA Male Compatible",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "cpuSupport": {
        "value": "Socket: Intel® LGA 1700\nIntel® 14th Generation CPUs *\n\nIntel® 13th Generation CPUs *\n\nIntel® 12th Generation CPUs\nSee CPU Support List for more details.\n* Intel® 13th & 14th Generation support may require an additional BIOS update prior to installation.",
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      },
      "memorySlots": {
        "value": 4,
        "sourceURL": "https://support.nzxt.com/hc/en-us/articles/37682479388443-N5-Z690-Specs",
        "checkedAt": "2026-11-10T14:01:46+00:00"
      }
    },
    "identityKind": "mpn",
    "manufacturerModel": "N5 Z690"
  }
};
