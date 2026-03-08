import { useState } from "react";
import { copyToClipboard } from "../lib/clipboard.ts";
import { buildCopySummary, exportJSON, exportMarkdown } from "../lib/export.ts";
import { getScoreBandInfo } from "../lib/theme.ts";
import type { AssessmentState, ControlBank, SectionScore, TopRisk } from "../lib/types.ts";

interface ResultsPanelProps {
  overallScore: number;
  scoreBand: string;
  interpretation: string;
  sectionScores: SectionScore[];
  topRisks: TopRisk[];
  state: AssessmentState;
  bank: ControlBank;
  totalAnswered: number;
  isAssessmentComplete: boolean;
  totalControls: number;
  gapCount: number;
  onSectionClick: (sectionId: string) => void;
  onControlClick: (controlId: string) => void;
}

const toneClasses = {
  risk: {
    text: "text-risk",
    bg: "bg-risk-bg",
    border: "border-risk-border",
    progress: "bg-risk",
  },
  warning: {
    text: "text-warning",
    bg: "bg-warning-bg",
    border: "border-warning-border",
    progress: "bg-warning",
  },
  caution: {
    text: "text-caution",
    bg: "bg-caution-bg",
    border: "border-caution-border",
    progress: "bg-caution",
  },
  healthy: {
    text: "text-healthy",
    bg: "bg-healthy-bg",
    border: "border-healthy-border",
    progress: "bg-healthy",
  },
} as const;

export function ResultsPanel({
  overallScore,
  scoreBand,
  interpretation,
  sectionScores,
  topRisks,
  state,
  bank,
  totalAnswered,
  isAssessmentComplete,
  totalControls,
  gapCount,
  onSectionClick,
  onControlClick,
}: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);
  const hasScore = totalAnswered > 0;
  const bandInfo = getScoreBandInfo(overallScore);
  const bandTone = toneClasses[bandInfo.tone];

  const handleCopy = async () => {
    const summary = buildCopySummary(
      overallScore,
      scoreBand,
      interpretation,
      sectionScores,
      topRisks,
    );
    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <section
        className={`rounded-[6px] border border-border bg-surface p-5 ${
          hasScore ? `border-l-4 ${bandTone.border}` : ""
        }`}
      >
        {hasScore ? (
          <>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
                  Posture score
                </p>
                <div className={`font-mono text-6xl font-bold leading-none ${bandTone.text}`}>
                  {Math.round(overallScore)}
                </div>
                <div className={`status-pill mt-3 ${bandTone.bg} ${bandTone.border} ${bandTone.text}`}>
                  {bandInfo.label}
                </div>
              </div>
              {gapCount > 0 ? (
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
                    Open gaps
                  </p>
                  <div className="mt-1 font-mono text-2xl font-bold leading-none text-risk">
                    {gapCount}
                  </div>
                  <p className="mt-1 text-xs text-risk">controls marked gap</p>
                </div>
              ) : null}
            </div>
            <p className="mb-3 text-sm leading-relaxed text-text-body">{bandInfo.desc}</p>
            <div className="h-1.5 rounded-[6px] bg-border-subtle">
              <div
                className={`h-full rounded-[6px] transition-[width] duration-500 ${bandTone.progress}`}
                style={{ width: `${Math.round(overallScore)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-text-faint">
              {[0, 40, 60, 80, 100].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
            <p className="mt-3 text-xs text-text-muted">
              {Math.round(overallScore)} indicates {bandInfo.label.toLowerCase()}, based on{" "}
              <span className="font-mono">
                {totalAnswered}/{totalControls}
              </span>{" "}
              answered controls. N/A responses are excluded.
            </p>
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
              Posture score
            </p>
            <div className="mt-2 font-mono text-5xl font-bold leading-none text-text-faint">
              &mdash;
            </div>
            <p className="mt-3 text-sm text-text-muted">Answer controls to generate a posture score.</p>
          </div>
        )}
      </section>

      <section className="panel-card p-4">
        <span className="section-kicker">Posture Summary</span>
        <div className="rounded-[6px] border border-accent-border bg-accent-subtle px-4 py-3">
          <p className="text-sm leading-loose text-text-body">{interpretation}</p>
        </div>
      </section>

      {topRisks.length > 0 ? (
        <section className="panel-card p-4">
          <span className="section-kicker">Top Risks</span>
          <div className="space-y-4">
            {topRisks.map((risk, index) => {
              const riskTone = risk.status === "gap" ? "text-risk" : "text-warning";
              return (
                <div
                  key={risk.control.id}
                  className={index < topRisks.length - 1 ? "border-b border-border pb-4" : ""}
                >
                  <div className="mb-1 flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-1 block h-2 w-2 rounded-[2px] bg-current ${riskTone}`}
                    />
                    <button
                      type="button"
                      onClick={() => onControlClick(risk.control.id)}
                      className="text-left text-sm font-semibold leading-snug text-text-primary transition-colors hover:text-accent"
                    >
                      {risk.control.title}
                    </button>
                  </div>
                  <p className="pl-5 pt-1 text-sm leading-relaxed text-text-muted">
                    {risk.control.next_step}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="panel-card p-4">
        <span className="section-kicker">Section Scores</span>
        <div className="space-y-3">
          {sectionScores.map((section) => {
            const hasSectionScore = section.score !== null;
            const score = section.score;
            const sectionBand = score !== null ? getScoreBandInfo(score) : null;
            const sectionTone = sectionBand ? toneClasses[sectionBand.tone] : null;

            return (
              <button
                key={section.section_id}
                type="button"
                onClick={() => onSectionClick(section.section_id)}
                className="block w-full rounded-[6px] border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-page"
              >
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <span className="text-sm text-text-secondary">{section.label}</span>
                  <span
                    className={`shrink-0 font-mono text-xs font-semibold ${
                      hasSectionScore && sectionTone ? sectionTone.text : "text-text-muted"
                    }`}
                  >
                    {score !== null ? `${Math.round(score)}%` : "N/A"}
                  </span>
                </div>
                <div className="h-1.5 rounded-[6px] bg-border-subtle">
                  <div
                    className={`h-full rounded-[6px] transition-[width] duration-300 ${
                      hasSectionScore && sectionTone ? sectionTone.progress : "bg-border"
                    }`}
                    style={{ width: `${score ?? 0}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel-card p-4">
        <span className="section-kicker">Share & Export</span>
        {hasScore ? (
          <button
            type="button"
            onClick={handleCopy}
            className={`mb-2 w-full rounded-[6px] border px-4 py-2 text-sm font-medium transition-colors ${
              copied
                ? "border-healthy-border bg-healthy-bg text-healthy"
                : "border-btn-inactive-border bg-btn-inactive text-text-secondary hover:border-accent hover:text-accent"
            }`}
          >
            {copied ? "Summary copied" : "Copy summary"}
          </button>
        ) : null}
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => exportJSON(state, bank)}
            disabled={!isAssessmentComplete}
            className="btn-secondary flex-1"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() =>
              exportMarkdown(state, bank, overallScore, scoreBand, sectionScores, topRisks)
            }
            disabled={!isAssessmentComplete}
            className="btn-secondary flex-1"
          >
            Export Markdown
          </button>
        </div>
        {!isAssessmentComplete ? (
          <p className="mb-2 text-xs leading-relaxed text-text-faint">
            Select a status for every control to enable export.
          </p>
        ) : null}
        <p className="text-xs leading-relaxed text-text-faint">
          Generated locally. Responses and notes remain in this browser until cleared.
        </p>
      </section>
    </div>
  );
}
