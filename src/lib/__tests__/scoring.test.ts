import { describe, expect, it } from "vitest";
import {
  calcOverallScore,
  calcSectionScore,
  getAnsweredCount,
  getCompletedCount,
  getGapCount,
  getPostureInterpretation,
  getScoreBand,
  getSectionScores,
  getTopRisks,
} from "../scoring.ts";
import type { AssessmentState, Control, Section } from "../types.ts";

const makeControl = (
  overrides: Partial<Control> & Pick<Control, "id">,
): Control => ({
  section_id: "auth",
  title: "Test Control",
  tier: "foundational",
  weight: 5,
  order: 1,
  prompt: "Test?",
  rationale: "Test rationale",
  next_step: "Do something",
  ...overrides,
});

describe("calcSectionScore", () => {
  it("returns null when no controls are answered", () => {
    const controls = [makeControl({ id: "C1" })];
    expect(calcSectionScore("auth", controls, {})).toBeNull();
  });

  it("returns 100 for all implemented", () => {
    const controls = [makeControl({ id: "C1" }), makeControl({ id: "C2" })];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "implemented", notes: "", updated_at: "" },
    };
    expect(calcSectionScore("auth", controls, responses)).toBe(100);
  });

  it("returns 50 for all partial", () => {
    const controls = [makeControl({ id: "C1", weight: 4 })];
    const responses: AssessmentState["responses"] = {
      C1: { status: "partial", notes: "", updated_at: "" },
    };
    expect(calcSectionScore("auth", controls, responses)).toBe(50);
  });

  it("excludes N/A from denominator", () => {
    const controls = [
      makeControl({ id: "C1", weight: 5 }),
      makeControl({ id: "C2", weight: 5 }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "na", notes: "", updated_at: "" },
    };
    expect(calcSectionScore("auth", controls, responses)).toBe(100);
  });

  it("returns null when all controls are N/A", () => {
    const controls = [
      makeControl({ id: "C1", weight: 5 }),
      makeControl({ id: "C2", weight: 5 }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "na", notes: "", updated_at: "" },
      C2: { status: "na", notes: "", updated_at: "" },
    };
    expect(calcSectionScore("auth", controls, responses)).toBeNull();
  });

  it("respects weights", () => {
    const controls = [
      makeControl({ id: "C1", weight: 5 }),
      makeControl({ id: "C2", weight: 3 }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "gap", notes: "", updated_at: "" },
    };
    // (5*1 + 3*0) / (5+3) * 100 = 62.5
    expect(calcSectionScore("auth", controls, responses)).toBeCloseTo(62.5);
  });
});

describe("calcOverallScore", () => {
  it("calculates weighted average across all controls", () => {
    const controls = [
      makeControl({ id: "C1", section_id: "auth", weight: 5 }),
      makeControl({ id: "C2", section_id: "priv", weight: 5 }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "gap", notes: "", updated_at: "" },
    };
    expect(calcOverallScore(controls, responses)).toBe(50);
  });

  it("ignores note-only draft responses", () => {
    const controls = [makeControl({ id: "C1", section_id: "auth", weight: 5 })];
    const responses: AssessmentState["responses"] = {
      C1: { notes: "draft", updated_at: "" },
    };

    expect(calcOverallScore(controls, responses)).toBe(0);
  });
});

describe("getScoreBand", () => {
  it("returns correct bands", () => {
    expect(getScoreBand(10)).toBe("High Exposure");
    expect(getScoreBand(39)).toBe("High Exposure");
    expect(getScoreBand(40)).toBe("Partial Coverage");
    expect(getScoreBand(59)).toBe("Partial Coverage");
    expect(getScoreBand(60)).toBe("Baseline Controls");
    expect(getScoreBand(79)).toBe("Baseline Controls");
    expect(getScoreBand(80)).toBe("Strong Posture");
    expect(getScoreBand(100)).toBe("Strong Posture");
  });
});

describe("getTopRisks", () => {
  it("ranks gaps above partials", () => {
    const controls = [
      makeControl({ id: "C1", order: 1 }),
      makeControl({ id: "C2", order: 2 }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "partial", notes: "", updated_at: "" },
      C2: { status: "gap", notes: "", updated_at: "" },
    };
    const risks = getTopRisks(controls, responses);
    expect(risks[0].control.id).toBe("C2");
    expect(risks[1].control.id).toBe("C1");
  });

  it("ranks foundational above advanced within same status", () => {
    const controls = [
      makeControl({ id: "C1", tier: "advanced", order: 1 }),
      makeControl({ id: "C2", tier: "foundational", order: 2 }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "gap", notes: "", updated_at: "" },
      C2: { status: "gap", notes: "", updated_at: "" },
    };
    const risks = getTopRisks(controls, responses);
    expect(risks[0].control.id).toBe("C2");
  });

  it("excludes implemented and N/A", () => {
    const controls = [
      makeControl({ id: "C1" }),
      makeControl({ id: "C2" }),
      makeControl({ id: "C3" }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "na", notes: "", updated_at: "" },
      C3: { status: "gap", notes: "", updated_at: "" },
    };
    const risks = getTopRisks(controls, responses);
    expect(risks).toHaveLength(1);
    expect(risks[0].control.id).toBe("C3");
  });

  it("limits results", () => {
    const controls = Array.from({ length: 10 }, (_, i) =>
      makeControl({ id: `C${i}`, order: i }),
    );
    const responses: AssessmentState["responses"] = {};
    for (const c of controls) {
      responses[c.id] = {
        status: "gap",
        notes: "",
        updated_at: "",
      };
    }
    expect(getTopRisks(controls, responses, 3)).toHaveLength(3);
  });
});

describe("getAnsweredCount", () => {
  it("excludes N/A", () => {
    const controls = [
      makeControl({ id: "C1" }),
      makeControl({ id: "C2" }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "na", notes: "", updated_at: "" },
    };
    expect(getAnsweredCount(controls, responses)).toBe(1);
  });

  it("excludes note-only draft responses", () => {
    const controls = [makeControl({ id: "C1" })];
    const responses: AssessmentState["responses"] = {
      C1: { notes: "draft", updated_at: "" },
    };

    expect(getAnsweredCount(controls, responses)).toBe(0);
  });
});

describe("getCompletedCount", () => {
  it("counts answered and N/A responses as complete", () => {
    const controls = [
      makeControl({ id: "C1" }),
      makeControl({ id: "C2" }),
      makeControl({ id: "C3" }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
      C2: { status: "na", notes: "", updated_at: "" },
      C3: { notes: "draft", updated_at: "" },
    };

    expect(getCompletedCount(controls, responses)).toBe(2);
  });
});

describe("getGapCount", () => {
  it("counts only gaps", () => {
    const controls = [
      makeControl({ id: "C1" }),
      makeControl({ id: "C2" }),
      makeControl({ id: "C3" }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "gap", notes: "", updated_at: "" },
      C2: { status: "partial", notes: "", updated_at: "" },
      C3: { status: "gap", notes: "", updated_at: "" },
    };
    expect(getGapCount(controls, responses)).toBe(2);
  });

  it("excludes note-only draft responses", () => {
    const controls = [makeControl({ id: "C1" })];
    const responses: AssessmentState["responses"] = {
      C1: { notes: "draft", updated_at: "" },
    };

    expect(getGapCount(controls, responses)).toBe(0);
  });
});

describe("getSectionScores", () => {
  it("returns scores for each section", () => {
    const sections: Section[] = [
      { section_id: "auth", label: "Auth" },
      { section_id: "priv", label: "Priv" },
    ];
    const controls = [
      makeControl({ id: "C1", section_id: "auth" }),
      makeControl({ id: "C2", section_id: "priv" }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "implemented", notes: "", updated_at: "" },
    };
    const scores = getSectionScores(sections, controls, responses);
    expect(scores).toHaveLength(2);
    expect(scores[0].score).toBe(100);
    expect(scores[0].answered).toBe(1);
    expect(scores[1].score).toBeNull();
    expect(scores[1].answered).toBe(0);
  });

  it("excludes N/A from answered counts and returns null for all-N/A sections", () => {
    const sections: Section[] = [{ section_id: "auth", label: "Auth" }];
    const controls = [
      makeControl({ id: "C1", section_id: "auth" }),
      makeControl({ id: "C2", section_id: "auth" }),
    ];
    const responses: AssessmentState["responses"] = {
      C1: { status: "na", notes: "", updated_at: "" },
      C2: { status: "na", notes: "", updated_at: "" },
    };

    const [score] = getSectionScores(sections, controls, responses);
    expect(score.answered).toBe(0);
    expect(score.score).toBeNull();
  });

  it("treats note-only draft responses as unanswered", () => {
    const sections: Section[] = [{ section_id: "auth", label: "Auth" }];
    const controls = [makeControl({ id: "C1", section_id: "auth" })];
    const responses: AssessmentState["responses"] = {
      C1: { notes: "draft", updated_at: "" },
    };

    const [score] = getSectionScores(sections, controls, responses);
    expect(score.answered).toBe(0);
    expect(score.score).toBeNull();
  });
});

describe("getPostureInterpretation", () => {
  it("returns the new fallback message when fewer than 3 controls are answered", () => {
    const result = getPostureInterpretation([], 2);
    expect(result).toBe(
      "Complete controls in at least two sections to generate a reliable posture summary.",
    );
  });

  it("returns the new fallback message when fewer than 2 sections have scores", () => {
    const sections = [
      { section_id: "auth", label: "Authentication & MFA", score: 80, answered: 3, total: 5 },
      { section_id: "priv", label: "Privileged Access", score: null, answered: 0, total: 4 },
    ];
    const result = getPostureInterpretation(sections, 3);
    expect(result).toBe(
      "Complete controls in at least two sections to generate a reliable posture summary.",
    );
  });

  it("identifies single lowest section", () => {
    const sections = [
      { section_id: "auth", label: "Authentication & MFA", score: 80, answered: 3, total: 5 },
      { section_id: "priv", label: "Privileged Access", score: 41, answered: 2, total: 4 },
      { section_id: "life", label: "Identity Lifecycle", score: 60, answered: 3, total: 5 },
      { section_id: "mon", label: "Monitoring", score: 72, answered: 2, total: 4 },
    ];
    const result = getPostureInterpretation(sections, 10);
    expect(result).toContain("Privileged Access (41%) represents your highest-probability attack path.");
    expect(result).toContain(
      "Privilege gaps significantly increase the blast radius of any credential compromise.",
    );
    expect(result).not.toContain("Identity Lifecycle");
  });

  it("includes second section when within 7 points", () => {
    const sections = [
      { section_id: "auth", label: "Authentication & MFA", score: 80, answered: 3, total: 5 },
      { section_id: "priv", label: "Privileged Access", score: 41, answered: 2, total: 4 },
      { section_id: "life", label: "Identity Lifecycle", score: 46, answered: 3, total: 5 },
      { section_id: "mon", label: "Monitoring", score: 72, answered: 2, total: 4 },
    ];
    const result = getPostureInterpretation(sections, 10);
    expect(result).toContain(
      "Privileged Access (41%) and Identity Lifecycle (46%) represent your highest-probability attack path.",
    );
  });

  it("rounds section percentages in the interpretation label", () => {
    const sections = [
      {
        section_id: "priv",
        label: "Privileged Access",
        score: 59.09090909090909,
        answered: 3,
        total: 5,
      },
      {
        section_id: "life",
        label: "Identity Lifecycle",
        score: 63.4,
        answered: 3,
        total: 5,
      },
      { section_id: "mon", label: "Monitoring", score: 72, answered: 2, total: 4 },
    ];

    const result = getPostureInterpretation(sections, 10);
    expect(result).toContain("Privileged Access (59%) and Identity Lifecycle (63%)");
  });

  it("uses all-perfect coverage language when every scored section is 100%", () => {
    const sections = [
      { section_id: "auth", label: "Authentication & MFA", score: 100, answered: 5, total: 5 },
      { section_id: "priv", label: "Privileged Access", score: 100, answered: 4, total: 4 },
      { section_id: "life", label: "Identity Lifecycle", score: 100, answered: 5, total: 5 },
    ];

    const result = getPostureInterpretation(sections, 14);
    expect(result).toBe(
      "All scored identity areas are at 100%, indicating complete assessed coverage across the posture model.",
    );
  });

  it("ignores sections with null scores when selecting focus sections", () => {
    const sections = [
      { section_id: "auth", label: "Authentication & MFA", score: null, answered: 0, total: 5 },
      { section_id: "priv", label: "Privileged Access", score: 41, answered: 2, total: 4 },
      { section_id: "life", label: "Identity Lifecycle", score: 46, answered: 3, total: 5 },
      { section_id: "mon", label: "Monitoring", score: 72, answered: 2, total: 4 },
    ];
    const result = getPostureInterpretation(sections, 10);
    expect(result).toContain(
      "Privileged Access (41%) and Identity Lifecycle (46%) represent your highest-probability attack path.",
    );
    expect(result).not.toContain("Authentication & MFA");
  });
});
