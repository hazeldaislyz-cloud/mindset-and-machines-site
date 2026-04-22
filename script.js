const tiltCard = document.querySelector("[data-tilt]");
const auditTrigger = document.querySelector(".cta-trigger");
const contactPanel = document.querySelector(".cta-contact-popover");

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");
});

if (tiltCard && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const limit = 7;

  tiltCard.addEventListener("pointermove", (event) => {
    const bounds = tiltCard.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (relativeX - 0.5) * limit;
    const rotateX = (0.5 - relativeY) * limit;

    tiltCard.style.transform =
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  });
}

if (auditTrigger && contactPanel) {
  const ensureContactPanelVisible = () => {
    if (contactPanel.hidden) {
      return;
    }

    const viewportGap = 16;
    const panelBounds = contactPanel.getBoundingClientRect();

    if (panelBounds.top < viewportGap) {
      window.scrollBy({
        top: panelBounds.top - viewportGap,
        behavior: "smooth",
      });
      return;
    }

    if (panelBounds.bottom > window.innerHeight - viewportGap) {
      window.scrollBy({
        top: panelBounds.bottom - window.innerHeight + viewportGap,
        behavior: "smooth",
      });
    }
  };

  const setContactPanel = (isOpen) => {
    auditTrigger.setAttribute("aria-expanded", String(isOpen));
    contactPanel.hidden = !isOpen;

    if (isOpen) {
      requestAnimationFrame(ensureContactPanelVisible);
    }
  };

  auditTrigger.addEventListener("click", () => {
    const isOpen = auditTrigger.getAttribute("aria-expanded") === "true";
    setContactPanel(!isOpen);
  });

  document.addEventListener("click", (event) => {
    const clickTarget = event.target;

    if (
      clickTarget instanceof Node &&
      !contactPanel.hidden &&
      !contactPanel.contains(clickTarget) &&
      !auditTrigger.contains(clickTarget)
    ) {
      setContactPanel(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !contactPanel.hidden) {
      setContactPanel(false);
      auditTrigger.focus();
    }
  });

  window.addEventListener("resize", ensureContactPanelVisible);
}
