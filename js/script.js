document.addEventListener("DOMContentLoaded", () => {
  /* ==================================================
   Cinematic Intro – Run Once
================================================== */

  const intro = document.getElementById("cinematic-intro");

  if (intro && !sessionStorage.getItem("introPlayed")) {
    setTimeout(() => {
      intro.classList.add("hidden");
      sessionStorage.setItem("introPlayed", "true");

      setTimeout(() => {
        intro.remove();
      }, 1000);
    }, 2200);
  } else if (intro) {
    intro.remove();
  }

  /* ==================================================
     HEADER NAVIGATION (CLEAN & SCOPED)
  ================================================== */

  const header = document.querySelector(".site-header");
  const navMenu = document.querySelector(".site-header .nav-menu");
  const navToggle = document.querySelector(".site-header .nav-toggle");
  const navLinks = document.querySelectorAll(".site-header .nav-menu a");

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("open");

      // Lock body scroll on mobile
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    });
  }

  // Close menu on nav link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("active") &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  /* ==================================================
     SMOOTH SCROLL (HEADER AWARE)
  ================================================== */

  document.querySelectorAll('.site-header a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = header ? header.offsetHeight : 56;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });

  /* ==================================================
     ACTIVE NAV LINK HIGHLIGHT
  ================================================== */

  const sections = document.querySelectorAll("section");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      {
        rootMargin: "-60px 0px -60px 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ==================================================
     SECTION REVEAL ANIMATION
  ================================================== */

  const sectionsAnim = document.querySelectorAll("section");

  if (sectionsAnim.length) {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsAnim.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      animObserver.observe(section);
    });
  }

  /* ==================================================
     BACK TO TOP
  ================================================== */

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==================================================
     FORM VALIDATION (UNCHANGED LOGIC)
  ================================================== */

  const form = document.querySelector("form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const subjectError = document.getElementById("subject-error");
  const messageError = document.getElementById("message-error");

  function validateName() {
    if (!nameInput) return true;
    const name = nameInput.value.trim();
    if (name.length < 2) {
      nameInput.classList.add("invalid");
      nameInput.classList.remove("valid");
      if (nameError)
        nameError.textContent = "Name must be at least 2 characters.";
      return false;
    }
    nameInput.classList.remove("invalid");
    nameInput.classList.add("valid");
    if (nameError) nameError.textContent = "";
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailInput.classList.add("invalid");
      emailInput.classList.remove("valid");
      if (emailError)
        emailError.textContent = "Please enter a valid email address.";
      return false;
    }
    emailInput.classList.remove("invalid");
    emailInput.classList.add("valid");
    if (emailError) emailError.textContent = "";
    return true;
  }

  function validateSubject() {
    if (!subjectInput) return true;
    const subject = subjectInput.value.trim();
    if (subject.length < 5) {
      subjectInput.classList.add("invalid");
      subjectInput.classList.remove("valid");
      if (subjectError)
        subjectError.textContent = "Subject must be at least 5 characters.";
      return false;
    }
    subjectInput.classList.remove("invalid");
    subjectInput.classList.add("valid");
    if (subjectError) subjectError.textContent = "";
    return true;
  }

  function validateMessage() {
    if (!messageInput) return true;
    const message = messageInput.value.trim();
    if (message.length < 10) {
      messageInput.classList.add("invalid");
      messageInput.classList.remove("valid");
      if (messageError)
        messageError.textContent = "Message must be at least 10 characters.";
      return false;
    }
    messageInput.classList.remove("invalid");
    messageInput.classList.add("valid");
    if (messageError) messageError.textContent = "";
    return true;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      const valid =
        validateName() &&
        validateEmail() &&
        validateSubject() &&
        validateMessage();

      if (!valid) {
        e.preventDefault();
        alert("Please correct the errors in the form.");
        return;
      }

      alert(
        "Thank you for your message! Your email client has been opened to send the message."
      );
      form.reset();
    });
  }

  const resetBtn = document.querySelector('button[type="reset"]');
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        if (input) input.classList.remove("valid", "invalid");
      });
      [nameError, emailError, subjectError, messageError].forEach((error) => {
        if (error) error.textContent = "";
      });
    });
  }
});
