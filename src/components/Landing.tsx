import { useState } from "react";
import { BarChart2, FileDown, FileText, ListOrdered } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle.tsx";

interface LandingProps {
  isDark: boolean;
  onStart: () => void;
  onToggleTheme: () => void;
}

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

          <p className="mt-4 font-mono text-[13px] text-text-muted">
            18 questions · Scored report in under 10 minutes
          </p>
        </section>

        <section className="bg-page px-6 pb-20 md:pb-28">
          <div className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl bg-[#0d1117] px-6 py-4 text-center font-sans text-[12px] text-gray-400">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-gray-500"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>
              Assessment responses stay in your browser · No account required · Aligned with NIST
              800&#x2011;63&#x2011;4 &amp; CIS Controls
            </span>
          </div>
        </section>

        <section className="bg-[#0d1117] px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-5xl">
            {/* Section header */}
            <div className="mb-12">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a9fff]">
                What you'll receive
              </p>
              <h2
                style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}
                className="mb-4 font-sans text-white"
              >
                A report you can act on
              </h2>
              <p className="max-w-xl text-[15px] leading-relaxed text-gray-400">
                A scored assessment across four identity domains: prioritized gaps, specific
                recommendations, and a summary ready for your next risk review.
              </p>
            </div>

            {/* Two-column grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* LEFT: Static report preview card */}
              <div className="self-start rounded-2xl bg-white p-6 shadow-xl">
                {/* Card header + score circle */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Identity Posture Report</p>
                    <p className="mt-0.5 text-xs text-gray-400">Sample — March 2026</p>
                  </div>
                  {/* SVG score circle — 62/100, amber ring */}
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                      <circle cx="28" cy="28" r="23" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                      <circle
                        cx="28"
                        cy="28"
                        r="23"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        strokeDasharray="89.5 55.0"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-base font-bold text-gray-900">62</span>
                  </div>
                </div>

                {/* Domain bars — static sample data */}
                <div className="mb-5 space-y-3">
                  {[
                    { label: "Authentication & MFA", pct: 78, color: "#22c55e" },
                    { label: "Privileged Access", pct: 41, color: "#f59e0b" },
                    { label: "Identity Lifecycle & Governance", pct: 68, color: "#22c55e" },
                    { label: "Monitoring & Detection", pct: 35, color: "#ef4444" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-700">{label}</span>
                        <span className="text-xs font-medium text-gray-500">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top finding callout */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-amber-700">
                    Top Finding
                  </p>
                  <p className="text-xs leading-relaxed text-amber-800">
                    Privileged access and monitoring score below 50% — indicating elevated risk of
                    undetected lateral movement.
                  </p>
                </div>
              </div>

              {/* RIGHT: Feature cards */}
              <div className="flex flex-col gap-3">
                {/* Domain Scores */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <BarChart2 size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="mb-1 font-sans text-sm font-semibold text-white">Domain Scores</p>
                      <p className="text-[13px] leading-relaxed text-gray-400">
                        Coverage score per identity domain so you see exactly where you're exposed — not
                        just an aggregate number.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prioritised Gap List */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <ListOrdered size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="mb-1 font-sans text-sm font-semibold text-white">Prioritised Gap List</p>
                      <p className="text-[13px] leading-relaxed text-gray-400">
                        Unaddressed controls ranked by severity — foundational gaps surfaced first so you
                        fix what matters.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leadership Summary */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <FileText size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="mb-1 font-sans text-sm font-semibold text-white">Leadership Summary</p>
                      <p className="text-[13px] leading-relaxed text-gray-400">
                        One paragraph you can paste directly into a risk update, board deck, or audit
                        response.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PDF Export — coming soon */}
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-8 text-center">
                  <div className="mb-4 rounded-xl bg-white/5 p-4">
                    <FileDown size={28} className="text-gray-500" />
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-sans text-sm font-semibold text-gray-400">PDF Export</p>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-gray-500">
                      Coming soon
                    </span>
                  </div>
                  <p className="mt-1 max-w-[220px] text-[13px] leading-relaxed text-gray-500">
                    Download a formatted report to share with your team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
