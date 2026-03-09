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

const alignments = ["NIST SP 800-63-4", "CIS Controls", "Enterprise IAM patterns"];

export function Landing({ isDark, onStart, onToggleTheme }: LandingProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-page text-text-primary">
      <nav className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex items-center gap-[10px]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-accent"
              aria-hidden="true"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className="font-mono text-[14px] font-semibold uppercase tracking-[0.08em] text-text-primary">
              Identity Posture
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>

      <main className="flex min-h-[calc(100vh-56px)] w-full flex-col">
        <section className="hero-grid mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-24 pt-20 text-center md:pb-16">
          <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-risk-border bg-risk-bg px-4 py-2 font-sans text-[13px] font-medium tracking-[-0.01em] text-risk">
            <span className="size-2 shrink-0 animate-pulse rounded-full bg-risk" />
            Credential abuse is the #1 initial access vector in breaches (Verizon DBIR 2025)
          </div>

          <h1
            className="mb-5 font-sans text-text-primary"
            style={{ fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.15, letterSpacing: "-0.025em" }}
          >
            Find your identity gaps{" "}
            <span className="text-accent">before they become incidents</span>
          </h1>

          <p
            className="mb-12 max-w-xl text-text-secondary"
            style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.75 }}
          >
            A scored, prioritized view of your identity security gaps — with recommendations
            mapped to each control.
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

          <p className="mt-4 font-mono text-[13px] text-text-muted">
            18 questions · Scored report in under 10 minutes
          </p>
        </section>

        <section className="border-t border-border bg-surface px-6 pb-14 pt-16 md:px-10 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-5xl">
            <h2
              className="mb-6 font-sans text-text-primary"
              style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 600, letterSpacing: "-0.015em" }}
            >
              What&apos;s in your report
            </h2>
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
              <span className="text-[11px] text-text-faint">Controls align with</span>
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
