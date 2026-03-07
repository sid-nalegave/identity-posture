# Identity Security Posture Review

Identity Security Posture Review is a browser-based self-assessment for workforce IAM controls. It helps security and identity teams review control coverage across the areas most often involved in identity-driven incidents, identify immediate exposure, and produce a concise posture summary for leadership.

Live app: [identity-posture.nalegave.com](https://identity-posture.nalegave.com)

Self-assessment only. This app is not a certification.

![Identity Security Posture Review landing page](.github/assets/landing-page.png)

## What the assessment provides

- Section-level scoring across authentication, privileged access, identity lifecycle, and monitoring
- A prioritized view of unresolved gaps based on control weight and exposure
- A leadership-ready summary for risk updates and executive review
- Local browser storage only; no account required

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4

## Local development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

To expose the app on your local network:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Verification

Run the standard checks before merging:

```bash
npm run format
npm run lint
npm test
npm run build
```

## Deployment note

The app is designed for static hosting. Assessment data remains in the browser. The repository includes a baseline Content Security Policy in [`index.html`](/Users/sidnalegave-mini/Projects/web/identity-posture/index.html), but production deployments should still send security headers at the HTTP layer.
