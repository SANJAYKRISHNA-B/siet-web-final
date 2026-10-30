# SIET Website — Image Duplicate & Optimization Audit Report

**Date:** 2026-10-30 11:48:32
**Project Root:** `G:\siet-final\siet-web-final`
**Backup Directory:** `docs/content-archive/duplicate-images-backup/`

## Executive Summary

A comprehensive inventory scan and multi-tier duplicate analysis was performed across all image asset directories in the SIET website repository. All confirmed unreferenced duplicate image files were backed up 1:1 and safely removed, while preserving 100% of website references, all high-resolution master assets, all unique photographs, and transparent brand marks.

| Metric | Count / Volume |
| :--- | :--- |
| **Total Images Scanned** | **1,182** |
| **Exact Duplicate Groups (Identical SHA-256)** | **36 groups** (154 files) |
| **Same-Folder Multi-Format Duplicate Groups** | **517 groups** (1,038 files) |
| **Redundant Duplicate Files Safely Removed** | **477 files** |
| **Unique & Canonical Images Preserved** | **705 files** |
| **Active Website Image References Working** | **100% Verified (0 broken links)** |
| **Storage Space Saved** | **112.88 MB** (118,364,353 bytes) |

## Storage Space Saved by Folder

| Asset Folder | Removed Files | Space Saved (MB) | Active Canonical Format |
| :--- | :---: | :---: | :--- |
| `assets/images/site` | 15 | 31.87 MB | `.webp` (High performance) |
| `brand/campus-life` | 20 | 19.57 MB | `.webp` (High performance) |
| `brand` | 31 | 19.12 MB | `.webp` (High performance) |
| `faculty/aiml-faculty-images` | 22 | 7.44 MB | `.webp` (High performance) |
| `assets/images/all-img` | 30 | 4.00 MB | `.webp` (High performance) |
| `faculty/cse-faculty-images` | 48 | 3.72 MB | `.webp` (High performance) |
| `assets/images/course` | 16 | 3.10 MB | `.webp` (High performance) |
| `faculty/ece-faculty-images` | 29 | 2.69 MB | `.webp` (High performance) |
| `faculty/aids-faculty-images` | 29 | 2.60 MB | `.webp` (High performance) |
| `faculty/eee-faculty-images` | 16 | 2.11 MB | `.webp` (High performance) |
| `assets/images/banner` | 3 | 1.76 MB | `.webp` (High performance) |
| `assets/images/event` | 9 | 1.58 MB | `.webp` (High performance) |
| `faculty/agri_faculty_photos` | 10 | 1.50 MB | `.webp` (High performance) |
| `faculty/civil-faculty-images` | 13 | 1.49 MB | `.webp` (High performance) |
| `faculty/it-faculty-images` | 25 | 1.45 MB | `.webp` (High performance) |
| `brand/events` | 18 | 1.43 MB | `.webp` (High performance) |
| `brand/special-labs` | 5 | 1.22 MB | `.webp` (High performance) |
| `assets/images/blog` | 13 | 1.10 MB | `.webp` (High performance) |
| `brand/placement-records` | 5 | 1.03 MB | `.webp` (High performance) |
| `faculty/mech-faculty-images` | 12 | 0.89 MB | `.webp` (High performance) |
| `faculty/bme-faculty-images` | 11 | 0.86 MB | `.webp` (High performance) |
| `assets/images/category` | 8 | 0.53 MB | `.webp` (High performance) |
| `faculty/biotech-faculty-images` | 12 | 0.42 MB | `.webp` (High performance) |
| `faculty/cyber-faculty-images` | 22 | 0.41 MB | `.webp` (High performance) |
| `faculty/ece-vlsi-ug-new-faculty-images` | 5 | 0.35 MB | `.webp` (High performance) |
| `assets/images/shop` | 12 | 0.22 MB | `.webp` (High performance) |
| `assets/images/departments/biomedical` | 5 | 0.17 MB | `.webp` (High performance) |
| `brand/placement-company-logo/line-2` | 9 | 0.10 MB | `.webp` (High performance) |
| `brand/placement-company-logo/line-1` | 9 | 0.08 MB | `.webp` (High performance) |
| `assets/images/team` | 4 | 0.05 MB | `.webp` (High performance) |
| `assets/images/clients` | 6 | 0.02 MB | `.webp` (High performance) |
| `assets/images/all-img/clients` | 5 | 0.01 MB | `.webp` (High performance) |

## Key Decisions & Safety Safeguards

1. **Absolute Reference Verification**: Every single removed file was audited against all HTML, JS, CSS, JSON, and Markdown files across the codebase to guarantee `ref_count == 0`.
2. **Master Logos & Brand Assets Preserved**:
   - `brand/siet-institution-logo.png` (1254x1254 high-resolution master logo) retained.
   - `brand/siet-exact-header.png` (2048x256 high-resolution header banner) retained.
   - `brand/siet-logo.png` (256x256 transparent PNG) and `brand/siet-logo.webp` both retained.
   - `brand/techpark-local.png` (2824x1472, 9.1 MB master render) retained.
   - `brand/siet-logo-white-motto.svg` and `brand/naac-logo.svg` retained.
3. **Master Student Portrait Archive Preserved**:
   - All 50 `brand/achievers/*.jpg` master 1024x1024 high-resolution portraits retained.
4. **Unique Event Photographs Preserved**:
   - All 22 WhatsApp event photographs in `brand/campus-life/` retained for site integration.
5. **Dual-Referenced Compliance Documents Preserved**:
   - `brand/anna-university-affiliation.jpg` & `.webp` retained.
   - `brand/nba-accreditation-ece-agri-ft.jpg` & `.webp` retained.
   - `brand/siet-location-map.png` & `.webp` retained.
   - `brand/space-whiz-poster.png` & `ssm/space-whiz-poster.png` retained.

## Detailed Itemization of Removed Redundant Files

| Removed File Path | Dimensions | File Size | Retained Canonical Version | Canonical Dimensions | Canonical Refs |
| :--- | :---: | :---: | :--- | :---: | :---: |
| `assets/images/all-img/about-image.jpg` | 667x1000 | 599.2 KB | `assets/images/all-img/about-image.webp` | 667x1000 | 0 |
| `assets/images/all-img/about1.jpg` | 1000x1000 | 63.4 KB | `assets/images/all-img/about1.webp` | 1000x1000 | 0 |
| `assets/images/all-img/about1.png` | 643x750 | 468.1 KB | `assets/images/all-img/about1.webp` | 1000x1000 | 0 |
| `assets/images/all-img/about2.png` | 590x620 | 95.4 KB | `assets/images/all-img/about2.webp` | 590x620 | 0 |
| `assets/images/all-img/about3.png` | 640x632 | 157.1 KB | `assets/images/all-img/about3.webp` | 640x632 | 0 |
| `assets/images/all-img/app-store.jpg` | 220x80 | 2.6 KB | `assets/images/all-img/app-store.webp` | 220x80 | 0 |
| `assets/images/all-img/avator.png` | 45x44 | 4.4 KB | `assets/images/all-img/avator.webp` | 45x44 | 0 |
| `assets/images/all-img/back.png` | 64x64 | 0.4 KB | `assets/images/all-img/back.webp` | 64x64 | 0 |
| `assets/images/all-img/become-ins.png` | 700x800 | 509.1 KB | `assets/images/all-img/become-ins.webp` | 700x800 | 0 |
| `assets/images/all-img/client02.png` | 130x130 | 27.0 KB | `assets/images/all-img/client02.webp` | 130x130 | 0 |
| `assets/images/all-img/client03.png` | 130x130 | 30.3 KB | `assets/images/all-img/client03.webp` | 130x130 | 0 |
| `assets/images/all-img/client04.png` | 130x130 | 28.3 KB | `assets/images/all-img/client04.webp` | 130x130 | 0 |
| `assets/images/all-img/cmnt-1.png` | 72x72 | 8.5 KB | `assets/images/all-img/cmnt-1.webp` | 72x72 | 0 |
| `assets/images/all-img/faq.png` | 560x637 | 361.1 KB | `assets/images/all-img/faq.webp` | 560x637 | 0 |
| `assets/images/all-img/free-course.png` | 700x800 | 325.8 KB | `assets/images/all-img/free-course.webp` | 700x800 | 0 |
| `assets/images/all-img/google-play.jpg` | 220x80 | 2.5 KB | `assets/images/all-img/google-play.webp` | 220x80 | 0 |
| `assets/images/all-img/home-image.png` | 730x760 | 503.5 KB | `assets/images/all-img/home-image.webp` | 730x760 | 0 |
| `assets/images/all-img/home-img1.png` | 645x750 | 463.0 KB | `assets/images/all-img/home-img1.webp` | 645x750 | 0 |
| `assets/images/all-img/ins-details.png` | 184x184 | 49.9 KB | `assets/images/all-img/ins-details.webp` | 184x184 | 0 |
| `assets/images/all-img/instractor1.jpg` | 500x550 | 24.3 KB | `assets/images/all-img/instractor1.webp` | 500x550 | 0 |
| `assets/images/all-img/instractor2.jpg` | 500x550 | 17.8 KB | `assets/images/all-img/instractor2.webp` | 500x550 | 0 |
| `assets/images/all-img/logo.png` | 250x70 | 2.3 KB | `assets/images/all-img/logo.webp` | 250x70 | 0 |
| `assets/images/all-img/next.png` | 64x64 | 0.4 KB | `assets/images/all-img/next.webp` | 64x64 | 0 |
| `assets/images/all-img/rc-1.png` | 80x82 | 16.6 KB | `assets/images/all-img/rc-1.webp` | 80x82 | 0 |
| `assets/images/all-img/rc-2.png` | 80x82 | 14.8 KB | `assets/images/all-img/rc-2.webp` | 80x82 | 0 |
| `assets/images/all-img/rc-3.png` | 80x82 | 15.9 KB | `assets/images/all-img/rc-3.webp` | 80x82 | 0 |
| `assets/images/all-img/t1.png` | 270x270 | 85.5 KB | `assets/images/all-img/t1.webp` | 270x270 | 0 |
| `assets/images/all-img/t2.png` | 270x270 | 92.3 KB | `assets/images/all-img/t2.webp` | 270x270 | 0 |
| `assets/images/all-img/t3.png` | 270x270 | 113.3 KB | `assets/images/all-img/t3.webp` | 270x270 | 0 |
| `assets/images/all-img/clients/1.png` | 234x80 | 2.2 KB | `assets/images/all-img/clients/1.webp` | 234x80 | 0 |
| `assets/images/all-img/clients/2.png` | 234x80 | 3.5 KB | `assets/images/all-img/clients/2.webp` | 234x80 | 0 |
| `assets/images/all-img/clients/3.png` | 234x80 | 2.4 KB | `assets/images/all-img/clients/3.webp` | 234x80 | 3 |
| `assets/images/all-img/clients/4.png` | 234x80 | 2.5 KB | `assets/images/all-img/clients/4.webp` | 234x80 | 0 |
| `assets/images/all-img/clients/5.png` | 234x80 | 3.3 KB | `assets/images/all-img/clients/5.webp` | 234x80 | 0 |
| `assets/images/banner/bg-scaled.jpg` | 2560x1651 | 30.1 KB | `assets/images/banner/bg-scaled.webp` | 1920x1238 | 0 |
| `assets/images/banner/home-bg.jpg` | 1920x960 | 32.6 KB | `assets/images/banner/home-bg.webp` | 1920x960 | 0 |
| `assets/images/banner/video.jpg` | 2000x1333 | 1739.2 KB | `assets/images/banner/video.webp` | 1920x1280 | 0 |
| `assets/images/blog/1.jpg` | 826x551 | 51.9 KB | `assets/images/blog/1.webp` | 826x551 | 0 |
| `assets/images/blog/2.jpg` | 826x551 | 57.8 KB | `assets/images/blog/2.webp` | 826x551 | 0 |
| `assets/images/blog/3.jpg` | 740x493 | 34.1 KB | `assets/images/blog/3.webp` | 740x493 | 3 |
| `assets/images/blog/author.jpg` | 300x300 | 14.4 KB | `assets/images/blog/author.webp` | 300x300 | 0 |
| `assets/images/blog/banner.jpg` | 300x250 | 12.2 KB | `assets/images/blog/banner.webp` | 300x250 | 0 |
| `assets/images/blog/blog-1.png` | 370x260 | 171.1 KB | `assets/images/blog/blog-1.webp` | 370x260 | 0 |
| `assets/images/blog/blog-2.png` | 370x260 | 192.8 KB | `assets/images/blog/blog-2.webp` | 370x260 | 0 |
| `assets/images/blog/blog-3.png` | 370x260 | 181.8 KB | `assets/images/blog/blog-3.webp` | 370x260 | 0 |
| `assets/images/blog/blog-4.png` | 370x260 | 168.9 KB | `assets/images/blog/blog-4.webp` | 370x260 | 0 |
| `assets/images/blog/blog-5.png` | 370x260 | 206.7 KB | `assets/images/blog/blog-5.webp` | 370x260 | 0 |
| `assets/images/blog/c1.jpg` | 300x300 | 11.9 KB | `assets/images/blog/c1.webp` | 300x300 | 0 |
| `assets/images/blog/c2.jpg` | 300x300 | 9.4 KB | `assets/images/blog/c2.webp` | 300x300 | 0 |
| `assets/images/blog/c3.jpg` | 300x300 | 11.4 KB | `assets/images/blog/c3.webp` | 300x300 | 0 |
| `assets/images/category/cat1.jpg` | 282x227 | 66.1 KB | `assets/images/category/cat1.webp` | 282x227 | 2 |
| `assets/images/category/cat2.jpg` | 282x227 | 89.1 KB | `assets/images/category/cat2.webp` | 282x227 | 1 |
| `assets/images/category/cat3.jpg` | 282x227 | 54.6 KB | `assets/images/category/cat3.webp` | 282x227 | 1 |
| `assets/images/category/cat4.jpg` | 282x227 | 63.1 KB | `assets/images/category/cat4.webp` | 282x227 | 2 |
| `assets/images/category/cat5.jpg` | 282x227 | 62.8 KB | `assets/images/category/cat5.webp` | 282x227 | 3 |
| `assets/images/category/cat6.jpg` | 282x227 | 66.4 KB | `assets/images/category/cat6.webp` | 282x227 | 2 |
| `assets/images/category/cat7.jpg` | 282x227 | 82.5 KB | `assets/images/category/cat7.webp` | 282x227 | 3 |
| `assets/images/category/cat8.jpg` | 282x227 | 56.5 KB | `assets/images/category/cat8.webp` | 282x227 | 2 |
| `assets/images/clients/1.png` | 82x32 | 2.2 KB | `assets/images/clients/1.webp` | 82x32 | 0 |
| `assets/images/clients/2.png` | 103x32 | 2.4 KB | `assets/images/clients/2.webp` | 103x32 | 0 |
| `assets/images/clients/3.png` | 133x32 | 2.1 KB | `assets/images/clients/3.webp` | 133x32 | 3 |
| `assets/images/clients/4.png` | 108x32 | 2.5 KB | `assets/images/clients/4.webp` | 108x32 | 0 |
| `assets/images/clients/5.png` | 124x32 | 2.4 KB | `assets/images/clients/5.webp` | 124x32 | 0 |
| `assets/images/clients/6.png` | 150x150 | 5.6 KB | `assets/images/clients/6.webp` | 150x150 | 2 |
| `assets/images/course/1.jpg` | 720x484 | 98.4 KB | `assets/images/course/1.webp` | 720x484 | 0 |
| `assets/images/course/2.jpg` | 720x484 | 102.2 KB | `assets/images/course/2.webp` | 720x484 | 0 |
| `assets/images/course/3.jpg` | 720x484 | 275.0 KB | `assets/images/course/3.webp` | 720x484 | 3 |
| `assets/images/course/4.jpg` | 720x484 | 106.9 KB | `assets/images/course/4.webp` | 720x484 | 0 |
| `assets/images/course/5.jpg` | 720x484 | 120.8 KB | `assets/images/course/5.webp` | 720x484 | 0 |
| `assets/images/course/6.jpg` | 720x484 | 103.4 KB | `assets/images/course/6.webp` | 720x484 | 2 |
| `assets/images/course/c1.png` | 370x248 | 168.0 KB | `assets/images/course/c1.webp` | 370x248 | 0 |
| `assets/images/course/c10.png` | 550x386 | 402.7 KB | `assets/images/course/c10.webp` | 550x386 | 0 |
| `assets/images/course/c11.png` | 370x248 | 128.9 KB | `assets/images/course/c11.webp` | 370x248 | 0 |
| `assets/images/course/c12.png` | 370x248 | 177.4 KB | `assets/images/course/c12.webp` | 370x248 | 0 |
| `assets/images/course/c2.png` | 370x248 | 167.4 KB | `assets/images/course/c2.webp` | 370x248 | 0 |
| `assets/images/course/c3.png` | 370x248 | 148.0 KB | `assets/images/course/c3.webp` | 370x248 | 0 |
| `assets/images/course/c4.png` | 370x248 | 144.4 KB | `assets/images/course/c4.webp` | 370x248 | 0 |
| `assets/images/course/c7.png` | 550x386 | 368.2 KB | `assets/images/course/c7.webp` | 550x386 | 0 |
| `assets/images/course/c8.png` | 550x387 | 290.3 KB | `assets/images/course/c8.webp` | 550x387 | 0 |
| `assets/images/course/c9.png` | 550x386 | 371.9 KB | `assets/images/course/c9.webp` | 550x386 | 0 |
| `assets/images/departments/biomedical/bme-advanced-equipments-lab.jpg` | 452x246 | 46.1 KB | `assets/images/departments/biomedical/bme-advanced-equipments-lab.webp` | 452x246 | 1 |
| `assets/images/departments/biomedical/bme-lab-facility-overview.jpg` | 450x137 | 28.2 KB | `assets/images/departments/biomedical/bme-lab-facility-overview.webp` | 450x137 | 1 |
| `assets/images/departments/biomedical/bme-smart-glove-project.jpg` | 350x245 | 36.9 KB | `assets/images/departments/biomedical/bme-smart-glove-project.webp` | 350x245 | 1 |
| `assets/images/departments/biomedical/bme-virtual-keyboard-project.jpg` | 350x245 | 23.6 KB | `assets/images/departments/biomedical/bme-virtual-keyboard-project.webp` | 350x245 | 1 |
| `assets/images/departments/biomedical/bme-why-students-lab.jpg` | 390x224 | 40.0 KB | `assets/images/departments/biomedical/bme-why-students-lab.webp` | 390x224 | 1 |
| `assets/images/event/e1.png` | 370x270 | 165.2 KB | `assets/images/event/e1.webp` | 370x270 | 0 |
| `assets/images/event/e11.png` | 370x270 | 198.5 KB | `assets/images/event/e11.webp` | 370x270 | 0 |
| `assets/images/event/e2.png` | 370x270 | 177.4 KB | `assets/images/event/e2.webp` | 370x270 | 0 |
| `assets/images/event/e22.png` | 370x270 | 218.8 KB | `assets/images/event/e22.webp` | 370x270 | 0 |
| `assets/images/event/e3.png` | 370x270 | 201.9 KB | `assets/images/event/e3.webp` | 370x270 | 0 |
| `assets/images/event/e33.png` | 370x270 | 105.3 KB | `assets/images/event/e33.webp` | 370x270 | 0 |
| `assets/images/event/e4.png` | 370x270 | 193.7 KB | `assets/images/event/e4.webp` | 370x270 | 0 |
| `assets/images/event/e5.png` | 370x270 | 187.1 KB | `assets/images/event/e5.webp` | 370x270 | 0 |
| `assets/images/event/e6.png` | 370x270 | 168.2 KB | `assets/images/event/e6.webp` | 370x270 | 0 |
| `assets/images/shop/1.jpg` | 512x512 | 32.3 KB | `assets/images/shop/1.webp` | 512x512 | 0 |
| `assets/images/shop/1.png` | 512x512 | 7.8 KB | `assets/images/shop/1.webp` | 512x512 | 0 |
| `assets/images/shop/2.jpg` | 512x512 | 36.2 KB | `assets/images/shop/2.webp` | 512x512 | 0 |
| `assets/images/shop/3.jpg` | 512x512 | 12.6 KB | `assets/images/shop/3.webp` | 512x512 | 3 |
| `assets/images/shop/4.jpg` | 512x512 | 10.7 KB | `assets/images/shop/4.webp` | 512x512 | 0 |
| `assets/images/shop/5.jpg` | 512x512 | 9.9 KB | `assets/images/shop/5.webp` | 512x512 | 0 |
| `assets/images/shop/6.jpg` | 512x512 | 9.2 KB | `assets/images/shop/6.webp` | 512x512 | 2 |
| `assets/images/shop/7.jpg` | 512x512 | 8.0 KB | `assets/images/shop/7.webp` | 512x512 | 0 |
| `assets/images/shop/8.jpg` | 512x512 | 8.7 KB | `assets/images/shop/8.webp` | 512x512 | 0 |
| `assets/images/shop/cart1.jpg` | 512x512 | 38.0 KB | `assets/images/shop/cart1.webp` | 512x512 | 0 |
| `assets/images/shop/cart2.jpg` | 512x512 | 22.9 KB | `assets/images/shop/cart2.webp` | 512x512 | 0 |
| `assets/images/shop/cart3.jpg` | 512x512 | 32.3 KB | `assets/images/shop/cart3.webp` | 512x512 | 0 |
| `assets/images/site/ai.png` | 1672x941 | 2208.3 KB | `assets/images/site/ai.webp` | 1672x941 | 14 |
| `assets/images/site/ai1.png` | 1672x941 | 2156.1 KB | `assets/images/site/ai1.webp` | 1672x941 | 3 |
| `assets/images/site/arvr.png` | 1672x941 | 2227.2 KB | `assets/images/site/arvr.webp` | 1672x941 | 7 |
| `assets/images/site/arvr1.png` | 1672x941 | 1972.5 KB | `assets/images/site/arvr1.webp` | 1672x941 | 3 |
| `assets/images/site/arvr2.png` | 1672x941 | 2189.0 KB | `assets/images/site/arvr2.webp` | 1672x941 | 3 |
| `assets/images/site/cyber1.png` | 1672x941 | 2138.2 KB | `assets/images/site/cyber1.webp` | 1672x941 | 3 |
| `assets/images/site/cyber2.png` | 1536x1024 | 2192.0 KB | `assets/images/site/cyber2.webp` | 1536x1024 | 10 |
| `assets/images/site/embedded.png` | 1672x941 | 2238.9 KB | `assets/images/site/embedded.webp` | 1672x941 | 9 |
| `assets/images/site/embedded1.png` | 1672x940 | 2050.7 KB | `assets/images/site/embedded1.webp` | 1672x940 | 7 |
| `assets/images/site/iot.png` | 1672x941 | 2200.2 KB | `assets/images/site/iot.webp` | 1672x941 | 10 |
| `assets/images/site/iot1.png` | 1672x941 | 2215.4 KB | `assets/images/site/iot1.webp` | 1672x941 | 3 |
| `assets/images/site/robo.png` | 1672x941 | 2183.3 KB | `assets/images/site/robo.webp` | 1672x941 | 3 |
| `assets/images/site/robo1.png` | 1672x941 | 2379.1 KB | `assets/images/site/robo1.webp` | 1672x941 | 11 |
| `assets/images/site/vlsi.png` | 1672x941 | 2061.9 KB | `assets/images/site/vlsi.webp` | 1672x941 | 4 |
| `assets/images/site/vlsi1.png` | 1672x941 | 2220.5 KB | `assets/images/site/vlsi1.webp` | 1672x941 | 4 |
| `assets/images/team/1.jpg` | 360x414 | 14.2 KB | `assets/images/team/1.webp` | 360x414 | 0 |
| `assets/images/team/2.jpg` | 360x414 | 13.4 KB | `assets/images/team/2.webp` | 360x414 | 0 |
| `assets/images/team/3.jpg` | 360x414 | 11.1 KB | `assets/images/team/3.webp` | 360x414 | 3 |
| `assets/images/team/4.jpg` | 360x450 | 9.8 KB | `assets/images/team/4.webp` | 360x450 | 0 |
| `brand/agriculture-engineering.png` | 1408x768 | 2633.5 KB | `brand/agriculture-engineering.webp` | 1408x768 | 0 |
| `brand/campus-arch.jpg` | 640x427 | 75.0 KB | `brand/campus-arch.webp` | 640x427 | 50 |
| `brand/chairman-passport.png` | 340x350 | 120.8 KB | `brand/chairman-passport.webp` | 340x350 | 1 |
| `brand/chairman-photo.png` | 425x587 | 192.0 KB | `brand/chairman-photo.webp` | 425x587 | 0 |
| `brand/curriculum-hero.jpg` | 1376x768 | 918.3 KB | `brand/curriculum-hero.webp` | 1376x768 | 10 |
| `brand/departments-campus.jpg` | 1079x441 | 122.2 KB | `brand/departments-campus.webp` | 1079x441 | 10 |
| `brand/hero-techpark-latest.png` | 1280x579 | 1934.0 KB | `brand/hero-techpark-latest.webp` | 1280x579 | 3 |
| `brand/library-about.jpg` | 1200x896 | 898.3 KB | `brand/library-about.webp` | 1200x896 | 1 |
| `brand/library-hero.jpg` | 1376x768 | 751.3 KB | `brand/library-hero.webp` | 1376x768 | 2 |
| `brand/library-interior.jpg` | 1200x896 | 953.1 KB | `brand/library-interior.webp` | 1200x896 | 3 |
| `brand/library-study-hall.jpg` | 1376x768 | 851.8 KB | `brand/library-study-hall.webp` | 1376x768 | 6 |
| `brand/naac-grade-logo.jpg` | 225x225 | 8.9 KB | `brand/naac-grade-logo.webp` | 225x225 | 4 |
| `brand/naac-logo.png` | 16x16 | 0.7 KB | `brand/naac-logo.webp` | 16x16 | 0 |
| `brand/nba-accreditation-ece-agri-ft-annexure.jpg` | 1241x1755 | 226.5 KB | `brand/nba-accreditation-ece-agri-ft-annexure.webp` | 1241x1755 | 1 |
| `brand/nba-accreditation-ece-agri-ft-page-2.jpg` | 1241x1755 | 387.9 KB | `brand/nba-accreditation-ece-agri-ft-page-2.webp` | 1241x1755 | 1 |
| `brand/nba-accreditation-mechanical-engineering.jpg` | 1241x3510 | 1636.2 KB | `brand/nba-accreditation-mechanical-engineering.webp` | 1241x3510 | 1 |
| `brand/nba-full-logo.png` | 253x199 | 5.7 KB | `brand/nba-full-logo.webp` | 253x199 | 2 |
| `brand/nba-logo.png` | 16x16 | 0.7 KB | `brand/nba-logo.webp` | 16x16 | 3 |
| `brand/nba-logo.svg` | NonexNone | 0.7 KB | `brand/nba-logo.webp` | 16x16 | 3 |
| `brand/placement-superstars-2025-26.jpg` | 1024x768 | 212.9 KB | `brand/placement-superstars-2025-26.webp` | 1024x768 | 3 |
| `brand/principal-fitted.png` | 641x630 | 468.2 KB | `brand/principal-fitted.webp` | 641x630 | 0 |
| `brand/principal-new.png` | 1024x636 | 448.0 KB | `brand/principal-new.webp` | 1024x636 | 0 |
| `brand/principal-saravana-kumar.png` | 1024x636 | 448.0 KB | `brand/principal-saravana-kumar.webp` | 1024x636 | 1 |
| `brand/principal-transparent.png` | 1063x1247 | 1052.1 KB | `brand/principal-transparent.webp` | 1063x1247 | 0 |
| `brand/sri-shakthi-careers-banner.png` | 1478x328 | 197.3 KB | `brand/sri-shakthi-careers-banner.webp` | 1478x328 | 0 |
| `brand/sri-shakthi-food-lab-logo.png` | 862x141 | 45.7 KB | `brand/sri-shakthi-food-lab-logo.webp` | 862x141 | 1 |
| `brand/technovate-speaker.png` | 1200x896 | 643.9 KB | `brand/technovate-speaker.webp` | 1200x896 | 1 |
| `brand/techpark-hd.jpg` | 1840x840 | 258.2 KB | `brand/techpark-hd.webp` | 1840x840 | 15 |
| `brand/techpark-hero-wide.png` | 1672x940 | 2903.6 KB | `brand/techpark-hero-wide.webp` | 1672x940 | 4 |
| `brand/updated-chairman-photo.png` | 1024x1054 | 1145.2 KB | `brand/updated-chairman-photo.webp` | 1024x1054 | 0 |
| `brand/campus-life/campus-generated.png` | 539x316 | 268.5 KB | `brand/campus-life/campus-generated.webp` | 539x316 | 0 |
| `brand/campus-life/chairman 1.jpg` | 1814x2697 | 6927.7 KB | `brand/campus-life/chairman 1.webp` | 1814x2697 | 0 |
| `brand/campus-life/clubs.png` | 539x316 | 280.4 KB | `brand/campus-life/clubs.webp` | 539x316 | 5 |
| `brand/campus-life/cultural.png` | 539x316 | 239.1 KB | `brand/campus-life/cultural.webp` | 539x316 | 9 |
| `brand/campus-life/hostel-dining.jpg` | 1200x896 | 879.5 KB | `brand/campus-life/hostel-dining.webp` | 1200x896 | 3 |
| `brand/campus-life/hostel-room.jpg` | 1200x896 | 777.3 KB | `brand/campus-life/hostel-room.webp` | 1200x896 | 4 |
| `brand/campus-life/innovation.png` | 539x316 | 274.9 KB | `brand/campus-life/innovation.webp` | 539x316 | 4 |
| `brand/campus-life/learning-growth.png` | 1200x896 | 774.5 KB | `brand/campus-life/learning-growth.webp` | 720x538 | 17 |
| `brand/campus-life/ncc-cadets.jpg` | 1376x768 | 988.6 KB | `brand/campus-life/ncc-cadets.webp` | 1376x768 | 2 |
| `brand/campus-life/placements.png` | 539x316 | 276.1 KB | `brand/campus-life/placements.webp` | 539x316 | 1 |
| `brand/campus-life/source-sheet.png` | 1629x965 | 2536.9 KB | `brand/campus-life/source-sheet.webp` | 1629x965 | 0 |
| `brand/campus-life/sports-athletics.jpg` | 1376x768 | 828.5 KB | `brand/campus-life/sports-athletics.webp` | 1376x768 | 4 |
| `brand/campus-life/sports-badminton.jpg` | 1376x768 | 853.2 KB | `brand/campus-life/sports-badminton.webp` | 1376x768 | 5 |
| `brand/campus-life/sports-basketball.jpg` | 1376x768 | 958.4 KB | `brand/campus-life/sports-basketball.webp` | 1376x768 | 6 |
| `brand/campus-life/sports-gym.jpg` | 1200x896 | 979.6 KB | `brand/campus-life/sports-gym.webp` | 1200x896 | 5 |
| `brand/campus-life/sports-team.png` | 539x316 | 301.7 KB | `brand/campus-life/sports-team.webp` | 539x316 | 4 |
| `brand/campus-life/sports.png` | 539x316 | 307.0 KB | `brand/campus-life/sports.webp` | 539x316 | 4 |
| `brand/campus-life/student-life.png` | 539x316 | 304.8 KB | `brand/campus-life/student-life.webp` | 539x316 | 20 |
| `brand/campus-life/technology.png` | 539x316 | 294.6 KB | `brand/campus-life/technology.webp` | 539x316 | 0 |
| `brand/campus-life/transport-fleet.jpg` | 1376x768 | 989.8 KB | `brand/campus-life/transport-fleet.webp` | 1376x768 | 7 |
| `brand/events/event-industry-connect-clean.jpg` | 290x114 | 8.9 KB | `brand/events/event-industry-connect-clean.webp` | 290x114 | 0 |
| `brand/events/event-industry-connect-hd.jpg` | 1672x941 | 215.3 KB | `brand/events/event-industry-connect-hd.webp` | 1672x941 | 2 |
| `brand/events/event-industry-connect.jpg` | 214x115 | 7.6 KB | `brand/events/event-industry-connect.webp` | 214x115 | 0 |
| `brand/events/event-sangamam-clean.jpg` | 290x114 | 10.0 KB | `brand/events/event-sangamam-clean.webp` | 290x114 | 0 |
| `brand/events/event-sangamam-hd.jpg` | 1672x941 | 404.6 KB | `brand/events/event-sangamam-hd.webp` | 1672x941 | 9 |
| `brand/events/event-sangamam.jpg` | 218x115 | 8.6 KB | `brand/events/event-sangamam.webp` | 218x115 | 0 |
| `brand/events/event-sports-meet-clean.jpg` | 290x114 | 13.0 KB | `brand/events/event-sports-meet-clean.webp` | 290x114 | 0 |
| `brand/events/event-sports-meet-hd.jpg` | 1672x941 | 433.3 KB | `brand/events/event-sports-meet-hd.webp` | 1672x941 | 4 |
| `brand/events/event-sports-meet.jpg` | 214x115 | 10.9 KB | `brand/events/event-sports-meet.webp` | 214x115 | 0 |
| `brand/events/featured-technovate-hd.jpg` | 1672x941 | 245.7 KB | `brand/events/featured-technovate-hd.webp` | 1672x941 | 5 |
| `brand/events/featured-technovate.jpg` | 606x365 | 54.2 KB | `brand/events/featured-technovate.webp` | 606x365 | 0 |
| `brand/placement-company-logo/line-1/Abluva-logo.png` | 264x128 | 11.2 KB | `brand/placement-company-logo/line-1/Abluva-logo.webp` | 264x128 | 1 |
| `brand/placement-company-logo/line-1/Adya-logo.png` | 217x161 | 12.0 KB | `brand/placement-company-logo/line-1/Adya-logo.webp` | 217x161 | 0 |
| `brand/placement-company-logo/line-1/Auriseg-logo.png` | 252x128 | 11.3 KB | `brand/placement-company-logo/line-1/Auriseg-logo.webp` | 252x128 | 0 |
| `brand/placement-company-logo/line-1/Cognizant-logo.png` | 297x161 | 9.0 KB | `brand/placement-company-logo/line-1/Cognizant-logo.webp` | 297x161 | 1 |
| `brand/placement-company-logo/line-1/Conver-sight-logo.png` | 205x128 | 7.7 KB | `brand/placement-company-logo/line-1/Conver-sight-logo.webp` | 205x128 | 1 |
| `brand/placement-company-logo/line-1/nallas-logo.png` | 264x128 | 5.0 KB | `brand/placement-company-logo/line-1/nallas-logo.webp` | 264x128 | 1 |
| `brand/placement-company-logo/line-1/nference-logo.png` | 269x161 | 8.8 KB | `brand/placement-company-logo/line-1/nference-logo.webp` | 269x161 | 1 |
| `brand/placement-company-logo/line-1/Retail-ai-logo.png` | 280x161 | 12.5 KB | `brand/placement-company-logo/line-1/Retail-ai-logo.webp` | 280x161 | 1 |
| `brand/placement-company-logo/line-1/Vakil-search-logo.png` | 272x161 | 7.3 KB | `brand/placement-company-logo/line-1/Vakil-search-logo.webp` | 272x161 | 1 |
| `brand/placement-company-logo/line-2/conserve-logo.png` | 290x136 | 19.0 KB | `brand/placement-company-logo/line-2/conserve-logo.webp` | 290x136 | 1 |
| `brand/placement-company-logo/line-2/ITC-limited-logo.png` | 235x136 | 14.7 KB | `brand/placement-company-logo/line-2/ITC-limited-logo.webp` | 235x136 | 1 |
| `brand/placement-company-logo/line-2/mr-copper-logo.png` | 207x136 | 6.1 KB | `brand/placement-company-logo/line-2/mr-copper-logo.webp` | 207x136 | 0 |
| `brand/placement-company-logo/line-2/Presido-logo.png` | 285x136 | 10.3 KB | `brand/placement-company-logo/line-2/Presido-logo.webp` | 285x136 | 1 |
| `brand/placement-company-logo/line-2/servicenow-logo.png` | 241x136 | 5.4 KB | `brand/placement-company-logo/line-2/servicenow-logo.webp` | 241x136 | 1 |
| `brand/placement-company-logo/line-2/vendasta-logo.png` | 265x136 | 11.9 KB | `brand/placement-company-logo/line-2/vendasta-logo.webp` | 265x136 | 0 |
| `brand/placement-company-logo/line-2/Zentron-labs-logo.png` | 294x136 | 10.7 KB | `brand/placement-company-logo/line-2/Zentron-labs-logo.webp` | 294x136 | 1 |
| `brand/placement-company-logo/line-2/zoho-logo.png` | 247x136 | 14.4 KB | `brand/placement-company-logo/line-2/zoho-logo.webp` | 247x136 | 1 |
| `brand/placement-company-logo/line-2/Zynerd-logo.png` | 191x75 | 6.2 KB | `brand/placement-company-logo/line-2/Zynerd-logo.webp` | 191x75 | 1 |
| `brand/placement-records/sheet-1-prime-offers-10-33-lpa.jpg` | 576x1024 | 209.7 KB | `brand/placement-records/sheet-1-prime-offers-10-33-lpa.webp` | 576x1024 | 3 |
| `brand/placement-records/sheet-2-diamond-offers-6-10-lpa.jpg` | 576x1024 | 217.2 KB | `brand/placement-records/sheet-2-diamond-offers-6-10-lpa.webp` | 576x1024 | 1 |
| `brand/placement-records/sheet-3-pearl-offers-part-1.jpg` | 576x1024 | 208.9 KB | `brand/placement-records/sheet-3-pearl-offers-part-1.webp` | 576x1024 | 1 |
| `brand/placement-records/sheet-4-pearl-offers-part-2.jpg` | 576x1024 | 226.4 KB | `brand/placement-records/sheet-4-pearl-offers-part-2.webp` | 576x1024 | 1 |
| `brand/placement-records/sheet-5-recruitment-records-213-companies.jpg` | 576x1024 | 195.6 KB | `brand/placement-records/sheet-5-recruitment-records-213-companies.webp` | 576x1024 | 1 |
| `faculty/agri_faculty_photos/durga.png` | 288x392 | 200.1 KB | `faculty/agri_faculty_photos/durga.webp` | 288x392 | 2 |
| `faculty/agri_faculty_photos/ibrahim-sheriff.png` | 282x346 | 111.1 KB | `faculty/agri_faculty_photos/ibrahim-sheriff.webp` | 282x346 | 2 |
| `faculty/agri_faculty_photos/mohammed-thousiff.png` | 290x375 | 121.3 KB | `faculty/agri_faculty_photos/mohammed-thousiff.webp` | 290x375 | 2 |
| `faculty/agri_faculty_photos/muthusamy.png` | 307x400 | 139.2 KB | `faculty/agri_faculty_photos/muthusamy.webp` | 307x400 | 2 |
| `faculty/agri_faculty_photos/poojha.png` | 320x401 | 194.4 KB | `faculty/agri_faculty_photos/poojha.webp` | 320x401 | 2 |
| `faculty/agri_faculty_photos/priyanka.png` | 242x397 | 121.7 KB | `faculty/agri_faculty_photos/priyanka.webp` | 242x397 | 2 |
| `faculty/agri_faculty_photos/raju-yadav.png` | 348x379 | 205.5 KB | `faculty/agri_faculty_photos/raju-yadav.webp` | 348x379 | 2 |
| `faculty/agri_faculty_photos/saranya.png` | 273x351 | 120.5 KB | `faculty/agri_faculty_photos/saranya.webp` | 273x351 | 2 |
| `faculty/agri_faculty_photos/srijavijayalakshmi.png` | 311x371 | 215.8 KB | `faculty/agri_faculty_photos/srijavijayalakshmi.webp` | 311x371 | 2 |
| `faculty/agri_faculty_photos/vijay-aravinth.png` | 283x365 | 103.1 KB | `faculty/agri_faculty_photos/vijay-aravinth.webp` | 283x365 | 2 |
| `faculty/aids-faculty-images/ambika.png` | 291x290 | 91.6 KB | `faculty/aids-faculty-images/ambika.webp` | 291x290 | 2 |
| `faculty/aids-faculty-images/bala-kumar-natarajan.png` | 276x354 | 88.8 KB | `faculty/aids-faculty-images/bala-kumar-natarajan.webp` | 276x354 | 2 |
| `faculty/aids-faculty-images/barath-kumar.png` | 317x332 | 88.3 KB | `faculty/aids-faculty-images/barath-kumar.webp` | 317x332 | 2 |
| `faculty/aids-faculty-images/buvaneswaran-balamani.png` | 264x339 | 58.8 KB | `faculty/aids-faculty-images/buvaneswaran-balamani.webp` | 264x339 | 2 |
| `faculty/aids-faculty-images/dhashinamoorthy-thavamani.png` | 264x339 | 64.7 KB | `faculty/aids-faculty-images/dhashinamoorthy-thavamani.webp` | 264x339 | 2 |
| `faculty/aids-faculty-images/dhinaharan.png` | 264x281 | 73.6 KB | `faculty/aids-faculty-images/dhinaharan.webp` | 264x281 | 2 |
| `faculty/aids-faculty-images/dhivya-m.png` | 315x330 | 112.9 KB | `faculty/aids-faculty-images/dhivya-m.webp` | 315x330 | 2 |
| `faculty/aids-faculty-images/dhivya-sp.png` | 235x297 | 75.1 KB | `faculty/aids-faculty-images/dhivya-sp.webp` | 235x297 | 2 |
| `faculty/aids-faculty-images/gayathiri.png` | 264x286 | 98.3 KB | `faculty/aids-faculty-images/gayathiri.webp` | 264x286 | 2 |
| `faculty/aids-faculty-images/geethanjali-s.png` | 342x293 | 114.4 KB | `faculty/aids-faculty-images/geethanjali-s.webp` | 342x293 | 2 |
| `faculty/aids-faculty-images/hari-priya-j.png` | 264x344 | 104.9 KB | `faculty/aids-faculty-images/hari-priya-j.webp` | 264x344 | 2 |
| `faculty/aids-faculty-images/jayabala-surya-narayana-moorthy.png` | 264x343 | 84.7 KB | `faculty/aids-faculty-images/jayabala-surya-narayana-moorthy.webp` | 264x343 | 2 |
| `faculty/aids-faculty-images/kamalaveni-v-vanji-gounder.png` | 264x352 | 76.0 KB | `faculty/aids-faculty-images/kamalaveni-v-vanji-gounder.webp` | 264x352 | 2 |
| `faculty/aids-faculty-images/krishna-satheesh.png` | 264x344 | 125.7 KB | `faculty/aids-faculty-images/krishna-satheesh.webp` | 264x344 | 2 |
| `faculty/aids-faculty-images/logeshwari-m.png` | 284x336 | 85.7 KB | `faculty/aids-faculty-images/logeshwari-m.webp` | 284x336 | 2 |
| `faculty/aids-faculty-images/mayank-chauhan.png` | 264x341 | 93.8 KB | `faculty/aids-faculty-images/mayank-chauhan.webp` | 264x341 | 2 |
| `faculty/aids-faculty-images/mugesh-chandran.png` | 288x319 | 78.6 KB | `faculty/aids-faculty-images/mugesh-chandran.webp` | 288x319 | 2 |
| `faculty/aids-faculty-images/priya-dharshini-rajan.png` | 291x331 | 101.1 KB | `faculty/aids-faculty-images/priya-dharshini-rajan.webp` | 291x331 | 2 |
| `faculty/aids-faculty-images/priya-rajaendran.png` | 284x280 | 70.8 KB | `faculty/aids-faculty-images/priya-rajaendran.webp` | 284x280 | 2 |
| `faculty/aids-faculty-images/revathi.png` | 276x354 | 118.0 KB | `faculty/aids-faculty-images/revathi.webp` | 276x354 | 2 |
| `faculty/aids-faculty-images/samlin-jenifer.png` | 171x227 | 62.7 KB | `faculty/aids-faculty-images/samlin-jenifer.webp` | 171x227 | 2 |
| `faculty/aids-faculty-images/sangamithara-a.png` | 291x367 | 105.5 KB | `faculty/aids-faculty-images/sangamithara-a.webp` | 291x367 | 2 |
| `faculty/aids-faculty-images/saranya-devi.png` | 289x388 | 146.6 KB | `faculty/aids-faculty-images/saranya-devi.webp` | 289x388 | 2 |
| `faculty/aids-faculty-images/saranya-subaramani.png` | 284x308 | 93.7 KB | `faculty/aids-faculty-images/saranya-subaramani.webp` | 284x308 | 2 |
| `faculty/aids-faculty-images/sini-prabhakar.png` | 291x368 | 111.4 KB | `faculty/aids-faculty-images/sini-prabhakar.webp` | 291x368 | 2 |
| `faculty/aids-faculty-images/sivadharsini.png` | 264x332 | 101.5 KB | `faculty/aids-faculty-images/sivadharsini.webp` | 264x332 | 2 |
| `faculty/aids-faculty-images/subhasri-selvaraj.png` | 286x303 | 74.7 KB | `faculty/aids-faculty-images/subhasri-selvaraj.webp` | 286x303 | 2 |
| `faculty/aids-faculty-images/swetha.png` | 244x323 | 99.2 KB | `faculty/aids-faculty-images/swetha.webp` | 244x323 | 2 |
| `faculty/aids-faculty-images/vijayakumar-bala-subaramani.png` | 264x304 | 58.3 KB | `faculty/aids-faculty-images/vijayakumar-bala-subaramani.webp` | 264x304 | 2 |
| `faculty/aiml-faculty-images/anshuman-sinha.png` | 1476x1600 | 1282.4 KB | `faculty/aiml-faculty-images/anshuman-sinha.webp` | 360x390 | 2 |
| `faculty/aiml-faculty-images/ansline-lidiya-d.png` | 269x353 | 106.0 KB | `faculty/aiml-faculty-images/ansline-lidiya-d.webp` | 269x353 | 2 |
| `faculty/aiml-faculty-images/arulvadivu-g.png` | 1140x1600 | 772.9 KB | `faculty/aiml-faculty-images/arulvadivu-g.webp` | 360x505 | 2 |
| `faculty/aiml-faculty-images/arun-prasanth-g.png` | 405x506 | 202.6 KB | `faculty/aiml-faculty-images/arun-prasanth-g.webp` | 360x450 | 2 |
| `faculty/aiml-faculty-images/benazir-t-a.png` | 268x356 | 76.0 KB | `faculty/aiml-faculty-images/benazir-t-a.webp` | 268x356 | 2 |
| `faculty/aiml-faculty-images/gayathri-n.png` | 528x728 | 229.8 KB | `faculty/aiml-faculty-images/gayathri-n.webp` | 360x496 | 2 |
| `faculty/aiml-faculty-images/hemalatha-s.png` | 207x266 | 65.7 KB | `faculty/aiml-faculty-images/hemalatha-s.webp` | 207x266 | 4 |
| `faculty/aiml-faculty-images/karthikeyan.png` | 422x454 | 194.2 KB | `faculty/aiml-faculty-images/karthikeyan.webp` | 360x387 | 2 |
| `faculty/aiml-faculty-images/keerthana-m.png` | 1066x1280 | 795.6 KB | `faculty/aiml-faculty-images/keerthana-m.webp` | 360x432 | 2 |
| `faculty/aiml-faculty-images/kirthiga-r.png` | 413x531 | 167.3 KB | `faculty/aiml-faculty-images/kirthiga-r.webp` | 360x463 | 2 |
| `faculty/aiml-faculty-images/madhan-ksp.png` | 235x302 | 98.9 KB | `faculty/aiml-faculty-images/madhan-ksp.webp` | 235x302 | 2 |
| `faculty/aiml-faculty-images/narmatha.png` | 928x1051 | 566.1 KB | `faculty/aiml-faculty-images/narmatha.webp` | 360x408 | 2 |
| `faculty/aiml-faculty-images/niranchana-c.png` | 84x111 | 12.2 KB | `faculty/aiml-faculty-images/niranchana-c.webp` | 84x111 | 2 |
| `faculty/aiml-faculty-images/nivedha-s.png` | 96x118 | 18.6 KB | `faculty/aiml-faculty-images/nivedha-s.webp` | 96x118 | 2 |
| `faculty/aiml-faculty-images/pavethra-n.png` | 829x1040 | 531.4 KB | `faculty/aiml-faculty-images/pavethra-n.webp` | 360x452 | 2 |
| `faculty/aiml-faculty-images/perachiselvi-m.png` | 390x508 | 224.1 KB | `faculty/aiml-faculty-images/perachiselvi-m.webp` | 360x469 | 2 |
| `faculty/aiml-faculty-images/priya-m.png` | 535x693 | 371.5 KB | `faculty/aiml-faculty-images/priya-m.webp` | 360x466 | 2 |
| `faculty/aiml-faculty-images/priyanka-k.png` | 356x441 | 107.7 KB | `faculty/aiml-faculty-images/priyanka-k.webp` | 356x441 | 2 |
| `faculty/aiml-faculty-images/pushpa-kumari-r.png` | 125x160 | 31.5 KB | `faculty/aiml-faculty-images/pushpa-kumari-r.webp` | 125x160 | 2 |
| `faculty/aiml-faculty-images/ramitha-devi-r.png` | 413x531 | 196.4 KB | `faculty/aiml-faculty-images/ramitha-devi-r.webp` | 360x463 | 2 |
| `faculty/aiml-faculty-images/ranjitham-t.png` | 400x600 | 180.1 KB | `faculty/aiml-faculty-images/ranjitham-t.webp` | 360x540 | 2 |
| `faculty/aiml-faculty-images/vijay-t.png` | 1157x1431 | 1390.2 KB | `faculty/aiml-faculty-images/vijay-t.webp` | 360x445 | 2 |
| `faculty/biotech-faculty-images/akshaya-arulkumar.png` | 155x195 | 41.6 KB | `faculty/biotech-faculty-images/akshaya-arulkumar.webp` | 155x195 | 2 |
| `faculty/biotech-faculty-images/amuthavalli-nayaki.png` | 144x192 | 33.4 KB | `faculty/biotech-faculty-images/amuthavalli-nayaki.webp` | 144x192 | 2 |
| `faculty/biotech-faculty-images/arthe-rajarajan.png` | 155x195 | 40.3 KB | `faculty/biotech-faculty-images/arthe-rajarajan.webp` | 155x195 | 2 |
| `faculty/biotech-faculty-images/bindhu-jayaprakash.png` | 147x155 | 19.7 KB | `faculty/biotech-faculty-images/bindhu-jayaprakash.webp` | 147x155 | 2 |
| `faculty/biotech-faculty-images/chandrasekar-p.png` | 152x208 | 43.5 KB | `faculty/biotech-faculty-images/chandrasekar-p.webp` | 152x208 | 2 |
| `faculty/biotech-faculty-images/divya-nair.png` | 157x182 | 30.1 KB | `faculty/biotech-faculty-images/divya-nair.webp` | 157x182 | 2 |
| `faculty/biotech-faculty-images/geethanjali-k.png` | 154x197 | 44.5 KB | `faculty/biotech-faculty-images/geethanjali-k.webp` | 154x197 | 2 |
| `faculty/biotech-faculty-images/hari-lakshmi-s.png` | 175x220 | 43.0 KB | `faculty/biotech-faculty-images/hari-lakshmi-s.webp` | 175x220 | 2 |
| `faculty/biotech-faculty-images/preethi-saravanan.png` | 157x192 | 35.8 KB | `faculty/biotech-faculty-images/preethi-saravanan.webp` | 157x192 | 2 |
| `faculty/biotech-faculty-images/ramya-s.png` | 150x191 | 33.5 KB | `faculty/biotech-faculty-images/ramya-s.webp` | 150x191 | 2 |
| `faculty/biotech-faculty-images/vinitha-s.png` | 151x192 | 34.1 KB | `faculty/biotech-faculty-images/vinitha-s.webp` | 151x192 | 2 |
| `faculty/biotech-faculty-images/yuvarani-s.png` | 173x184 | 35.8 KB | `faculty/biotech-faculty-images/yuvarani-s.webp` | 173x184 | 2 |
| `faculty/bme-faculty-images/am-vishali.png` | 248x306 | 112.7 KB | `faculty/bme-faculty-images/am-vishali.webp` | 248x306 | 2 |
| `faculty/bme-faculty-images/balaji.png` | 269x347 | 82.5 KB | `faculty/bme-faculty-images/balaji.webp` | 269x347 | 2 |
| `faculty/bme-faculty-images/divya.png` | 147x160 | 27.9 KB | `faculty/bme-faculty-images/divya.webp` | 147x160 | 2 |
| `faculty/bme-faculty-images/jasonraj.png` | 278x306 | 87.1 KB | `faculty/bme-faculty-images/jasonraj.webp` | 278x306 | 2 |
| `faculty/bme-faculty-images/lekshmi-v-nair.png` | 304x340 | 95.2 KB | `faculty/bme-faculty-images/lekshmi-v-nair.webp` | 304x340 | 2 |
| `faculty/bme-faculty-images/manoj-prabu.png` | 257x342 | 69.5 KB | `faculty/bme-faculty-images/manoj-prabu.webp` | 257x342 | 2 |
| `faculty/bme-faculty-images/nirmalakumari.png` | 251x361 | 63.8 KB | `faculty/bme-faculty-images/nirmalakumari.webp` | 251x361 | 2 |
| `faculty/bme-faculty-images/pavithra.png` | 292x333 | 95.7 KB | `faculty/bme-faculty-images/pavithra.webp` | 292x333 | 2 |
| `faculty/bme-faculty-images/priyavarthini.png` | 247x284 | 66.4 KB | `faculty/bme-faculty-images/priyavarthini.webp` | 247x284 | 2 |
| `faculty/bme-faculty-images/rajalaxmi.png` | 221x316 | 69.8 KB | `faculty/bme-faculty-images/rajalaxmi.webp` | 221x316 | 2 |
| `faculty/bme-faculty-images/sowkaarthiga.png` | 265x343 | 106.1 KB | `faculty/bme-faculty-images/sowkaarthiga.webp` | 265x343 | 2 |
| `faculty/civil-faculty-images/gokul-a.png` | 413x531 | 111.0 KB | `faculty/civil-faculty-images/gokul-a.webp` | 360x463 | 2 |
| `faculty/civil-faculty-images/jenickson-d.png` | 300x341 | 158.2 KB | `faculty/civil-faculty-images/jenickson-d.webp` | 300x341 | 2 |
| `faculty/civil-faculty-images/lakhminarayanan-s.png` | 553x711 | 237.9 KB | `faculty/civil-faculty-images/lakhminarayanan-s.webp` | 360x463 | 2 |
| `faculty/civil-faculty-images/madheswaran-k.png` | 413x531 | 106.2 KB | `faculty/civil-faculty-images/madheswaran-k.webp` | 360x463 | 2 |
| `faculty/civil-faculty-images/praveen-r.png` | 823x1031 | 184.3 KB | `faculty/civil-faculty-images/praveen-r.webp` | 360x451 | 2 |
| `faculty/civil-faculty-images/ranjithkumar.png` | 416x581 | 189.6 KB | `faculty/civil-faculty-images/ranjithkumar.webp` | 360x503 | 2 |
| `faculty/civil-faculty-images/samuel-abraham-d.png` | 118x139 | 24.4 KB | `faculty/civil-faculty-images/samuel-abraham-d.webp` | 118x139 | 2 |
| `faculty/civil-faculty-images/saranya-c-v.png` | 150x200 | 34.8 KB | `faculty/civil-faculty-images/saranya-c-v.webp` | 150x200 | 2 |
| `faculty/civil-faculty-images/saravana-kumar-k.png` | 99x88 | 9.8 KB | `faculty/civil-faculty-images/saravana-kumar-k.webp` | 99x88 | 2 |
| `faculty/civil-faculty-images/sathyakumar.png` | 297x329 | 83.4 KB | `faculty/civil-faculty-images/sathyakumar.webp` | 297x329 | 2 |
| `faculty/civil-faculty-images/sre-adethya-v.png` | 513x655 | 347.3 KB | `faculty/civil-faculty-images/sre-adethya-v.webp` | 360x460 | 2 |
| `faculty/civil-faculty-images/sri-ruban-d.png` | 171x193 | 30.5 KB | `faculty/civil-faculty-images/sri-ruban-d.webp` | 171x193 | 2 |
| `faculty/civil-faculty-images/suresh-kumar-p.png` | 80x93 | 8.8 KB | `faculty/civil-faculty-images/suresh-kumar-p.webp` | 80x93 | 2 |
| `faculty/cse-faculty-images/a-mohoana-priya.png` | 190x210 | 52.8 KB | `faculty/cse-faculty-images/a-mohoana-priya.webp` | 190x210 | 2 |
| `faculty/cse-faculty-images/a-saranya.png` | 222x285 | 84.1 KB | `faculty/cse-faculty-images/a-saranya.webp` | 222x285 | 2 |
| `faculty/cse-faculty-images/a-vinod-kanna.png` | 285x329 | 62.8 KB | `faculty/cse-faculty-images/a-vinod-kanna.webp` | 285x329 | 2 |
| `faculty/cse-faculty-images/b-sanjay-krishna.png` | 276x354 | 76.8 KB | `faculty/cse-faculty-images/b-sanjay-krishna.webp` | 276x354 | 2 |
| `faculty/cse-faculty-images/c-rajesh-kumar.png` | 218x252 | 46.7 KB | `faculty/cse-faculty-images/c-rajesh-kumar.webp` | 218x252 | 2 |
| `faculty/cse-faculty-images/d-brindha.png` | 274x412 | 127.6 KB | `faculty/cse-faculty-images/d-brindha.webp` | 274x412 | 2 |
| `faculty/cse-faculty-images/e-subramanian.png` | 136x220 | 50.4 KB | `faculty/cse-faculty-images/e-subramanian.webp` | 136x220 | 2 |
| `faculty/cse-faculty-images/g-hemaprabha.png` | 159x200 | 52.7 KB | `faculty/cse-faculty-images/g-hemaprabha.webp` | 159x200 | 2 |
| `faculty/cse-faculty-images/j-kanya-devi.png` | 321x366 | 96.0 KB | `faculty/cse-faculty-images/j-kanya-devi.webp` | 321x366 | 2 |
| `faculty/cse-faculty-images/k-b-sangavi.png` | 249x323 | 67.8 KB | `faculty/cse-faculty-images/k-b-sangavi.webp` | 249x323 | 2 |
| `faculty/cse-faculty-images/k-e-kannammal.png` | 241x273 | 81.3 KB | `faculty/cse-faculty-images/k-e-kannammal.webp` | 241x273 | 2 |
| `faculty/cse-faculty-images/k-satheesh-kumar.png` | 216x287 | 55.4 KB | `faculty/cse-faculty-images/k-satheesh-kumar.webp` | 216x287 | 2 |
| `faculty/cse-faculty-images/kousalya-a.png` | 224x293 | 71.4 KB | `faculty/cse-faculty-images/kousalya-a.webp` | 224x293 | 2 |
| `faculty/cse-faculty-images/m-haritha.png` | 278x372 | 73.0 KB | `faculty/cse-faculty-images/m-haritha.webp` | 278x372 | 2 |
| `faculty/cse-faculty-images/m-karthika.png` | 233x294 | 110.0 KB | `faculty/cse-faculty-images/m-karthika.webp` | 233x294 | 2 |
| `faculty/cse-faculty-images/m-manimegala.png` | 110x140 | 23.8 KB | `faculty/cse-faculty-images/m-manimegala.webp` | 110x140 | 2 |
| `faculty/cse-faculty-images/m-mohana-priya.png` | 237x310 | 68.1 KB | `faculty/cse-faculty-images/m-mohana-priya.webp` | 237x310 | 2 |
| `faculty/cse-faculty-images/m-sabeetha.png` | 227x318 | 72.7 KB | `faculty/cse-faculty-images/m-sabeetha.webp` | 227x318 | 2 |
| `faculty/cse-faculty-images/m-soundarya-devi.png` | 276x354 | 110.7 KB | `faculty/cse-faculty-images/m-soundarya-devi.webp` | 276x354 | 2 |
| `faculty/cse-faculty-images/n-m-saravanakumar.png` | 99x128 | 20.4 KB | `faculty/cse-faculty-images/n-m-saravanakumar.webp` | 99x128 | 2 |
| `faculty/cse-faculty-images/n-yuvaraj.png` | 291x348 | 103.7 KB | `faculty/cse-faculty-images/n-yuvaraj.webp` | 291x348 | 2 |
| `faculty/cse-faculty-images/p-brindha.png` | 262x366 | 94.9 KB | `faculty/cse-faculty-images/p-brindha.webp` | 262x366 | 2 |
| `faculty/cse-faculty-images/p-deepthi-nair.png` | 121x160 | 28.1 KB | `faculty/cse-faculty-images/p-deepthi-nair.webp` | 121x160 | 2 |
| `faculty/cse-faculty-images/p-keerthana.png` | 264x340 | 103.5 KB | `faculty/cse-faculty-images/p-keerthana.webp` | 264x340 | 2 |
| `faculty/cse-faculty-images/p-sasikala.png` | 222x256 | 66.3 KB | `faculty/cse-faculty-images/p-sasikala.webp` | 222x256 | 2 |
| `faculty/cse-faculty-images/p-sharmila.png` | 100x131 | 20.5 KB | `faculty/cse-faculty-images/p-sharmila.webp` | 100x131 | 2 |
| `faculty/cse-faculty-images/r-gayathri.png` | 268x334 | 89.4 KB | `faculty/cse-faculty-images/r-gayathri.webp` | 268x334 | 2 |
| `faculty/cse-faculty-images/r-jenifer.png` | 277x357 | 115.5 KB | `faculty/cse-faculty-images/r-jenifer.webp` | 277x357 | 2 |
| `faculty/cse-faculty-images/r-karthiban.png` | 286x373 | 71.2 KB | `faculty/cse-faculty-images/r-karthiban.webp` | 286x373 | 2 |
| `faculty/cse-faculty-images/r-nandhakumar.png` | 243x318 | 67.1 KB | `faculty/cse-faculty-images/r-nandhakumar.webp` | 243x318 | 2 |
| `faculty/cse-faculty-images/r-nandhini.png` | 264x332 | 113.9 KB | `faculty/cse-faculty-images/r-nandhini.webp` | 264x332 | 2 |
| `faculty/cse-faculty-images/s-abinaya.png` | 288x327 | 131.5 KB | `faculty/cse-faculty-images/s-abinaya.webp` | 288x327 | 2 |
| `faculty/cse-faculty-images/s-abishree.png` | 287x406 | 83.2 KB | `faculty/cse-faculty-images/s-abishree.webp` | 287x406 | 2 |
| `faculty/cse-faculty-images/s-evangeline-aishwarya.png` | 312x372 | 142.6 KB | `faculty/cse-faculty-images/s-evangeline-aishwarya.webp` | 312x372 | 2 |
| `faculty/cse-faculty-images/s-nandhini.png` | 288x391 | 115.9 KB | `faculty/cse-faculty-images/s-nandhini.webp` | 288x391 | 2 |
| `faculty/cse-faculty-images/s-prakash.png` | 269x334 | 63.6 KB | `faculty/cse-faculty-images/s-prakash.webp` | 269x334 | 2 |
| `faculty/cse-faculty-images/s-shanmathi.png` | 277x376 | 88.6 KB | `faculty/cse-faculty-images/s-shanmathi.webp` | 277x376 | 2 |
| `faculty/cse-faculty-images/s-subhasri.png` | 273x354 | 86.8 KB | `faculty/cse-faculty-images/s-subhasri.webp` | 273x354 | 2 |
| `faculty/cse-faculty-images/s-v-hemalatha.png` | 292x361 | 113.4 KB | `faculty/cse-faculty-images/s-v-hemalatha.webp` | 292x361 | 2 |
| `faculty/cse-faculty-images/s-valarmathi.png` | 263x333 | 80.1 KB | `faculty/cse-faculty-images/s-valarmathi.webp` | 263x333 | 2 |
| `faculty/cse-faculty-images/s-vinithasri.png` | 276x267 | 68.5 KB | `faculty/cse-faculty-images/s-vinithasri.webp` | 276x267 | 2 |
| `faculty/cse-faculty-images/sri-sakthi-hamrish.png` | 300x356 | 93.9 KB | `faculty/cse-faculty-images/sri-sakthi-hamrish.webp` | 300x356 | 2 |
| `faculty/cse-faculty-images/subham-kumar.png` | 296x418 | 100.5 KB | `faculty/cse-faculty-images/subham-kumar.webp` | 296x418 | 2 |
| `faculty/cse-faculty-images/t-divya.png` | 226x308 | 71.3 KB | `faculty/cse-faculty-images/t-divya.webp` | 226x308 | 2 |
| `faculty/cse-faculty-images/t-jayasarangan.png` | 72x106 | 10.3 KB | `faculty/cse-faculty-images/t-jayasarangan.webp` | 72x106 | 2 |
| `faculty/cse-faculty-images/unnikuttan-k-s.png` | 309x258 | 62.8 KB | `faculty/cse-faculty-images/unnikuttan-k-s.webp` | 309x258 | 2 |
| `faculty/cse-faculty-images/v-gayathri.png` | 237x307 | 79.1 KB | `faculty/cse-faculty-images/v-gayathri.webp` | 237x307 | 2 |
| `faculty/cse-faculty-images/y-baby-kalpana.png` | 272x353 | 135.5 KB | `faculty/cse-faculty-images/y-baby-kalpana.webp` | 272x353 | 2 |
| `faculty/cyber-faculty-images/dhivya-k.png` | 116x132 | 16.0 KB | `faculty/cyber-faculty-images/dhivya-k.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/elamathy.png` | 116x131 | 18.8 KB | `faculty/cyber-faculty-images/elamathy.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/geetha-s.png` | 116x131 | 23.5 KB | `faculty/cyber-faculty-images/geetha-s.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/hari-priya-s.png` | 116x132 | 20.2 KB | `faculty/cyber-faculty-images/hari-priya-s.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/harish-a.png` | 116x131 | 20.4 KB | `faculty/cyber-faculty-images/harish-a.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/hemalatha-m.png` | 116x132 | 18.2 KB | `faculty/cyber-faculty-images/hemalatha-m.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/kiruba-sobana-j.png` | 116x132 | 20.2 KB | `faculty/cyber-faculty-images/kiruba-sobana-j.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/madhuvarshini-m.png` | 116x132 | 20.7 KB | `faculty/cyber-faculty-images/madhuvarshini-m.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/mathivanan.png` | 116x132 | 20.6 KB | `faculty/cyber-faculty-images/mathivanan.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/mithun-m.png` | 116x132 | 14.5 KB | `faculty/cyber-faculty-images/mithun-m.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/pavithra-a.png` | 116x131 | 24.2 KB | `faculty/cyber-faculty-images/pavithra-a.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/punnagai-n.png` | 116x131 | 18.9 KB | `faculty/cyber-faculty-images/punnagai-n.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/robert-kingsly-s.png` | 116x132 | 15.5 KB | `faculty/cyber-faculty-images/robert-kingsly-s.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/sabitha-k.png` | 116x132 | 17.7 KB | `faculty/cyber-faculty-images/sabitha-k.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/sai-mounishadevi.png` | 116x131 | 15.0 KB | `faculty/cyber-faculty-images/sai-mounishadevi.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/saranya-s.png` | 116x131 | 21.2 KB | `faculty/cyber-faculty-images/saranya-s.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/siva-s.png` | 116x131 | 16.9 KB | `faculty/cyber-faculty-images/siva-s.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/sneka-g.png` | 116x132 | 20.8 KB | `faculty/cyber-faculty-images/sneka-g.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/sri-thejas-n.png` | 116x131 | 19.2 KB | `faculty/cyber-faculty-images/sri-thejas-n.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/sureshu-s.png` | 116x132 | 17.6 KB | `faculty/cyber-faculty-images/sureshu-s.webp` | 116x132 | 2 |
| `faculty/cyber-faculty-images/varshini-j.png` | 116x131 | 15.2 KB | `faculty/cyber-faculty-images/varshini-j.webp` | 116x131 | 2 |
| `faculty/cyber-faculty-images/vinoth-k.png` | 116x132 | 21.6 KB | `faculty/cyber-faculty-images/vinoth-k.webp` | 116x132 | 2 |
| `faculty/ece-faculty-images/akarsh-s-kumar.png` | 275x334 | 59.0 KB | `faculty/ece-faculty-images/akarsh-s-kumar.webp` | 275x334 | 2 |
| `faculty/ece-faculty-images/arun-l.png` | 250x273 | 43.1 KB | `faculty/ece-faculty-images/arun-l.webp` | 250x273 | 2 |
| `faculty/ece-faculty-images/boopathy-s.png` | 435x555 | 197.4 KB | `faculty/ece-faculty-images/boopathy-s.webp` | 360x459 | 2 |
| `faculty/ece-faculty-images/brinda-p.png` | 291x258 | 80.5 KB | `faculty/ece-faculty-images/brinda-p.webp` | 291x258 | 2 |
| `faculty/ece-faculty-images/dhilipkumar-p.png` | 400x400 | 139.6 KB | `faculty/ece-faculty-images/dhilipkumar-p.webp` | 360x360 | 2 |
| `faculty/ece-faculty-images/eswari-p.png` | 246x246 | 64.0 KB | `faculty/ece-faculty-images/eswari-p.webp` | 246x246 | 2 |
| `faculty/ece-faculty-images/hemalatha-s.png` | 275x354 | 98.9 KB | `faculty/ece-faculty-images/hemalatha-s.webp` | 275x354 | 4 |
| `faculty/ece-faculty-images/karthikeyan-vairavel.png` | 293x313 | 81.6 KB | `faculty/ece-faculty-images/karthikeyan-vairavel.webp` | 293x313 | 2 |
| `faculty/ece-faculty-images/mahendar-r.png` | 281x291 | 46.1 KB | `faculty/ece-faculty-images/mahendar-r.webp` | 281x291 | 2 |
| `faculty/ece-faculty-images/maheswaran-t.png` | 400x513 | 131.5 KB | `faculty/ece-faculty-images/maheswaran-t.webp` | 360x462 | 2 |
| `faculty/ece-faculty-images/mohamed-naufal-m.png` | 390x508 | 223.5 KB | `faculty/ece-faculty-images/mohamed-naufal-m.webp` | 360x469 | 2 |
| `faculty/ece-faculty-images/packiyam-k.png` | 288x239 | 69.9 KB | `faculty/ece-faculty-images/packiyam-k.webp` | 288x239 | 2 |
| `faculty/ece-faculty-images/parimaladevi-k.png` | 298x297 | 114.0 KB | `faculty/ece-faculty-images/parimaladevi-k.webp` | 298x297 | 2 |
| `faculty/ece-faculty-images/prabhu-g.png` | 319x328 | 86.7 KB | `faculty/ece-faculty-images/prabhu-g.webp` | 319x328 | 2 |
| `faculty/ece-faculty-images/prasanna-mariya-l.png` | 197x261 | 48.8 KB | `faculty/ece-faculty-images/prasanna-mariya-l.webp` | 197x261 | 2 |
| `faculty/ece-faculty-images/prema-c.png` | 200x240 | 56.8 KB | `faculty/ece-faculty-images/prema-c.webp` | 200x240 | 2 |
| `faculty/ece-faculty-images/r-sudha.png` | 408x529 | 219.2 KB | `faculty/ece-faculty-images/r-sudha.webp` | 360x467 | 2 |
| `faculty/ece-faculty-images/ramalakshmi-r.png` | 143x188 | 42.1 KB | `faculty/ece-faculty-images/ramalakshmi-r.webp` | 143x188 | 2 |
| `faculty/ece-faculty-images/ramanan-s-v.png` | 284x319 | 64.6 KB | `faculty/ece-faculty-images/ramanan-s-v.webp` | 284x319 | 2 |
| `faculty/ece-faculty-images/remya-k-r.png` | 391x531 | 186.4 KB | `faculty/ece-faculty-images/remya-k-r.webp` | 360x489 | 2 |
| `faculty/ece-faculty-images/renita-pearlin-t.png` | 199x262 | 62.7 KB | `faculty/ece-faculty-images/renita-pearlin-t.webp` | 199x262 | 2 |
| `faculty/ece-faculty-images/renukadevi-a.png` | 275x282 | 82.9 KB | `faculty/ece-faculty-images/renukadevi-a.webp` | 275x282 | 2 |
| `faculty/ece-faculty-images/sankar-ganesh.png` | 160x154 | 27.1 KB | `faculty/ece-faculty-images/sankar-ganesh.webp` | 160x154 | 2 |
| `faculty/ece-faculty-images/sivakumar-p.png` | 95x132 | 19.1 KB | `faculty/ece-faculty-images/sivakumar-p.webp` | 95x132 | 2 |
| `faculty/ece-faculty-images/sridevi-k.png` | 262x340 | 72.6 KB | `faculty/ece-faculty-images/sridevi-k.webp` | 262x340 | 2 |
| `faculty/ece-faculty-images/thaarani-c-s.png` | 307x333 | 69.6 KB | `faculty/ece-faculty-images/thaarani-c-s.webp` | 307x333 | 2 |
| `faculty/ece-faculty-images/thirumurugan-s.png` | 614x803 | 206.9 KB | `faculty/ece-faculty-images/thirumurugan-s.webp` | 360x471 | 2 |
| `faculty/ece-faculty-images/thirumurugan.png` | 297x279 | 70.9 KB | `faculty/ece-faculty-images/thirumurugan.webp` | 297x279 | 2 |
| `faculty/ece-faculty-images/vasanthi-r.png` | 284x333 | 87.6 KB | `faculty/ece-faculty-images/vasanthi-r.webp` | 284x333 | 2 |
| `faculty/ece-vlsi-ug-new-faculty-images/jeevitha-s.png` | 204x252 | 65.2 KB | `faculty/ece-vlsi-ug-new-faculty-images/jeevitha-s.webp` | 204x252 | 2 |
| `faculty/ece-vlsi-ug-new-faculty-images/m-thamarai.png` | 291x284 | 82.0 KB | `faculty/ece-vlsi-ug-new-faculty-images/m-thamarai.webp` | 291x284 | 2 |
| `faculty/ece-vlsi-ug-new-faculty-images/padmapriya-kiruthika.png` | 250x311 | 96.1 KB | `faculty/ece-vlsi-ug-new-faculty-images/padmapriya-kiruthika.webp` | 250x311 | 2 |
| `faculty/ece-vlsi-ug-new-faculty-images/pravin-tv.png` | 291x321 | 91.2 KB | `faculty/ece-vlsi-ug-new-faculty-images/pravin-tv.webp` | 291x321 | 2 |
| `faculty/ece-vlsi-ug-new-faculty-images/priscilla-sophia.png` | 139x180 | 24.0 KB | `faculty/ece-vlsi-ug-new-faculty-images/priscilla-sophia.webp` | 139x180 | 2 |
| `faculty/eee-faculty-images/c-infant-vinoth.png` | 221x315 | 86.8 KB | `faculty/eee-faculty-images/c-infant-vinoth.webp` | 221x315 | 2 |
| `faculty/eee-faculty-images/c-madhivadhana.png` | 389x428 | 185.3 KB | `faculty/eee-faculty-images/c-madhivadhana.webp` | 360x396 | 2 |
| `faculty/eee-faculty-images/g-ananda-babu.png` | 437x380 | 100.7 KB | `faculty/eee-faculty-images/g-ananda-babu.webp` | 360x313 | 2 |
| `faculty/eee-faculty-images/g-sundar.png` | 210x255 | 56.2 KB | `faculty/eee-faculty-images/g-sundar.webp` | 210x255 | 2 |
| `faculty/eee-faculty-images/k-hari.png` | 213x218 | 49.1 KB | `faculty/eee-faculty-images/k-hari.webp` | 213x218 | 2 |
| `faculty/eee-faculty-images/m-a-varsha.png` | 394x413 | 122.1 KB | `faculty/eee-faculty-images/m-a-varsha.webp` | 360x377 | 2 |
| `faculty/eee-faculty-images/m-janani.png` | 140x160 | 28.1 KB | `faculty/eee-faculty-images/m-janani.webp` | 140x160 | 2 |
| `faculty/eee-faculty-images/m-priyanka-gandhi.png` | 274x364 | 129.5 KB | `faculty/eee-faculty-images/m-priyanka-gandhi.webp` | 274x364 | 2 |
| `faculty/eee-faculty-images/n-rajarajeswari.png` | 1070x980 | 244.7 KB | `faculty/eee-faculty-images/n-rajarajeswari.webp` | 360x330 | 2 |
| `faculty/eee-faculty-images/p-kalidass.png` | 364x418 | 114.2 KB | `faculty/eee-faculty-images/p-kalidass.webp` | 360x413 | 2 |
| `faculty/eee-faculty-images/r-kathiresan.png` | 435x420 | 121.7 KB | `faculty/eee-faculty-images/r-kathiresan.webp` | 360x348 | 2 |
| `faculty/eee-faculty-images/r-madhuvanthani.png` | 413x531 | 157.8 KB | `faculty/eee-faculty-images/r-madhuvanthani.webp` | 360x463 | 2 |
| `faculty/eee-faculty-images/s-abirami-sree.png` | 375x495 | 164.9 KB | `faculty/eee-faculty-images/s-abirami-sree.webp` | 360x475 | 2 |
| `faculty/eee-faculty-images/s-ruby.png` | 382x436 | 267.9 KB | `faculty/eee-faculty-images/s-ruby.webp` | 360x411 | 2 |
| `faculty/eee-faculty-images/s-saran-karthick.png` | 422x419 | 146.0 KB | `faculty/eee-faculty-images/s-saran-karthick.webp` | 360x357 | 2 |
| `faculty/eee-faculty-images/vankadara-sampath-kumar.png` | 405x389 | 188.7 KB | `faculty/eee-faculty-images/vankadara-sampath-kumar.webp` | 360x346 | 2 |
| `faculty/it-faculty-images/anitha-p.png` | 188x230 | 64.1 KB | `faculty/it-faculty-images/anitha-p.webp` | 188x230 | 2 |
| `faculty/it-faculty-images/aruna-m.png` | 145x140 | 28.8 KB | `faculty/it-faculty-images/aruna-m.webp` | 145x140 | 2 |
| `faculty/it-faculty-images/ashok-kumar-s.png` | 134x173 | 28.9 KB | `faculty/it-faculty-images/ashok-kumar-s.webp` | 134x173 | 2 |
| `faculty/it-faculty-images/brinda-a.png` | 255x326 | 96.3 KB | `faculty/it-faculty-images/brinda-a.webp` | 255x326 | 2 |
| `faculty/it-faculty-images/buvana-m.png` | 185x234 | 49.0 KB | `faculty/it-faculty-images/buvana-m.webp` | 185x234 | 2 |
| `faculty/it-faculty-images/deepa-m.png` | 186x250 | 46.5 KB | `faculty/it-faculty-images/deepa-m.webp` | 186x250 | 2 |
| `faculty/it-faculty-images/dharaniya-n-g.png` | 109x136 | 23.3 KB | `faculty/it-faculty-images/dharaniya-n-g.webp` | 109x136 | 2 |
| `faculty/it-faculty-images/esther-t.png` | 185x186 | 43.5 KB | `faculty/it-faculty-images/esther-t.webp` | 185x186 | 2 |
| `faculty/it-faculty-images/gayathri-devi-m.png` | 256x276 | 80.1 KB | `faculty/it-faculty-images/gayathri-devi-m.webp` | 256x276 | 2 |
| `faculty/it-faculty-images/jannathul-firthous.png` | 182x240 | 51.3 KB | `faculty/it-faculty-images/jannathul-firthous.webp` | 182x240 | 2 |
| `faculty/it-faculty-images/kiruba-s.png` | 185x212 | 50.5 KB | `faculty/it-faculty-images/kiruba-s.webp` | 185x212 | 2 |
| `faculty/it-faculty-images/manikandan-r-p-s.png` | 185x237 | 36.9 KB | `faculty/it-faculty-images/manikandan-r-p-s.webp` | 185x237 | 2 |
| `faculty/it-faculty-images/nishmitha-k-r.png` | 255x266 | 65.1 KB | `faculty/it-faculty-images/nishmitha-k-r.webp` | 255x266 | 2 |
| `faculty/it-faculty-images/pavithra-s.png` | 178x228 | 50.3 KB | `faculty/it-faculty-images/pavithra-s.webp` | 178x228 | 2 |
| `faculty/it-faculty-images/premalatha-e.png` | 166x183 | 37.2 KB | `faculty/it-faculty-images/premalatha-e.webp` | 166x183 | 2 |
| `faculty/it-faculty-images/sadhish-chinnapan.png` | 185x212 | 34.5 KB | `faculty/it-faculty-images/sadhish-chinnapan.webp` | 185x212 | 2 |
| `faculty/it-faculty-images/sandhiya-b.png` | 185x217 | 44.7 KB | `faculty/it-faculty-images/sandhiya-b.webp` | 185x217 | 2 |
| `faculty/it-faculty-images/saranya-m.png` | 221x299 | 60.5 KB | `faculty/it-faculty-images/saranya-m.webp` | 221x299 | 2 |
| `faculty/it-faculty-images/sathya-m.png` | 560x716 | 304.5 KB | `faculty/it-faculty-images/sathya-m.webp` | 360x460 | 2 |
| `faculty/it-faculty-images/sathya-thangavel.png` | 185x199 | 38.0 KB | `faculty/it-faculty-images/sathya-thangavel.webp` | 185x199 | 2 |
| `faculty/it-faculty-images/sathyavathy-p.png` | 168x195 | 45.0 KB | `faculty/it-faculty-images/sathyavathy-p.webp` | 168x195 | 2 |
| `faculty/it-faculty-images/suganya-v.png` | 255x286 | 85.2 KB | `faculty/it-faculty-images/suganya-v.webp` | 255x286 | 2 |
| `faculty/it-faculty-images/sugashini-k.png` | 185x209 | 39.6 KB | `faculty/it-faculty-images/sugashini-k.webp` | 185x209 | 2 |
| `faculty/it-faculty-images/varun-kumar-b.png` | 185x224 | 41.5 KB | `faculty/it-faculty-images/varun-kumar-b.webp` | 185x224 | 2 |
| `faculty/it-faculty-images/vijalakshmi-s.png` | 185x262 | 42.1 KB | `faculty/it-faculty-images/vijalakshmi-s.webp` | 185x262 | 2 |
| `faculty/mech-faculty-images/b-m-balakrishnan.png` | 172x226 | 38.7 KB | `faculty/mech-faculty-images/b-m-balakrishnan.webp` | 172x226 | 2 |
| `faculty/mech-faculty-images/b-saravanan.png` | 264x347 | 87.1 KB | `faculty/mech-faculty-images/b-saravanan.webp` | 264x347 | 2 |
| `faculty/mech-faculty-images/g-mahesh.png` | 208x259 | 60.1 KB | `faculty/mech-faculty-images/g-mahesh.webp` | 208x259 | 2 |
| `faculty/mech-faculty-images/g-perumalsamy.png` | 321x420 | 145.0 KB | `faculty/mech-faculty-images/g-perumalsamy.webp` | 321x420 | 2 |
| `faculty/mech-faculty-images/m-pradeepkumar.png` | 270x346 | 94.6 KB | `faculty/mech-faculty-images/m-pradeepkumar.webp` | 270x346 | 2 |
| `faculty/mech-faculty-images/m-sasikumar.png` | 237x314 | 66.7 KB | `faculty/mech-faculty-images/m-sasikumar.webp` | 237x314 | 2 |
| `faculty/mech-faculty-images/n-sivaprakash.png` | 270x346 | 94.9 KB | `faculty/mech-faculty-images/n-sivaprakash.webp` | 270x346 | 2 |
| `faculty/mech-faculty-images/p-arivalagan.png` | 235x298 | 57.2 KB | `faculty/mech-faculty-images/p-arivalagan.webp` | 235x298 | 2 |
| `faculty/mech-faculty-images/r-karthikeyan.png` | 231x247 | 49.5 KB | `faculty/mech-faculty-images/r-karthikeyan.webp` | 231x247 | 2 |
| `faculty/mech-faculty-images/s-gnanasekaran.png` | 233x283 | 79.2 KB | `faculty/mech-faculty-images/s-gnanasekaran.webp` | 233x283 | 2 |
| `faculty/mech-faculty-images/t-sathishkumar.png` | 302x391 | 82.5 KB | `faculty/mech-faculty-images/t-sathishkumar.webp` | 302x391 | 2 |
| `faculty/mech-faculty-images/v-vignesh.png` | 244x260 | 53.1 KB | `faculty/mech-faculty-images/v-vignesh.webp` | 244x260 | 2 |
| `brand/principal-new.webp` | 1024x636 | 33.0 KB | `brand/principal-saravana-kumar.webp` | 1024x636 | 1 |
| `assets/images/all-img/book.svg` | NonexNone | 8.9 KB | `assets/images/icon/book.svg` | NonexNone | 0 |
| `brand/special-labs/lab-ar-vr-hd.webp` | 1672x941 | 245.9 KB | `assets/images/site/arvr.webp` | 1672x941 | 7 |
| `brand/special-labs/lab-cyber-cloud-hd.webp` | 1536x1024 | 283.8 KB | `assets/images/site/cyber2.webp` | 1536x1024 | 10 |
| `brand/special-labs/lab-embedded-hd.webp` | 1672x941 | 298.1 KB | `assets/images/site/embedded.webp` | 1672x941 | 9 |
| `brand/special-labs/lab-pcb-hd.webp` | 1672x940 | 206.6 KB | `assets/images/site/embedded1.webp` | 1672x940 | 7 |
| `brand/special-labs/lab-vlsi-hd.webp` | 1672x941 | 219.7 KB | `assets/images/site/vlsi.webp` | 1672x941 | 4 |
| `brand/events/event-industry-connect.webp` | 214x115 | 3.6 KB | `brand/events/event-industry-connect-hd.webp` | 1672x941 | 2 |
| `brand/events/event-industry-connect-clean.webp` | 290x114 | 3.9 KB | `brand/events/event-industry-connect-hd.webp` | 1672x941 | 2 |
| `brand/events/event-sangamam.webp` | 218x115 | 4.2 KB | `brand/events/event-sangamam-hd.webp` | 1672x941 | 9 |
| `brand/events/event-sangamam-clean.webp` | 290x114 | 4.6 KB | `brand/events/event-sangamam-hd.webp` | 1672x941 | 9 |
| `brand/events/event-sports-meet.webp` | 214x115 | 6.1 KB | `brand/events/event-sports-meet-hd.webp` | 1672x941 | 4 |
| `brand/events/event-sports-meet-clean.webp` | 290x114 | 7.0 KB | `brand/events/event-sports-meet-hd.webp` | 1672x941 | 4 |
| `brand/events/featured-technovate.webp` | 606x365 | 26.2 KB | `brand/events/featured-technovate-hd.webp` | 1672x941 | 5 |