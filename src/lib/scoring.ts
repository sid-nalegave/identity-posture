import type {
  AnswerStatus,
  AssessmentState,
  Control,
  Section,
  SectionScore,
  TopRisk,
} from "./types.ts";

const ANSWER_VALUES: Record<AnswerStatus, number | null> = {
  implemented: 1.0,
  partial: 0.5,
  gap: 0.0,
  na: null,
};

export function calcSectionScore(
  sectionId: string,
  controls: Control[],
  responses: AssessmentState["responses"],
): number | null {
  const sectionControls = controls.filter((c) => c.section_id === sectionId);
  let weightedSum = 0;
  let weightDenom = 0;

  for (const c of sectionControls) {
    const resp = responses[c.id];
    if (!resp?.status) continue;
    const val = ANSWER_VALUES[resp.status];
    if (val === null) continue;
    weightedSum += val * c.weight;
    weightDenom += c.weight;
  }

  if (weightDenom === 0) return null;
  return (weightedSum / weightDenom) * 100;
}

export function calcOverallScore(
  controls: Control[],
  responses: AssessmentState["responses"],
): number {
  let weightedSum = 0;
  let weightDenom = 0;

  for (const c of controls) {
    const resp = responses[c.id];
    if (!resp?.status) continue;
    const val = ANSWER_VALUES[resp.status];
    if (val === null) continue;
    weightedSum += val * c.weight;
    weightDenom += c.weight;
  }

  if (weightDenom === 0) return 0;
  return (weightedSum / weightDenom) * 100;
}

export function getScoreBand(score: number): string {
  if (score < 40) return "High Exposure";
  if (score < 60) return "Partial Coverage";
  if (score < 80) return "Baseline Controls";
  return "Strong Posture";
}

export function getSectionScores(
  sections: Section[],
  controls: Control[],
  responses: AssessmentState["responses"],
): SectionScore[] {
  return sections.map((s) => {
    const sectionControls = controls.filter(
      (c) => c.section_id === s.section_id,
    );
    const answered = sectionControls.filter(
      (c) => {
        const response = responses[c.id];
        return response?.status !== undefined && response.status !== "na";
      },
    ).length;
    return {
      section_id: s.section_id,
      label: s.label,
      score: calcSectionScore(s.section_id, controls, responses),
      answered,
      total: sectionControls.length,
    };
  });
}

export function getTopRisks(
  controls: Control[],
  responses: AssessmentState["responses"],
  limit = 5,
): TopRisk[] {
  const candidates: TopRisk[] = [];

  for (const c of controls) {
    const resp = responses[c.id];
    if (!resp?.status || resp.status === "implemented" || resp.status === "na")
      continue;
    candidates.push({ control: c, status: resp.status });
  }

  candidates.sort((a, b) => {
    // Gap > Partial
    if (a.status !== b.status) {
      return a.status === "gap" ? -1 : 1;
    }
    // Foundational > Advanced
    if (a.control.tier !== b.control.tier) {
      return a.control.tier === "foundational" ? -1 : 1;
    }
    // Higher weight first
    if (a.control.weight !== b.control.weight) {
      return b.control.weight - a.control.weight;
    }
    // Stable order
    return a.control.order - b.control.order;
  });

  return candidates.slice(0, limit);
}

export function getAnsweredCount(
  controls: Control[],
  responses: AssessmentState["responses"],
): number {
  return controls.filter((c) => {
    const resp = responses[c.id];
    return resp?.status !== undefined && resp.status !== "na";
  }).length;
}

export function getCompletedCount(
  controls: Control[],
  responses: AssessmentState["responses"],
): number {
  return controls.filter((c) => responses[c.id]?.status !== undefined).length;
}

export function getGapCount(
  controls: Control[],
  responses: AssessmentState["responses"],
): number {
  return controls.filter((c) => responses[c.id]?.status === "gap").length;
}

export function getPostureInterpretation(
  sectionScores: SectionScore[],
  answeredCount: number,
): string {
  if (answeredCount < 3) {
    return "Complete controls in at least two sections to generate a reliable posture summary.";
  }

  const scored = sectionScores
    .filter((s): s is SectionScore & { score: number } => s.score !== null)
    .sort((a, b) => a.score - b.score);

  if (scored.length < 2) {
    return "Complete controls in at least two sections to generate a reliable posture summary.";
  }

  const formatScore = (score: number) => `${Math.round(score)}%`;
  const lowest = scored[0];
  const focusSections: string[] = [`${lowest.label} (${formatScore(lowest.score)})`];

  if (scored.length > 1 && scored[1].score - lowest.score <= 7) {
    focusSections.push(`${scored[1].label} (${formatScore(scored[1].score)})`);
  }

  const focusText = focusSections.join(" and ");
  const verb = focusSections.length === 1 ? "represents" : "represent";
  const allSectionsPerfect =
    scored.length === sectionScores.length && scored.every((section) => section.score === 100);
  const hasUnscoredSections = scored.length !== sectionScores.length;

  if (allSectionsPerfect) {
    return "All scored identity areas are at 100%, indicating complete assessed coverage across the posture model.";
  }

  if (hasUnscoredSections) {
    return "Current scored sections show strong coverage, but one or more sections are still incomplete, so the posture summary is provisional.";
  }

  const consequences: Record<string, string> = {
    auth: "Unresolved authentication gaps are a leading entry point for credential-based account takeover.",
    priv: "Privilege gaps significantly increase the blast radius of any credential compromise.",
    life: "Dormant accounts and unreviewed access are a leading persistence vector in credential-based breaches.",
    mon: "Without detection coverage, identity-based attacks may go unnoticed for extended periods.",
  };

  const consequence = consequences[lowest.section_id] ?? "";

  return `${focusText} ${verb} your highest-probability attack path. ${consequence}`;
}
