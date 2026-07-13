// ===== Interview Prep Tab Functionality =====

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const qaToggles = document.querySelectorAll('.qa-toggle');

  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabContents.forEach((content) => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(tabName)?.classList.add('active');
      
      // Track tab switch event
      if (typeof gtag === 'function') {
        gtag('event', 'interview_prep_tab_click', {
          tab_name: tabName
        });
      }
    });
  });

  // Q&A accordion toggle
  qaToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const answer = toggle.nextElementSibling;
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      toggle.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
      
      // Track Q&A expansion
      if (typeof gtag === 'function') {
        gtag('event', 'interview_prep_qa_toggle', {
          question: toggle.querySelector('h3').textContent,
          expanded: !isExpanded
        });
      }
    });
  });
});
