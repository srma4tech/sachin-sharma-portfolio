document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const header = document.querySelector(".site-header");
  const navMenu = document.querySelector(".site-header .nav-menu");
  const navToggle = document.querySelector(".site-header .nav-toggle");
  const navLinks = document.querySelectorAll('.site-header .nav-menu a[href^="#"]');

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("active");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.toggle("active");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("active")) return;
      if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
      closeMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight : 56;
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: y,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  const observedSections = document.querySelectorAll("main section[id]");
  const trackedNavLinks = document.querySelectorAll('.site-header .nav-menu a[href^="#"]');

  if (observedSections.length && trackedNavLinks.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          trackedNavLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    observedSections.forEach((section) => activeObserver.observe(section));
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll("main section");

    revealTargets.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(14px)";
      section.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((section) => revealObserver.observe(section));
  }

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const subjectError = document.getElementById("subject-error");
  const messageError = document.getElementById("message-error");

  function setValidation(input, errorNode, isValid, message) {
    if (!input || !errorNode) return isValid;
    input.classList.toggle("valid", isValid);
    input.classList.toggle("invalid", !isValid);
    errorNode.textContent = isValid ? "" : message;
    return isValid;
  }

  function validateName() {
    const value = nameInput ? nameInput.value.trim() : "";
    return setValidation(
      nameInput,
      nameError,
      value.length >= 2,
      "Name must be at least 2 characters."
    );
  }

  function validateEmail() {
    const value = emailInput ? emailInput.value.trim() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return setValidation(
      emailInput,
      emailError,
      emailRegex.test(value),
      "Please enter a valid email address."
    );
  }

  function validateSubject() {
    const value = subjectInput ? subjectInput.value.trim() : "";
    return setValidation(
      subjectInput,
      subjectError,
      value.length >= 5,
      "Subject must be at least 5 characters."
    );
  }

  function validateMessage() {
    const value = messageInput ? messageInput.value.trim() : "";
    return setValidation(
      messageInput,
      messageError,
      value.length >= 10,
      "Message must be at least 10 characters."
    );
  }

  if (nameInput) nameInput.addEventListener("blur", validateName);
  if (emailInput) emailInput.addEventListener("blur", validateEmail);
  if (subjectInput) subjectInput.addEventListener("blur", validateSubject);
  if (messageInput) messageInput.addEventListener("blur", validateMessage);

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const isValid =
        validateName() && validateEmail() && validateSubject() && validateMessage();

      if (!isValid) {
        alert("Please correct the highlighted fields before continuing.");
        return;
      }

      const name = encodeURIComponent(nameInput.value.trim());
      const email = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim());
      const message = encodeURIComponent(messageInput.value.trim());

      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
      const mailto = `mailto:sachin.sharma.dev@outlook.com?subject=${subject}&body=${body}`;

      if (typeof gtag === "function") {
        gtag("event", "contact_form_submit", { method: "mailto_draft" });
      }

      window.location.href = mailto;
    });

    form.addEventListener("reset", () => {
      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        if (input) input.classList.remove("valid", "invalid");
      });

      [nameError, emailError, subjectError, messageError].forEach((errorNode) => {
        if (errorNode) errorNode.textContent = "";
      });
    });
  }
});
