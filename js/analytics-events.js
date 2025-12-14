// ===============================
// GA4 Custom Events for Portfolio
// ===============================

// Helper: safe gtag call
function trackEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

/* -------------------------------
   1. Scroll Depth Tracking
-------------------------------- */
let scrollTracked = {
  25: false,
  50: false,
  75: false,
  100: false
};

window.addEventListener(
  "scroll",
  () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
    );

    [25, 50, 75, 100].forEach((percent) => {
      if (scrollPercent >= percent && !scrollTracked[percent]) {
        scrollTracked[percent] = true;
        trackEvent("scroll_depth", {
          percent_scrolled: percent
        });
      }
    });
  },
  { passive: true }
);

/* -------------------------------
   2. Outbound Link Tracking
-------------------------------- */
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (!link) return;

  const isOutbound =
    link.hostname && link.hostname !== window.location.hostname;

  if (isOutbound) {
    trackEvent("outbound_click", {
      link_url: link.href,
      link_text: link.textContent.trim()
    });
  }
});

/* -------------------------------
   3. Resume / CV Download Tracking
-------------------------------- */
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (!link) return;

  if (
    link.href &&
    (link.href.endsWith(".pdf") || link.href.toLowerCase().includes("resume"))
  ) {
    trackEvent("resume_download", {
      file_url: link.href
    });
  }
});

/* -------------------------------
   4. Contact Intent Tracking
-------------------------------- */
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (!link) return;

  if (link.href.startsWith("mailto:")) {
    trackEvent("contact_email_click", {
      email: link.href.replace("mailto:", "")
    });
  }

  if (link.href.includes("linkedin.com")) {
    trackEvent("contact_linkedin_click", {
      profile_url: link.href
    });
  }
});
