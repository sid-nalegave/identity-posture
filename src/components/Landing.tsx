import { ThemeToggle } from "./ThemeToggle.tsx";

interface LandingProps {
  isDark: boolean;
  onStart: () => void;
  onToggleTheme: () => void;
}

const outcomes = [
  {
    index: "01",
    label: "Exposure by domain",
    body: "A score for each identity domain so you can see exactly where coverage is weak.",
  },
  {
    index: "02",
    label: "Prioritised risk view",
    body: "Your unaddressed gaps ranked by severity — foundational controls first.",
  },
  {
    index: "03",
    label: "Leadership-ready summary",
    body: "A one-paragraph summary you can paste into a risk update or board report.",
  },
];

const steps = [
  {
    index: "01",
    label: "Answer 18 questions",
    body: "Rate each identity control as implemented, partial, planned, or not in place.",
  },
  {
    index: "02",
    label: "Get your posture score",
    body: "Scores calculated across all four domains — instantly, in your browser.",
  },
  {
    index: "03",
    label: "Act on your gaps",
    body: "Prioritised findings with severity ratings help you decide what to fix first.",
  },
];

const domains = [
  {
    id: "auth",
    label: "Authentication & MFA",
    description: "Password policies, MFA coverage, phishing-resistant methods.",
  },
  {
    id: "pam",
    label: "Privileged Access",
    description: "Admin account controls, just-in-time access, PAM tooling.",
  },
  {
    id: "lifecycle",
    label: "Identity Lifecycle & Governance",
    description: "Joiner/mover/leaver workflows, access reviews, IGA coverage.",
  },
  {
    id: "monitoring",
    label: "Monitoring & Detection",
    description: "Identity threat detection, SIEM integration, alert coverage.",
  },
];

const alignments = ["NIST SP 800-63", "CIS Controls", "Enterprise IAM patterns"];

export function Landing({ isDark, onStart, onToggleTheme }: LandingProps) {
  return (
    <div className="min-h-screen bg-page text-text-primary">
      <nav className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted md:text-xs">
            Identity Posture
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-text-faint sm:inline">
              Self-assessment. Not a certification.
            </span>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>

      <main className="flex min-h-[calc(100vh-56px)] w-full flex-col">
        {/* Hero */}
        <section className="hero-grid mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-20 md:pb-16 text-center">
          <div className="mb-10 inline-flex flex-wrap items-center justify-center gap-0 overflow-hidden rounded-[6px] border border-border bg-surface">
            {["Workforce IAM", "4 domains", "18 controls", "~10 min"].map((text, index) => (
              <span
                key={text}
                className={`inline-flex items-center px-4 py-2 font-mono text-[11px] tracking-[0.08em] text-text-muted ${
                  index > 0 ? "border-l border-border" : ""
                }`}
              >
                {text}
              </span>
            ))}
          </div>

          <h1
            className="mb-5 font-sans text-text-primary"
            style={{ fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.15, letterSpacing: "-0.025em" }}
          >
            Structured review of your
            <br />
            <span className="text-accent">identity security controls</span>
          </h1>

          <p
            className="mb-12 max-w-xl text-text-secondary"
            style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.75 }}
          >
            Full coverage across authentication, privileged access, identity lifecycle, and
            monitoring. Know exactly where you stand in under ten minutes.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="btn-primary text-base"
          >
            Begin Assessment
          </button>

          <p className="mt-4 text-xs text-text-faint">
            No account required. Assessment data remains in this browser.
          </p>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-page px-6 pt-14 pb-10 md:py-12 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="section-kicker">How it works</p>
            <div className="grid overflow-hidden rounded-[6px] border border-border md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.label}
                  className={`bg-surface p-6 ${index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}
                >
                  <p className="mb-2 font-mono text-[11px] tracking-[0.08em] text-text-faint">
                    {step.index}
                  </p>
                  <p className="mb-2 text-sm font-semibold tracking-[0.01em] text-text-primary">
                    {step.label}
                  </p>
                  <p className="text-sm leading-relaxed text-text-secondary">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you'll assess */}
        <section className="border-t border-border bg-surface px-6 pt-14 pb-10 md:py-12 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="section-kicker">What you'll assess</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="rounded-[6px] border border-border bg-page p-4"
                >
                  <p className="mb-1 text-sm font-semibold tracking-[0.01em] text-text-primary">
                    {domain.label}
                  </p>
                  <p className="text-sm leading-relaxed text-text-secondary">{domain.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you'll get */}
        <section className="border-t border-border bg-page px-6 pt-14 pb-10 md:py-12 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="section-kicker">What you'll get</p>
            <div className="grid overflow-hidden rounded-[6px] border border-border md:grid-cols-3">
              {outcomes.map((item, index) => (
                <div
                  key={item.label}
                  className={`bg-surface p-6 ${index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}
                >
                  <p className="mb-2 font-mono text-[11px] tracking-[0.08em] text-text-faint">
                    {item.index}
                  </p>
                  <p className="mb-2 text-sm font-semibold tracking-[0.01em] text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-text-faint">Aligns with</span>
              {alignments.map((alignment) => (
                <span
                  key={alignment}
                  className="rounded-[6px] border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text-muted"
                >
                  {alignment}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-border bg-surface px-6 py-12 text-center md:px-10">
          <div className="mx-auto max-w-xl">
            <p
              className="mb-6 text-text-secondary"
              style={{ fontSize: "clamp(15px, 1.6vw, 16px)", lineHeight: 1.7 }}
            >
              Ready to understand your identity security posture?
            </p>
            <button
              type="button"
              onClick={onStart}
              className="btn-primary text-base"
            >
              Begin Assessment
            </button>
            <p className="mt-4 text-xs text-text-faint">Free. No sign-up. Runs entirely in your browser.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-page px-6 py-6 md:px-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">
              Identity Posture
            </span>
            <p className="text-[11px] text-text-faint">
              Self-assessment tool. Not a certification or audit. Results reflect your self-reported responses.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
