import type {
  AssessmentState,
  ControlBank,
  SectionScore,
  TopRisk,
} from "./types.ts";
import { getAnsweredCount } from "./scoring.ts";

function formatSectionScore(score: SectionScore["score"]): string {
  return score === null ? "N/A" : `${Math.round(score)}%`;
}

function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeMarkdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br />");
}

export function buildJSONExport(
  state: AssessmentState,
  bank: ControlBank,
): string {
  return JSON.stringify(
    {
      bank_id: bank.bank_id,
      version: bank.version,
      ...state,
    },
    null,
    2,
  );
}

export function buildMarkdownExport(
  state: AssessmentState,
  bank: ControlBank,
  overallScore: number,
  scoreBand: string,
  sectionScores: SectionScore[],
  topRisks: TopRisk[],
): string {
  const lines: string[] = [];
  const answeredCount = getAnsweredCount(bank.controls, state.responses);
  const summaryLine =
    answeredCount > 0 ? `**Overall Score:** ${overallScore.toFixed(1)} — ${scoreBand}` : "**Overall Score:** N/A";

  lines.push("# Identity Security Posture Assessment");
  lines.push("");
  lines.push(summaryLine);
  lines.push("");

  lines.push("## Section Scores");
  lines.push("");
  for (const s of sectionScores) {
    lines.push(`- **${s.label}:** ${formatSectionScore(s.score)} (${s.answered}/${s.total} answered)`);
  }
  lines.push("");

  if (topRisks.length > 0) {
    lines.push("## Top Risks");
    lines.push("");
    for (const risk of topRisks) {
      lines.push(`### ${risk.control.title}`);
      lines.push("");
      lines.push(`- **Status:** ${risk.status}`);
      lines.push(`- **Why it matters:** ${risk.control.rationale}`);
      lines.push(`- **Next step:** ${risk.control.next_step}`);
      lines.push("");
    }
  }

  lines.push("## All Controls");
  lines.push("");
  lines.push("| Control | Status | Notes |");
  lines.push("|---------|--------|-------|");

  for (const c of bank.controls) {
    const resp = state.responses[c.id];
    const status = resp?.status ?? "unanswered";
    const notes = resp?.notes ? escapeMarkdownCell(resp.notes) : "";
    lines.push(`| ${c.title} | ${status} | ${notes} |`);
  }

  return lines.join("\n");
}

export function exportJSON(
  state: AssessmentState,
  bank: ControlBank,
): void {
  downloadFile(
    "identity-posture-assessment.json",
    buildJSONExport(state, bank),
    "application/json",
  );
}

export function exportMarkdown(
  state: AssessmentState,
  bank: ControlBank,
  overallScore: number,
  scoreBand: string,
  sectionScores: SectionScore[],
  topRisks: TopRisk[],
): void {
  downloadFile(
    "identity-posture-assessment.md",
    buildMarkdownExport(
      state,
      bank,
      overallScore,
      scoreBand,
      sectionScores,
      topRisks,
    ),
    "text/markdown",
  );
}

export function buildCopySummary(
  overallScore: number,
  scoreBand: string,
  interpretation: string,
  sectionScores: SectionScore[],
  topRisks: TopRisk[],
): string {
  const lines: string[] = [];
  lines.push("Identity Security Posture Assessment");
  lines.push("");
  lines.push(`Score: ${Math.round(overallScore)} — ${scoreBand}`);
  lines.push("");
  lines.push(interpretation);
  lines.push("");
  lines.push("Section Scores");
  for (const s of sectionScores) {
    lines.push(`${s.label}: ${formatSectionScore(s.score)}`);
  }
  lines.push("");
  lines.push("Top Risks");
  for (const risk of topRisks.slice(0, 3)) {
    lines.push(`- ${risk.control.title}`);
  }
  return lines.join("\n");
}
