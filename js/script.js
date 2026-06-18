document.addEventListener("DOMContentLoaded", () => {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = reduceMotionQuery.matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const header = document.querySelector(".site-header");
  const navMenu = document.querySelector(".site-header .nav-menu");
  const navToggle = document.querySelector(".site-header .nav-toggle");
  const navLinks = document.querySelectorAll('.site-header .nav-menu a[href^="#"]');
  const navIndicator = document.querySelector(".nav-indicator");

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("active");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.toggle("active");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("active")) return;
      if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
      closeMenu();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight : 56;
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;

      window.scrollTo({
        top: y,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  function moveIndicator(link) {
    if (!navIndicator || !link || !navMenu) return;
    const linkRect = link.getBoundingClientRect();
    const menuRect = navMenu.getBoundingClientRect();
    navMenu.style.setProperty("--indicator-x", `${linkRect.left - menuRect.left}px`);
    navMenu.style.setProperty("--indicator-width", `${linkRect.width}px`);
  }

  const observedSections = document.querySelectorAll("main section[id]");
  if (observedSections.length && navLinks.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", isActive);
            if (isActive) moveIndicator(link);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    observedSections.forEach((section) => activeObserver.observe(section));
    moveIndicator(document.querySelector(".nav-menu a.active") || navLinks[0]);
    window.addEventListener("resize", () => {
      moveIndicator(document.querySelector(".nav-menu a.active") || navLinks[0]);
    });
  }

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const typewriter = document.querySelector(".typewriter");
  if (typewriter && !prefersReducedMotion) {
    const fullText = typewriter.textContent.replace(/\s+/g, " ").trim();
    typewriter.textContent = "";
    typewriter.classList.add("ready");
    let index = 0;

    function typeNextCharacter() {
      typewriter.textContent = fullText.slice(0, index);
      index += 1;
      if (index <= fullText.length) {
        window.setTimeout(typeNextCharacter, 26);
      }
    }

    typeNextCharacter();
  }

  document.querySelectorAll("#skills li").forEach((chip, index) => {
    chip.style.setProperty("--float-delay", `${(index % 6) * -420}ms`);
    chip.tabIndex = chip.querySelector("a") ? -1 : 0;
  });

  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll("main section:not(.hero)");
    revealTargets.forEach((target) => target.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  const statNumbers = document.querySelectorAll("[data-count-to]");
  if (statNumbers.length && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const stat = entry.target;
          const finalValue = Number(stat.dataset.countTo || "0");
          const suffix = stat.dataset.suffix || "";

          if (prefersReducedMotion) {
            stat.textContent = `${finalValue}${suffix}`;
          } else {
            const start = performance.now();
            const duration = 900;

            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              stat.textContent = `${Math.round(finalValue * eased)}${suffix}`;
              if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
          }

          observer.unobserve(stat);
        });
      },
      { threshold: 0.7 }
    );

    statNumbers.forEach((stat) => countObserver.observe(stat));
  }

  const timeline = document.querySelector(".timeline");
  const jobs = document.querySelectorAll(".timeline .job");
  if (timeline && jobs.length && "IntersectionObserver" in window) {
    const jobObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("pulse");
          const visibleCount = Array.from(jobs).filter((job) =>
            job.classList.contains("pulse")
          ).length;
          timeline.style.setProperty(
            "--timeline-progress",
            `${Math.max((visibleCount / jobs.length) * 100, 18)}%`
          );
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: 0,
      }
    );

    jobs.forEach((job) => jobObserver.observe(job));
  }

  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${x * 5}deg`);
        card.style.setProperty("--tilt-y", `${y * -5}deg`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });

    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(x, y);
        if (distance > 40) return;
        button.style.setProperty("--mx", `${x * 0.12}px`);
        button.style.setProperty("--my", `${y * 0.18}px`);
      });

      button.addEventListener("mouseleave", () => {
        button.style.setProperty("--mx", "0px");
        button.style.setProperty("--my", "0px");
      });
    });
  }

  const canvas = document.querySelector(".hero-circuit");
  if (canvas && !prefersReducedMotion) {
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frameId = 0;
    const particles = Array.from({ length: 44 }, (_, index) => ({
      x: (index * 97) % 100,
      y: (index * 53) % 100,
      vx: ((index % 5) - 2) * 0.018,
      vy: ((index % 7) - 3) * 0.014,
    }));

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(56,189,248,0.24)";
      context.fillStyle = "rgba(125,211,252,0.52)";
      context.lineWidth = 1;

      particles.forEach((particle) => {
        particle.x = (particle.x + particle.vx + 100) % 100;
        particle.y = (particle.y + particle.vy + 100) % 100;
      });

      particles.forEach((particle, index) => {
        const px = (particle.x / 100) * width;
        const py = (particle.y / 100) * height;
        context.beginPath();
        context.arc(px, py, 1.3, 0, Math.PI * 2);
        context.fill();

        for (let i = index + 1; i < particles.length; i += 1) {
          const other = particles[i];
          const ox = (other.x / 100) * width;
          const oy = (other.y / 100) * height;
          const distance = Math.hypot(px - ox, py - oy);
          if (distance > 145) continue;
          context.globalAlpha = 1 - distance / 145;
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(ox, oy);
          context.stroke();
          context.globalAlpha = 1;
        }
      });

      frameId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
    reduceMotionQuery.addEventListener("change", (event) => {
      if (event.matches) cancelAnimationFrame(frameId);
    });
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
