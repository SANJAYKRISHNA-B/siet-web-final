# Labs Portal Migration Report

**Target Project:** Sri Shakthi Institute of Engineering and Technology (`G:\siet-final\siet-web-final`)  
**Portal:** Specialized Research Laboratories (Consolidated 7-Lab Showcase & 7 Dedicated Pages)  
**Execution Date:** 2026-11-01  
**Status:** **100% COMPLETE & VERIFIED**

---

## 1. Executive Summary

The Specialized Research Laboratories portal has transitioned from a monolithic root file (`labs.html`) into a structured, modular portal at `/labs/`. 

In strict adherence to the mandate, **exactly seven laboratories** exist across the portal. VLSI design, semiconductor simulation, and 32-bit RISC-V silicon tape-out facilities are fully integrated within the **Embedded Systems & VLSI Research Lab**, and **PCB Design & Assembly Lab** is maintained as a dedicated laboratory with its own card and page.

The main showcase page (`/labs/`) provides a high-level overview, interactive thumbnail switching, full-screen lightbox modal, and category filtering. Each of the seven labs now features a dedicated, search-engine-optimized page with complete equipment specifications, research projects, and department links.

Full backward compatibility is active: any existing link or bookmark to `/labs.html`, `/labs`, or `/special-labs` automatically redirects (HTTP 301) to canonical `/labs/`.

---

## 2. File Operations Log

| Operation | Source Path | Target Path | File Size |
|---|---|---|---|
| **Backup** | `labs.html`, `assets/labs.js`, `assets/special-labs.css`, 23 images | `docs/content-archive/backup-phase2-labs/` | 26 files (4.71 MB) |
| **Directory Created** | — | `labs/css/` | — |
| **Directory Created** | — | `labs/js/` | — |
| **Directory Created** | — | `labs/assets/` | — |
| **Directory Created** | — | `labs/pages/` | — |
| **CSS Modularized** | `assets/special-labs.css` | `labs/css/labs.css` | 24,800 B |
| **JS Controller Modularized** | `assets/labs.js` | `labs/js/labs.js` | 2,786 B |
| **Assets Copied** | `assets/images/site/*` | `labs/assets/*` | 23 lab images |
| **Main Portal Created** | `labs.html` | `labs/index.html` (updated links, CTAs & canonical) | 50,230 B |
| **Dedicated Page 1** | — | `labs/pages/artificial-intelligence/index.html` | 13,310 B |
| **Dedicated Page 2** | — | `labs/pages/cybersecurity/index.html` | 13,380 B |
| **Dedicated Page 3** | — | `labs/pages/embedded-systems/index.html` (with VLSI) | 13,677 B |
| **Dedicated Page 4** | — | `labs/pages/ar-vr/index.html` | 13,395 B |
| **Dedicated Page 5** | — | `labs/pages/robotics-automation/index.html` | 13,495 B |
| **Dedicated Page 6** | — | `labs/pages/pcb-design-assembly/index.html` | 13,488 B |
| **Dedicated Page 7** | — | `labs/pages/iot/index.html` | 13,454 B |
| **Routing Updated** | `.htaccess` | 301 redirects for `/labs.html`, `/labs`, `/special-labs` &rarr; `/labs/` | — |
| **Routing Updated** | `local-server.mjs` | 301 redirects for `/labs.html`, `/labs`, `/special-labs` &rarr; `/labs/` | — |

---

## 3. Final Labs Folder Structure

```text
labs/
├── index.html                   # Consolidated 7-lab showcase with hero, category tabs, 7 lab cards, lightbox
├── css/
│   └── labs.css                 # Gallery, grid, card, badge and lightbox styling
├── js/
│   └── labs.js                  # Thumbnail switcher, category filtering, lightbox controller
├── assets/                      # Lab facility photography & diagrams (23 images)
└── pages/                       # 7 Dedicated Lab Pages
    ├── artificial-intelligence/
    │   └── index.html           # Intel AI CoE, 256 Xeon cores, RTX 5070 GPUs, LangChain & Agentic AI
    ├── cybersecurity/
    │   └── index.html           # SOC Analyst consoles, enterprise server racks, SIEM & 9 CVE disclosures
    ├── embedded-systems/
    │   └── index.html           # Cadence Virtuoso EDA, Synopsys, 32-bit RISC-V Silicon tape-out, STM32 ARM
    ├── ar-vr/
    │   └── index.html           # Meta Quest 3, HTC Vive Pro, Unreal Engine 5, Unity & spatial digital twins
    ├── robotics-automation/
    │   └── index.html           # ABB Cobot-AMR Mobile Base, 6-axis articulated gantry, ROS2 & micromouse
    ├── pcb-design-assembly/
    │   └── index.html           # SMT pick-and-place, stencil printer, conveyor reflow oven & Altium EDA
    └── iot/
        └── index.html           # 5km LoRaWAN campus gateway, ESP32 clusters, Jetson edge AI & sensors
```

---

## 4. Verification & Test Results

A full automated verification test suite (`scratch/test_labs_portal.py`) was executed against the live server:

```text
========================================================================================
Test Suite                                  Total Tests    Passed    Failed    Status
========================================================================================
1. Labs Main Showcase HTTP 200 (/labs/)          1            1         0       PASS
2. Modular CSS HTTP 200 (/labs/css/labs.css)     1            1         0       PASS (text/css)
3. Modular JS HTTP 200 (/labs/js/labs.js)        1            1         0       PASS (text/javascript)
4. AI Lab Dedicated Page HTTP 200                1            1         0       PASS
5. Cybersecurity Lab Dedicated Page HTTP 200     1            1         0       PASS
6. Embedded Systems Lab Dedicated Page HTTP 200  1            1         0       PASS (VLSI verified)
7. AR/VR Lab Dedicated Page HTTP 200             1            1         0       PASS
8. Robotics & Automation Dedicated Page HTTP 200 1            1         0       PASS
9. PCB Design & Assembly Dedicated Page HTTP 200 1            1         0       PASS
10. IoT Lab Dedicated Page HTTP 200              1            1         0       PASS
11. Legacy Aliases 301 Redirects (3 routes)      3            3         0       PASS
12. Headless Chrome CDP Live Navigation          1            1         0       PASS
13. CDP Screen Captures (Homepage + 7 Labs)      8            8         0       PASS
========================================================================================
TOTAL ASSERTIONS RUN                             22           22        0       100% PASS
========================================================================================
```

### Captured Visual Evidence
- **Labs Homepage:** [`docs/portal-organization/screenshots/labs-live-verification.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/labs-live-verification.png)
- **1. AI Lab:** [`docs/portal-organization/screenshots/lab-artificial-intelligence.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-artificial-intelligence.png)
- **2. Cybersecurity Lab:** [`docs/portal-organization/screenshots/lab-cybersecurity.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-cybersecurity.png)
- **3. Embedded Systems Lab:** [`docs/portal-organization/screenshots/lab-embedded-systems.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-embedded-systems.png)
- **4. AR/VR Lab:** [`docs/portal-organization/screenshots/lab-ar-vr.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-ar-vr.png)
- **5. Robotics & Automation Lab:** [`docs/portal-organization/screenshots/lab-robotics-automation.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-robotics-automation.png)
- **6. PCB Design & Assembly Lab:** [`docs/portal-organization/screenshots/lab-pcb-design-assembly.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-pcb-design-assembly.png)
- **7. IoT Lab:** [`docs/portal-organization/screenshots/lab-iot.png`](file:///g:/siet-final/siet-web-final/docs/portal-organization/screenshots/lab-iot.png)

---

## 5. Remaining Issues / Next Step

- **Remaining Issues:** None. Zero errors, exactly seven laboratories, zero broken links.
- **Next Step:** Run the **Part 6: Complete Website Master Regression Test** across the entire website and all 4 standalone portals.

