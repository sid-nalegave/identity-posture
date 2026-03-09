import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/og-image.png");

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
  body {
    width: 1200px;
    height: 630px;
    background: #F5F7FB;
    font-family: 'Sora', system-ui, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .card {
    width: 1200px;
    height: 630px;
    background: #F5F7FB;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 96px;
    position: relative;
  }
  .accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: #1A55C0;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
  }
  .shield {
    width: 56px;
    height: 56px;
  }
  .site-label {
    font-size: 22px;
    font-weight: 600;
    color: #1A55C0;
    letter-spacing: 0.01em;
  }
  .title {
    font-size: 64px;
    font-weight: 700;
    color: #0D1B2E;
    line-height: 1.1;
    margin-bottom: 28px;
    letter-spacing: -0.02em;
  }
  .description {
    font-size: 26px;
    font-weight: 400;
    color: #4A5568;
    line-height: 1.5;
    max-width: 820px;
  }
  .domain {
    position: absolute;
    bottom: 48px;
    right: 96px;
    font-size: 20px;
    font-weight: 600;
    color: #A0AEC0;
    letter-spacing: 0.02em;
  }
</style>
</head>
<body>
<div class="card">
  <div class="accent-bar"></div>
  <div class="logo-row">
    <svg class="shield" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#E8EEF9"/>
      <path
        d="M32 8 13 16.444V29.111C13 40.815 21.107 51.76 32 54.667c10.893-2.907 19-13.852 19-25.556V16.444L32 8Z"
        fill="none"
        stroke="#1A55C0"
        stroke-width="5.333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="site-label">identity-posture.nalegave.com</span>
  </div>
  <div class="title">Identity Security<br>Posture Review</div>
  <div class="description">Score identity control coverage, prioritize gaps, and generate a concise posture summary for leadership.</div>
  <div class="domain">Free · No login required</div>
</div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle" });
const screenshot = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

writeFileSync(outPath, screenshot);
console.log(`Written to ${outPath}`);
