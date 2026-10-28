const departments = [
  {
    label: "DCS - BME",
    name: "Biomedical Engineering",
    href: "/downloads/nba-bme.pdf",
  },
  {
    label: "DCS - BT",
    name: "Biotechnology",
    href: "/downloads/nba-bt.pdf",
  },
  {
    label: "DCS - CIVIL",
    name: "Civil Engineering",
    href: "/downloads/nba-civil.pdf",
  },
];

function isDcsSummaryRoute() {
  const hashRoute = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  const pathRoute = window.location.pathname
    .replace(/\/index\.html$/, "")
    .replace(/\/$/, "")
    .split("/")
    .pop();
  return hashRoute === "dcs-summary" || (!hashRoute && pathRoute === "dcs-summary");
}

function currentRoute() {
  const hashRoute = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return hashRoute || window.location.pathname.replace(/\/index\.html$/, "").replace(/^\/+|\/+$/g, "");
}

function pageMarkup() {
  const cards = departments
    .map(
      ({ label, name, href }, index) => `
        <a class="dcs-summary-card" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Open ${name} DCS summary PDF">
          <span class="dcs-card-number">0${index + 1}</span>
          <span class="dcs-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M6 17V8l6-4 6 4v9M9 20v-7h6v7M9 9h.01M15 9h.01" /></svg></span>
          <span class="dcs-card-copy"><small>Department Summary</small><strong>${label}</strong><em>${name}</em></span>
          <span class="dcs-card-action">View summary <i aria-hidden="true">→</i></span>
        </a>`,
    )
    .join("");

  return `
    <main class="siet-vm-page dcs-summary-page">
      <section class="siet-vm-hero" aria-labelledby="dcs-summary-title">
        <div class="siet-vm-hero-grid" aria-hidden="true"></div>
        <div class="siet-vm-hero-orb orb-one" aria-hidden="true"></div>
        <div class="siet-vm-hero-orb orb-two" aria-hidden="true"></div>
        <div class="siet-vm-shell siet-vm-hero-content">
          <p class="siet-vm-kicker"><i></i> INSTITUTIONAL INFORMATION</p>
          <h1 id="dcs-summary-title">DCS <em>Summary</em></h1>
          <p class="siet-vm-intro">Access department-wise summary information for Biomedical Engineering, Biotechnology, and Civil Engineering.</p>
        </div>
      </section>
      <section class="dcs-summary-section" aria-label="DCS department summaries">
        <div class="dcs-summary-shell">
          <header class="dcs-section-heading"><div><p class="dcs-summary-eyebrow">Department Directory</p><h2>Choose a department</h2></div><p>Select a department below to view its detailed information and academic summary.</p></header>
          <div class="dcs-summary-grid">${cards}</div>
        </div>
      </section>
    </main>`;
}

function affiliationPageMarkup() {
  return `
    <main class="siet-vm-page au-affiliation-page">
      <section class="siet-vm-hero" aria-labelledby="au-affiliation-title">
        <div class="siet-vm-hero-grid" aria-hidden="true"></div>
        <div class="siet-vm-hero-orb orb-one" aria-hidden="true"></div>
        <div class="siet-vm-hero-orb orb-two" aria-hidden="true"></div>
        <div class="siet-vm-shell siet-vm-hero-content">
          <p class="siet-vm-kicker"><i></i> UNIVERSITY AFFILIATION</p>
          <h1 id="au-affiliation-title">Anna University <em>Affiliation</em></h1>
          <p class="siet-vm-intro">Sri Shakthi Institute of Engineering and Technology is an autonomous institution affiliated to Anna University, Chennai.</p>
        </div>
      </section>

      <section class="au-affiliation-content">
        <div class="siet-vm-shell">
          <header class="au-section-intro">
            <p>OFFICIAL INSTITUTIONAL STATUS</p>
            <h2>Affiliated for academic <em>excellence.</em></h2>
            <span>SIET operates within Anna University's academic framework while exercising autonomous status in curriculum design, assessment, and continuous academic improvement.</span>
          </header>

          <div class="au-status-grid">
            <article class="au-status-card au-status-primary"><span class="au-card-index">01</span><small>Affiliating University</small><h3>Anna University</h3><p>Chennai - 600 025, Tamil Nadu</p></article>
            <article class="au-status-card"><span class="au-card-index">02</span><small>Institution Status</small><h3>Autonomous</h3><p>Listed as an autonomous affiliated engineering institution.</p></article>
            <article class="au-status-card"><span class="au-card-index">03</span><small>University College Code</small><h3>7140</h3><p>Official Anna University examination and affiliation code.</p></article>
            <article class="au-status-card"><span class="au-card-index">04</span><small>TNEA Counselling Code</small><h3>2727</h3><p>Institution code used for Tamil Nadu Engineering Admissions.</p></article>
          </div>

          <section class="au-details-panel">
            <div class="au-details-copy">
              <p class="au-panel-kicker">INSTITUTION PROFILE</p>
              <h2>Sri Shakthi Institute of Engineering and Technology</h2>
              <p>The institution was established in 2006 and is listed by Anna University as a self-financing, non-minority autonomous engineering college in Coimbatore.</p>
              <dl>
                <div><dt>Year of establishment</dt><dd>2006</dd></div>
                <div><dt>Institution type</dt><dd>Self Financing</dd></div>
                <div><dt>Minority status</dt><dd>Non-Minority</dd></div>
                <div><dt>Location</dt><dd>Coimbatore, Tamil Nadu</dd></div>
              </dl>
            </div>
            <aside class="au-verification-card">
              <span class="au-verified-icon" aria-hidden="true">✓</span>
              <small>OFFICIAL VERIFICATION</small>
              <h3>Anna University Affiliated College Listing</h3>
              <p>View the official university record for Sri Shakthi Institute of Engineering and Technology.</p>
              <button class="au-show-certificate" type="button" data-au-certificate-open><span class="au-button-icon" aria-hidden="true">▣</span><span><small>OFFICIAL DOCUMENT</small>Show Affiliation Certificate</span><i aria-hidden="true">→</i></button>
              <a class="au-official-link" href="https://www.annauniv.edu/cai/Affiliated%20Colleges%20list%20by%20Alphabetical/S4.html" target="_blank" rel="noopener noreferrer">Verify on Anna University <span aria-hidden="true">↗</span></a>
            </aside>
          </section>
        </div>
      </section>
      <div class="au-certificate-modal" data-au-certificate-modal aria-hidden="true">
        <div class="au-certificate-backdrop" data-au-certificate-close></div>
        <section class="au-certificate-dialog" role="dialog" aria-modal="true" aria-labelledby="au-certificate-modal-title">
          <header class="au-certificate-toolbar">
            <div><small>ANNA UNIVERSITY</small><h2 id="au-certificate-modal-title">Affiliation Certificate</h2></div>
            <div class="au-certificate-actions">
              <button type="button" data-au-zoom-out aria-label="Zoom out">−</button>
              <span data-au-zoom-label>100%</span>
              <button type="button" data-au-zoom-in aria-label="Zoom in">+</button>
              <a href="/brand/anna-university-affiliation.webp" download="anna-university-affiliation.jpg">Download</a>
              <button class="au-modal-close" type="button" data-au-certificate-close aria-label="Close certificate">×</button>
            </div>
          </header>
          <div class="au-certificate-viewer" data-au-certificate-viewer>
            <img src="/brand/anna-university-affiliation.webp" alt="Anna University affiliation certificates issued to Sri Shakthi Institute of Engineering and Technology" data-au-certificate-image loading="lazy" decoding="async" width="800">
          </div>
        </section>
      </div>
    </main>`;
}

function nbaAccreditationPageMarkup() {
  return `
    <main class="siet-vm-page au-affiliation-page nba-accreditation-page">
      <section class="siet-vm-hero" aria-labelledby="nba-accreditation-title">
        <div class="siet-vm-hero-grid" aria-hidden="true"></div><div class="siet-vm-hero-orb orb-one" aria-hidden="true"></div><div class="siet-vm-hero-orb orb-two" aria-hidden="true"></div>
        <div class="siet-vm-shell siet-vm-hero-content">
          <p class="siet-vm-kicker"><i></i> PROGRAMME ACCREDITATION</p>
          <h1 id="nba-accreditation-title">NBA <em>Accreditation</em></h1>
          <p class="siet-vm-intro">Tier-I accreditation by the National Board of Accreditation for eligible undergraduate engineering programmes at Sri Shakthi.</p>
        </div>
      </section>
      <section class="au-affiliation-content">
        <div class="siet-vm-shell">
          <header class="au-section-intro"><p>ACCREDITED PROGRAMMES</p><h2>Quality measured through <em>outcomes.</em></h2><span>The National Board of Accreditation evaluates individual programmes against rigorous outcome-based education standards, academic processes, faculty strength, facilities, and continuous improvement.</span></header>
          <div class="au-status-grid nba-programme-grid">
            <article class="au-status-card au-status-primary"><span class="au-card-index">01</span><small>UG Programme</small><h3>Electronics &amp; Communication Engineering</h3><p>Accredited under the Tier-I January 2016 document.</p></article>
            <article class="au-status-card"><span class="au-card-index">02</span><small>UG Programme</small><h3>Agricultural Engineering</h3><p>Accredited under the Tier-I January 2016 document.</p></article>
            <article class="au-status-card"><span class="au-card-index">03</span><small>UG Programme</small><h3>Food Technology</h3><p>Accredited with marks and grades revised as recorded in the annexure.</p></article>
            <article class="au-status-card"><span class="au-card-index">04</span><small>Validity</small><h3>Up to 30 June 2027</h3><p>Academic years 2024-25 through 2026-27, subject to NBA conditions.</p></article>
          </div>
          <section class="au-details-panel">
            <div class="au-details-copy">
              <p class="au-panel-kicker">ACCREDITATION ORDER</p><h2>National Board of Accreditation</h2>
              <p>The accreditation status was issued following an onsite expert-team evaluation conducted from 6 to 8 December 2024 and the subsequent review by the competent NBA committees.</p>
              <dl><div><dt>NBA file number</dt><dd>33-284/2013-NBA</dd></div><div><dt>Order date</dt><dd>19 February 2025</dd></div><div><dt>Basis of evaluation</dt><dd>Tier-I, January 2016</dd></div><div><dt>Accreditation level</dt><dd>Programme Accreditation</dd></div></dl>
            </div>
            <aside class="au-verification-card">
              <span class="au-verified-icon" aria-hidden="true">✓</span><small>NBA OFFICIAL DOCUMENT</small><h3>Programme Accreditation Letter</h3><p>View the official NBA communication covering ECE, Agricultural Engineering, and Food Technology.</p>
              <button class="au-show-certificate" type="button" data-au-certificate-open><span class="au-button-icon" aria-hidden="true">▣</span><span><small>ACCREDITATION LETTER</small>Show NBA Certificate</span><i aria-hidden="true">→</i></button>
              <a class="au-official-link" href="https://www.nbaind.org/" target="_blank" rel="noopener noreferrer">Visit National Board of Accreditation <span aria-hidden="true">↗</span></a>
            </aside>
          </section>
          <p class="nba-disclosure-note"><strong>Important:</strong> NBA accreditation applies to the programmes and validity period identified in the official order; it does not constitute accreditation of the institution as a whole.</p>
        </div>
      </section>
      <div class="au-certificate-modal" data-au-certificate-modal aria-hidden="true">
        <div class="au-certificate-backdrop" data-au-certificate-close></div>
        <section class="au-certificate-dialog" role="dialog" aria-modal="true" aria-labelledby="nba-certificate-modal-title">
          <header class="au-certificate-toolbar"><div><small>NATIONAL BOARD OF ACCREDITATION</small><h2 id="nba-certificate-modal-title">Programme Accreditation Letter</h2></div><div class="au-certificate-actions"><button type="button" data-au-zoom-out aria-label="Zoom out">−</button><span data-au-zoom-label>100%</span><button type="button" data-au-zoom-in aria-label="Zoom in">+</button><a href="/brand/nba-accreditation-ece-agri-ft.webp" download="nba-accreditation-ece-agri-ft.jpg">Download</a><button class="au-modal-close" type="button" data-au-certificate-close aria-label="Close certificate">×</button></div></header>
          <div class="au-certificate-viewer nba-certificate-pages" data-au-certificate-viewer>
            <figure><figcaption><span>Current Accreditation Letter</span><strong>ECE, Agricultural Engineering &amp; Food Technology — Page 1</strong></figcaption><img src="/brand/nba-accreditation-ece-agri-ft.webp" alt="NBA programme accreditation letter for ECE, Agricultural Engineering, and Food Technology, page 1" data-au-certificate-image loading="lazy" decoding="async" width="800"></figure>
            <figure><figcaption><span>Current Accreditation Letter</span><strong>ECE, Agricultural Engineering &amp; Food Technology — Page 2</strong></figcaption><img src="/brand/nba-accreditation-ece-agri-ft-page-2.webp" alt="NBA programme accreditation letter continuation page" data-au-certificate-image loading="lazy"></figure>
            <figure><figcaption><span>Official Annexure</span><strong>Food Technology — Revised Grades and Marks</strong></figcaption><img src="/brand/nba-accreditation-ece-agri-ft-annexure.webp" alt="NBA accreditation annexure for Food Technology" data-au-certificate-image loading="lazy"></figure>
            <figure><figcaption><span>Accreditation Archive</span><strong>Mechanical Engineering — 2022 to 2025</strong></figcaption><img src="/brand/nba-accreditation-mechanical-engineering.webp" alt="NBA accreditation letter for Mechanical Engineering" data-au-certificate-image loading="lazy"></figure>
          </div>
        </section>
      </div>
    </main>`;
}

function renderDcsSummary() {
  if (!isDcsSummaryRoute()) return;

  const root = document.querySelector("#root");
  if (!root) return;

  const existingMain = root.querySelector("main");
  if (!existingMain) {
    window.setTimeout(renderDcsSummary, 20);
    return;
  }

  if (!existingMain.classList.contains("dcs-summary-page")) {
    existingMain.outerHTML = pageMarkup();
  }

  document.title = "DCS Summary | Sri Shakthi Institute of Engineering & Technology";
  document
    .querySelectorAll('.institution-nav-link[href="#/dcs-summary"], .mobile-nav-link[href="#/dcs-summary"]')
    .forEach((link) => link.classList.add("is-active-nav"));
}

function renderAffiliationPage() {
  if (currentRoute() !== "anna-university-affiliation") return;
  const root = document.querySelector("#root");
  const existingMain = root?.querySelector("main");
  if (!existingMain) {
    window.setTimeout(renderAffiliationPage, 20);
    return;
  }
  if (!existingMain.classList.contains("au-affiliation-page")) existingMain.outerHTML = affiliationPageMarkup();
  document.title = "Anna University Affiliation | Sri Shakthi Institute of Engineering & Technology";
}

function renderNbaAccreditationPage() {
  if (!["nba", "nba-accreditation"].includes(currentRoute())) return;
  const root = document.querySelector("#root");
  const existingMain = root?.querySelector("main");
  if (!existingMain) { window.setTimeout(renderNbaAccreditationPage, 20); return; }
  if (!existingMain.classList.contains("nba-accreditation-page")) existingMain.outerHTML = nbaAccreditationPageMarkup();
  document.title = "NBA Accreditation | Sri Shakthi Institute of Engineering & Technology";
}

function ensureFacultyListFooterLink() {
  const academicsGroup = [...document.querySelectorAll(".footer-link-group")].find(
    (group) => group.querySelector(":scope > b")?.textContent.trim() === "Academics",
  );
  if (!academicsGroup || academicsGroup.querySelector(".footer-faculty-list-link")) return;

  const facultyLink = document.createElement("a");
  facultyLink.className = "footer-faculty-list-link";
  facultyLink.href = "/downloads/siet-faculty-list-au-affiliation-2026-27.pdf";
  facultyLink.target = "_blank";
  facultyLink.rel = "noopener noreferrer";
  facultyLink.innerHTML = "<span>›</span>Faculty List";
  academicsGroup.append(facultyLink);
}

function ensureAffiliationFooterLink() {
  const accreditationGroup = [...document.querySelectorAll(".footer-link-group")].find(
    (group) => group.querySelector(":scope > b")?.textContent.trim() === "Accreditation",
  );
  if (!accreditationGroup || accreditationGroup.querySelector(".footer-au-affiliation-link")) return;
  const link = document.createElement("a");
  link.className = "footer-au-affiliation-link";
  link.href = "/anna-university-affiliation";
  link.innerHTML = "<span>›</span>Anna University Affiliation";
  accreditationGroup.append(link);
}

function ensureNbaFooterLink() {
  const accreditationGroup = [...document.querySelectorAll(".footer-link-group")].find((group) => group.querySelector(":scope > b")?.textContent.trim() === "Accreditation");
  if (!accreditationGroup) return;
  const nbaLink = [...accreditationGroup.querySelectorAll("a")].find((link) => link.textContent.trim() === "NBA" || link.classList.contains("footer-nba-accreditation-link"));
  if (!nbaLink) return;
  if (nbaLink.classList.contains("footer-nba-accreditation-link") && nbaLink.getAttribute("href") === "/nba") return;
  nbaLink.className = "footer-nba-accreditation-link";
  nbaLink.href = "/nba";
  nbaLink.innerHTML = "<span>›</span>NBA Accreditation";
}

function ensureAdmissionsNoticeLink() {
  document.querySelectorAll(".home-notice-group").forEach((group) => {
    const current = group.querySelector(".home-notice-open");
    if (current) {
      current.querySelector("b")?.remove();
      if (current.tagName !== "A") {
        const link = document.createElement("a");
        link.className = "home-notice-open";
        link.href = "/apply";
        link.innerHTML = "<strong>ADMISSIONS 2026–27 NOW OPEN</strong>";
        current.replaceWith(link);
      } else {
        current.href = "/apply";
      }
    }
    [...group.querySelectorAll("span")].forEach((item) => {
      if (!item.textContent.includes("TNEA Counselling Code")) return;
      const previous = item.previousElementSibling;
      const next = item.nextElementSibling;
      if (previous?.tagName === "I") previous.remove();
      if (next?.tagName === "I") next.remove();
      item.remove();
    });
  });
}

function ensureApplyEnquiryOnly() {
  const route = currentRoute();
  if (route === "admission-referral" || route === "referral") {
    window.history.replaceState(null, "", "/apply");
    window.dispatchEvent(new PopStateEvent("popstate"));
    return;
  }

  document.querySelectorAll('a[href="#/admission-referral"], a[href="/admission-referral"], a[href="#/referral"], a[href="/referral"]').forEach((link) => {
    link.setAttribute("href", "/apply");
  });

  const page = document.querySelector(".apply-portal-page");
  if (!page) return;
  page.querySelector(".apply-tabs")?.remove();
  page.querySelector("#apply-pane-referral")?.remove();
  page.querySelector("#apply-pane-enquiry")?.classList.add("is-active");

  const title = page.querySelector("#apply-hud-title");
  if (title && title.innerHTML !== "Apply for <em>Sri Shakthi</em>") title.innerHTML = "Apply for <em>Sri Shakthi</em>";
  const breadcrumb = page.querySelector("#apply-hud-breadcrumb");
  if (breadcrumb && breadcrumb.textContent !== "Apply") breadcrumb.textContent = "Apply";
  document.title = "Apply for Sri Shakthi | SIET";
}

function removeHomeHeroDescription() {
  const description = document.querySelector(".home-impact-content > p");
  if (description?.textContent.includes("Industry-aligned training")) description.remove();
}

function runPageEnhancements() {
  renderDcsSummary();
  renderAffiliationPage();
  renderNbaAccreditationPage();
  ensureFacultyListFooterLink();
  ensureAffiliationFooterLink();
  ensureNbaFooterLink();
  ensureAdmissionsNoticeLink();
  ensureApplyEnquiryOnly();
  removeHomeHeroDescription();
}

let certificateZoom = 1;
document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-au-certificate-open]");
  const modal = opener
    ? opener.closest("main")?.querySelector("[data-au-certificate-modal]")
    : event.target.closest("[data-au-certificate-modal]");
  if (!modal) return;
  if (opener) {
    if (modal.parentElement !== document.body) document.body.append(modal);
    certificateZoom = 1;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("au-modal-open");
    modal.querySelectorAll("[data-au-certificate-image]").forEach((image) => { image.style.width = "100%"; });
    modal.querySelector("[data-au-zoom-label]").textContent = "100%";
    modal.querySelector("[data-au-certificate-viewer]").scrollTop = 0;
    modal.querySelector(".au-modal-close").focus();
    return;
  }
  if (event.target.closest("[data-au-certificate-close]")) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("au-modal-open");
    return;
  }
  const zoomStep = event.target.closest("[data-au-zoom-in]") ? .25 : event.target.closest("[data-au-zoom-out]") ? -.25 : 0;
  if (zoomStep) {
    certificateZoom = Math.min(2, Math.max(.5, certificateZoom + zoomStep));
    modal.querySelectorAll("[data-au-certificate-image]").forEach((image) => { image.style.width = `${certificateZoom * 100}%`; });
    modal.querySelector("[data-au-zoom-label]").textContent = `${Math.round(certificateZoom * 100)}%`;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const modal = document.querySelector("[data-au-certificate-modal].is-open");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("au-modal-open");
});

const footerObserver = new MutationObserver(() => { ensureFacultyListFooterLink(); ensureAffiliationFooterLink(); ensureNbaFooterLink(); ensureAdmissionsNoticeLink(); });
footerObserver.observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener("hashchange", () => window.setTimeout(runPageEnhancements, 0));
window.addEventListener("popstate", () => window.setTimeout(runPageEnhancements, 0));
window.addEventListener("DOMContentLoaded", () => window.setTimeout(runPageEnhancements, 0));
window.setTimeout(runPageEnhancements, 0);
