import { ThemeToggle } from "./ThemeToggle.tsx";

interface LandingProps {
  isDark: boolean;
  onStart: () => void;
  onToggleTheme: () => void;
}

const alignments = ["NIST SP 800-63", "CIS Controls", "Enterprise IAM Patterns"];

export function Landing({ isDark, onStart, onToggleTheme }: LandingProps) {
  return (
    <div className="min-h-screen bg-page text-text-primary">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-text-primary md:text-xs">
              Identity Posture
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-border px-3.5 py-1.5 text-xs text-text-muted sm:inline">
              Self-assessment · Not a certification
            </span>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center">
        {/* Hero */}
        <section className="w-full max-w-3xl px-6 pb-12 pt-20 text-center">
          {/* Alert pill */}
          <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-risk-border bg-risk-bg px-4 py-2 text-sm text-risk">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-risk" aria-hidden="true" />
            Identity is now the #1 attack vector. Most orgs can't quantify their exposure.
          </div>

          {/* Headline */}
          <h1
            className="mb-8 font-sans font-black text-text-primary"
            style={{ fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
          >
            Find your organization's
            <br />
            identity gaps{" "}
            <span className="text-accent">
              before they
              <br />
              become incidents
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="mx-auto mb-10 max-w-[500px] text-text-secondary"
            style={{ fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.7 }}
          >
            Assess 18 controls across authentication, access governance, and monitoring — scored
            against NIST SP 800–63, CIS benchmarks, and enterprise IAM patterns.
          </p>

          {/* CTA button */}
          <button
            type="button"
            onClick={onStart}
            className="mb-5 inline-flex cursor-pointer items-center gap-3 rounded-full px-10 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1e3a8a" }}
          >
            Begin Assessment
            <span aria-hidden="true">→</span>
          </button>

          {/* Meta */}
          <p className="font-mono text-xs text-text-faint">
            18 questions · Scored report in under 10 minutes
          </p>
        </section>

        {/* Privacy card */}
        <section className="w-full max-w-3xl px-6 pb-12">
          <div className="rounded-2xl px-8 py-7" style={{ backgroundColor: "#0d1526" }}>
            {/* Row 1 */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 px-6 text-sm" style={{ color: "#8da3bf" }}>
                <LockIcon />
                No data leaves your browser
              </div>
              <div className="h-4 w-px flex-shrink-0" style={{ backgroundColor: "#2a3a5a" }} aria-hidden="true" />
              <div className="flex items-center gap-2 px-6 text-sm" style={{ color: "#8da3bf" }}>
                <PersonIcon />
                No account required
              </div>
              <div className="h-4 w-px flex-shrink-0" style={{ backgroundColor: "#2a3a5a" }} aria-hidden="true" />
            </div>
            {/* Row 2 */}
            <div className="mt-5 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm" style={{ color: "#8da3bf" }}>
                <EyeIcon />
                No vendor access to responses
              </div>
            </div>
          </div>
        </section>

        {/* Aligned with */}
        <section className="w-full max-w-3xl px-6 pb-20">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
              Aligned with
            </span>
            {alignments.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-text-secondary"
              >
                {a}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
