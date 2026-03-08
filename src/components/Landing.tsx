import { useState } from "react";
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

const alignments = ["NIST SP 800-63", "CIS Controls", "Enterprise IAM patterns"];

export function Landing({ isDark, onStart, onToggleTheme }: LandingProps) {
  const [isHovering, setIsHovering] = useState(false);

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
        <section className="hero-grid mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-20 md:pb-16 text-center">
          <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-risk-border bg-risk-bg px-4 py-2 font-sans text-[13px] font-medium tracking-[-0.01em] text-risk">
            <span className="size-2 shrink-0 animate-pulse rounded-full bg-risk" />
            Credential abuse is the #1 initial access vector in breaches (Verizon DBIR 2025)
          </div>

          <h1
            className="mb-5 font-sans text-text-primary"
            style={{ fontSize: "52px", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.025em" }}
          >
            Find your organization's identity gaps{" "}
            <span className="text-accent" style={{ fontWeight: 600 }}>before they become incidents</span>
          </h1>

          <p
            className="mb-12 max-w-xl text-text-secondary"
            style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.75 }}
          >
            Get a scored, prioritized view of your identity security gaps, with actionable
            recommendations mapped to each control.
          </p>

          <button
            type="button"
            onClick={onStart}
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
            className={`btn-primary text-base ${isHovering ? "bg-accent-hover" : ""}`}
          >
            Begin Assessment
          </button>

          <p className="mt-4 text-xs text-text-faint">
            No account required. Assessment data remains in this browser.
          </p>
        </section>

        <section className="border-t border-border bg-surface px-6 pt-14 pb-10 md:py-10 md:px-10">
          <div className="mx-auto max-w-5xl">
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
                  className="rounded-[6px] border border-border bg-page px-2.5 py-1 font-mono text-[11px] text-text-muted"
                >
                  {alignment}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
