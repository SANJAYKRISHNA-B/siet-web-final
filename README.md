# Sri Shakthi Institute of Engineering & Technology (SIET) — Official Web Portal

[![Autonomous Institution](https://img.shields.io/badge/Status-Autonomous-075b36.svg)](https://www.siet.ac.in)
[![NAAC Accreditation](https://img.shields.io/badge/NAAC-Grade_%27A%27-0b7a48.svg)](https://www.siet.ac.in)
[![NBA Accredited](https://img.shields.io/badge/NBA-Accredited_Programmes-f3c515.svg?labelColor=043f27)](https://www.siet.ac.in)
[![TNEA Code](https://img.shields.io/badge/TNEA_Counselling_Code-2727-blue.svg)](https://www.siet.ac.in)
[![Anna University](https://img.shields.io/badge/Affiliation-Anna_University-green.svg)](https://www.siet.ac.in)

> **"Powering the Youth. Empowering the Nation."**  
> Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore, Tamil Nadu, India.

---

## 🏛️ Overview

This repository hosts the official high-performance web portal and affiliated microsites of **Sri Shakthi Institute of Engineering and Technology (SIET)**. The platform provides comprehensive academic and campus information, student admission workflows, research lab showcases, placement records, conference portals, and institutional governance disclosures.

### 🌟 Portals & Modules

| Route | Portal / Module | Description |
| :--- | :--- | :--- |
| **`/`** | **Institutional Portal** | Main university homepage, admissions enquiry, academic departments, faculty directory, placements, and campus life. |
| **`/sssm/`** | **Sri Shakthi Space Mission (SSM)** | Sri Shakthi Space Mission and Space Whiz 2026 Online Quiz competition portal. |
| **`/mdfi/`** | **My Dream India (MDFI)** | Sri Shakthi India Leadership & Cultural Centre (SSILCC) State-Level Essay Competition portal. |
| **`/icchi/`** | **ICCHI 2027 Conference** | 7th International Conference on Computational and Healthcare Innovations portal. |
| **`/dcs-summary`**| **DCS Governance Module** | Institutional statutory compliance and Departmental Coordination System summary. |

---

## 📂 Repository Directory Structure

```text
siet-website-portal/
├── assets/                      # Production scripts, styles, and module bundles
│   ├── *.js                     # Modular JavaScript logic and page controllers
│   ├── *.css                    # Scoped and global stylesheets
│   └── images/                  # Bundled component graphical assets
├── brand/                       # High-resolution institutional brand assets
│   ├── achievers/               # Student toppers, rank holders, and achievers
│   ├── campus-life/             # Infrastructure, hostels, sports, and amenities
│   ├── events/                  # Seminars, cultural fests, and hackathons
│   ├── placement-company-logo/  # Tier-1 recruiters and corporate partner logos
│   ├── placement-records/       # Highest package highlights and placement banners
│   ├── special-labs/            # 7 Advanced Research Laboratories showcase imagery
│   └── *.webp, *.png, *.svg     # Crests, logos, headers, and hero banners
├── downloads/                   # Public institutional documents & syllabi
│   ├── anna-univ-affiliation/   # Anna University affiliation approvals
│   ├── mandatory-disclosure/    # AICTE mandatory public disclosures
│   ├── naac/                    # NAAC certificates and self-study reports (SSR)
│   ├── nba/                     # NBA accreditation orders and certificates
│   ├── nirf/                    # NIRF ranking submissions
│   └── syllabus/                # Autonomous curriculum syllabi across regulations
├── faculty/                     # Departmental faculty profile portraits
│   ├── aero/                    # Aeronautical Engineering
│   ├── agri/                    # Agricultural Engineering
│   ├── ai-ds/                   # Artificial Intelligence & Data Science
│   ├── bme/                     # Biomedical Engineering
│   ├── biotechnology/           # Biotechnology
│   ├── civil/                   # Civil Engineering
│   ├── cse/                     # Computer Science & Engineering
│   ├── cse-cyber/               # CSE (Cyber Security)
│   ├── ece/                     # Electronics & Communication Engineering
│   ├── eee/                     # Electrical & Electronics Engineering
│   ├── it/                      # Information Technology
│   ├── mechanical/              # Mechanical Engineering
│   └── s-and-h/                 # Science & Humanities
├── icchi/                       # ICCHI 2027 International Conference portal
│   └── index.html               # Conference proceedings, committee, and call-for-papers
├── mdfi/                        # My Dream India (SSILCC) portal
│   └── index.html               # State-Level Essay Competition information and entry
├── sssm/                        # Sri Shakthi Space Mission portal
│   └── space-whiz-poster.png    # Space Mission highlights and Space Whiz 2026 poster
├── .gitignore                   # Standard Git ignore rules for build artifacts & temp files
├── .htaccess                    # Apache HTTP Server production rewrite & caching rules
├── favicon.ico                  # Institutional tab favicon
├── index.html                   # Primary application entry point
├── local-server.mjs             # High-performance local Node.js development server
└── README.md                    # Repository documentation and architecture guide
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version `18.0.0` or higher
- Modern Web Browser (Chrome, Firefox, Edge, Safari)

### Local Development Server

Run the built-in, zero-dependency development server with live routing, dynamic form processing, and automatic WebP content negotiation:

```powershell
# Start the local development server (default port: 4173)
node local-server.mjs

# Custom port (optional)
$env:PORT="5000"; node local-server.mjs
```

Once running, access the portals locally at:

- Institutional Portal: [http://localhost:4173/](http://localhost:4173/)
- Sri Shakthi Space Mission: [http://localhost:4173/sssm/](http://localhost:4173/sssm/)
- My Dream India: [http://localhost:4173/mdfi/](http://localhost:4173/mdfi/)
- ICCHI 2027 Conference: [http://localhost:4173/icchi/](http://localhost:4173/icchi/)
- DCS Governance Summary: [http://localhost:4173/dcs-summary](http://localhost:4173/dcs-summary)
- Apply form: [http://localhost:4173/apply](http://localhost:4173/apply)

---

## 🎨 Asset Management Guidelines

To maintain speed, low bandwidth consumption, and top-tier Core Web Vitals:

1. **Asset Placement**:
   - Institutional and marketing graphics belong in `brand/`.
   - Downloadable PDFs and certificates belong in `downloads/`.
   - Faculty photographs belong in their corresponding `faculty/<dept>/` folder.
   - **Never store loose images or documents in the project root.**
2. **Next-Gen WebP Formatting**:
   - All raster graphics must be provided in modern `.webp` format alongside legacy `.png`/`.jpg` counterparts.
   - The server dynamically delivers WebP to compatible browsers via the `Vary: Accept` header.
3. **Naming Conventions**:
   - Use lowercase kebab-case (`kebab-case.webp`) for all files and directories.
   - Avoid spaces and uppercase characters in filenames.

---

## 🛡️ Production Deployment

The project is configured for deployment on any modern web server:

- **Apache HTTP Server**: `.htaccess` provides URL rewrite rules for Single Page Application (SPA) routes and static asset caching.
- **Nginx**: Configure `try_files $uri $uri/ /index.html;` for client-side routing.

---

## 👥 Contributors & Maintainers

- **Sri Shakthi Institute of Engineering and Technology**  
  Sri Shakthi Nagar, L&T By-Pass, Chinniyampalayam Post, Coimbatore - 641062, Tamil Nadu, India.
- **Development & Maintenance:** Designed and developed by the **CSE Team**.
