const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 6, 4) * 70}ms`;
  revealObserver.observe(element);
});

const menuButton = document.querySelector(".mobile-menu-button");
const navigation = document.querySelector(".institution-navigation");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation?.classList.toggle("is-open", open);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

const deadline = new Date("2026-12-12T23:59:59+05:30");
const updateCountdown = () => {
  const remaining = Math.max(0, deadline.getTime() - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value).padStart(2, "0");
  };
  setValue("count-days", days);
  setValue("count-hours", hours);
  setValue("count-minutes", minutes);
  setValue("count-seconds", seconds);
};

updateCountdown();
setInterval(updateCountdown, 1000);

const sectionLinks = [...document.querySelectorAll('.institution-navigation a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = (sectionId) => {
  sectionLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActiveLink(visible.target.id);
}, { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.2, 0.5] });

observedSections.forEach((section) => sectionObserver.observe(section));
setActiveLink("home");
