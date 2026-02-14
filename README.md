# Sachin Sharma Portfolio

Personal portfolio site focused on AEM backend engineering, enterprise delivery impact, and contact conversion.

## Current Highlights

- Single-page portfolio with clear value proposition and action-focused hero
- Responsive navigation with mobile menu accessibility support (`aria-expanded`, keyboard-friendly links)
- Improved content hierarchy for faster recruiter/client scanning
- Contact form validation with email draft generation via `mailto:`
- GA4 event hooks (`js/analytics-events.js` + form submit event in `js/script.js`)
- SEO metadata and structured data for discoverability

## Tech Stack

- `index.html`
- `css/style.css`
- `js/script.js`
- `js/analytics-events.js`

No build tooling is required.

## Local Run

1. Clone the repository.
2. Open `index.html` in any modern browser.

## Deployment

Deploy as a static site on:

- GitHub Pages
- Netlify
- Vercel
- AWS S3 Static Hosting
- Any Apache/Nginx static host

## Customization

- Content updates: `index.html`
- Styling and layout: `css/style.css`
- Interactions and validation: `js/script.js`
- Tracking events: `js/analytics-events.js`

## Recommended Next Upgrades

- Add a real backend contact endpoint (Formspree/Netlify Forms/custom API) for higher message completion.
- Replace third-party profile image URL with a local optimized image asset.
- Add project case studies with quantified outcomes (latency, release speed, defect reduction).
- Add Lighthouse CI checks in GitHub Actions for performance and accessibility guardrails.
