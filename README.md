# Identity Security Posture Review

Static React + TypeScript + Vite frontend for running an identity security posture assessment in the browser.

## Development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

To expose the app on your local network:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Verification

Run the standard checks:

```bash
npm run format
npm run lint
npm test
npm run build
```

## Security Baseline

The app includes a repo-visible baseline Content Security Policy in [index.html](/Users/sidnalegave-mini/Projects/web/identity-posture/index.html). This is intended to make the policy visible in source control for static hosting scenarios, but it is not the full production control surface.

Current baseline allows:
- local app assets from `self`
- local image data URLs
- Google Fonts stylesheet from `https://fonts.googleapis.com`
- Google Fonts files from `https://fonts.gstatic.com`

Current baseline blocks:
- remote scripts
- plugin/object content
- cross-origin form submission

## Production Deployment Requirements

Production hosting should deliver security headers as HTTP response headers. The meta CSP in `index.html` is only a baseline and does not replace header-delivered policy.

At minimum, production hosting should set:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
X-Frame-Options: DENY
```

Notes:
- `frame-ancestors` is not enforced from a meta tag, so it must be sent as an HTTP response header.
- `X-Frame-Options: DENY` is optional but recommended for older browser compatibility.
- If fonts are later self-hosted, the CSP can be tightened further by removing the Google Fonts origins.
