const tiltCard = document.querySelector("[data-tilt]");
const contactGroups = Array.from(document.querySelectorAll(".cta-primary-wrap"));

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

if (contactGroups.length) {
  const ensureContactPanelVisible = (panel) => {
    if (!panel || panel.hidden) {
      return;
    }

    const viewportGap = 16;
    const panelBounds = panel.getBoundingClientRect();

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

  const closeContactGroup = (group, restoreFocus = false) => {
    const trigger = group.querySelector(".cta-trigger");
    const panel = group.querySelector(".cta-contact-popover");

    if (!trigger || !panel) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    if (restoreFocus) {
      trigger.focus();
    }
  };

  const setContactGroup = (group, isOpen) => {
    const trigger = group.querySelector(".cta-trigger");
    const panel = group.querySelector(".cta-contact-popover");

    if (!trigger || !panel) {
      return;
    }

    contactGroups.forEach((currentGroup) => {
      if (currentGroup !== group) {
        closeContactGroup(currentGroup);
      }
    });

    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.hidden = !isOpen;

    if (isOpen) {
      requestAnimationFrame(() => ensureContactPanelVisible(panel));
    }
  };

  contactGroups.forEach((group) => {
    const trigger = group.querySelector(".cta-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      setContactGroup(group, !isOpen);
    });
  });

  document.addEventListener("click", (event) => {
    const clickTarget = event.target;

    if (!(clickTarget instanceof Node)) {
      return;
    }

    contactGroups.forEach((group) => {
      const panel = group.querySelector(".cta-contact-popover");
      const trigger = group.querySelector(".cta-trigger");

      if (
        panel &&
        trigger &&
        !panel.hidden &&
        !panel.contains(clickTarget) &&
        !trigger.contains(clickTarget)
      ) {
        closeContactGroup(group);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const openGroup = contactGroups.find((group) => {
      const panel = group.querySelector(".cta-contact-popover");
      return panel && !panel.hidden;
    });

    if (openGroup) {
      closeContactGroup(openGroup, true);
    }
  });

  window.addEventListener("resize", () => {
    contactGroups.forEach((group) => {
      const panel = group.querySelector(".cta-contact-popover");
      ensureContactPanelVisible(panel);
    });
  });
}
