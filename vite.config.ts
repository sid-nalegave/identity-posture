import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const baselineCsp =
  "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self'";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "production-csp-meta",
      transformIndexHtml(_, ctx) {
        if (ctx.server) {
          return undefined;
        }

        return [
          {
            tag: "meta",
            attrs: {
              "http-equiv": "Content-Security-Policy",
              content: baselineCsp,
            },
            injectTo: "head",
          },
        ];
      },
    },
  ],
  server: {
    allowedHosts: ["host.docker.internal"],
  },
});
