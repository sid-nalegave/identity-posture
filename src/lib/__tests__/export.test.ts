import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCopySummary, buildMarkdownExport, exportMarkdown } from "../export.ts";
import { updateResponse } from "../storage.ts";
import type { AssessmentState, ControlBank, SectionScore, TopRisk } from "../types.ts";
import { buildJSONExport } from "../export.ts";

const bank: ControlBank = {
  bank_id: "bank-1",
  version: "1.0.0",
  last_updated: "2026-01-01",
  scope: "Workforce IAM",
  control_count: 1,
  sections: [{ section_id: "auth", label: "Authentication & MFA" }],
  controls: [
    {
      id: "C1",
      section_id: "auth",
      title: "Least Privilege",
      tier: "foundational",
      weight: 5,
      order: 1,
      prompt: "",
      rationale: "",
      next_step: "",
    },
  ],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("buildCopySummary", () => {
  it("builds formatted summary text", () => {
    const sectionScores: SectionScore[] = [
      { section_id: "auth", label: "Authentication & MFA", score: 70, answered: 3, total: 5 },
      { section_id: "priv", label: "Privileged Access", score: null, answered: 0, total: 4 },
    ];
    const topRisks: TopRisk[] = [
      {
        control: {
          id: "C1",
          section_id: "priv",
          title: "Least Privilege",
          tier: "foundational",
          weight: 5,
          order: 1,
          prompt: "",
          rationale: "",
          next_step: "",
        },
        status: "gap",
      },
    ];

    const result = buildCopySummary(
      55,
      "Partial Coverage",
      "Privileged Access (41%) represents your highest-probability attack path.",
      sectionScores,
      topRisks,
    );

    expect(result).toContain("Score: 55");
    expect(result).toContain("Partial Coverage");
    expect(result).toContain("Privileged Access (41%) represents");
    expect(result).toContain("Authentication & MFA: 70%");
    expect(result).toContain("Privileged Access: N/A");
    expect(result).toContain("- No Least Privilege");
  });

  it("prefixes gap risks with 'No' and partial risks with 'Partial:'", () => {
    const makeRisk = (title: string, status: "gap" | "partial"): TopRisk => ({
      control: { id: title, section_id: "auth", title, tier: "foundational", weight: 5, order: 1, prompt: "", rationale: "", next_step: "" },
      status,
    });

    const result = buildCopySummary(50, "Partial Coverage", "", [], [
      makeRisk("Phishing-Resistant MFA", "gap"),
      makeRisk("Step-Up Authentication", "partial"),
    ]);

    expect(result).toContain("- No Phishing-Resistant MFA");
    expect(result).toContain("- Partial: Step-Up Authentication");
  });

  it("limits top risks to 3", () => {
    const sectionScores: SectionScore[] = [];
    const topRisks: TopRisk[] = Array.from({ length: 5 }, (_, i) => ({
      control: {
        id: `C${i}`,
        section_id: "auth",
        title: `Risk ${i}`,
        tier: "foundational" as const,
        weight: 5,
        order: i,
        prompt: "",
        rationale: "",
        next_step: "",
      },
      status: "gap" as const,
    }));

    const result = buildCopySummary(30, "High Exposure", "test", sectionScores, topRisks);
    const riskLines = result.split("\n").filter((l) => l.startsWith("- No Risk"));
    expect(riskLines).toHaveLength(3);
  });

  it("builds markdown export without links, escapes notes, and preserves N/A sections", () => {
    const state: AssessmentState = {
      assessment_meta: { created_at: "2026-01-01", updated_at: "2026-01-01" },
      responses: {
        C1: {
          status: "implemented",
          notes: "Line 1\nLine 2 | pipe",
          updated_at: "2026-01-01",
        },
      },
    };
    const result = buildMarkdownExport(
      state,
      bank,
      55,
      "Partial Coverage",
      [{ section_id: "auth", label: "Authentication & MFA", score: null, answered: 0, total: 1 }],
      [],
    );

    expect(result).toContain("| Control | Status | Notes |");
    expect(result).not.toContain("Links");
    expect(result).toContain("Line 1<br />Line 2 \\| pipe");
    expect(result).toContain("- **Authentication & MFA:** N/A (0/1 answered)");
  });

  it("renders blank assessments as unscored in markdown export", () => {
    const state: AssessmentState = {
      assessment_meta: { created_at: "2026-01-01", updated_at: "2026-01-01" },
      responses: {
        C1: {
          notes: "draft only",
          updated_at: "2026-01-01",
        },
      },
    };

    const result = buildMarkdownExport(
      state,
      bank,
      0,
      "High Exposure",
      [{ section_id: "auth", label: "Authentication & MFA", score: null, answered: 0, total: 1 }],
      [],
    );

    expect(result).toContain("**Overall Score:** N/A");
    expect(result).not.toContain("**Overall Score:** 0.0 — High Exposure");
  });

  it("exports the latest assessment metadata timestamp from in-memory state", () => {
    const state: AssessmentState = {
      assessment_meta: {
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      responses: {},
    };
    const updated = updateResponse(state, "C1", { status: "gap" });
    const exported = JSON.parse(buildJSONExport(updated, bank)) as AssessmentState & {
      bank_id: string;
      version: string;
    };

    expect(exported.assessment_meta.created_at).toBe("2026-01-01T00:00:00.000Z");
    expect(exported.assessment_meta.updated_at).toBe(updated.assessment_meta.updated_at);
    expect(exported.assessment_meta.updated_at).not.toBe("2026-01-01T00:00:00.000Z");
  });

  it("defers blob URL revocation until after the download click", () => {
    vi.useFakeTimers();

    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:identity-posture");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const click = vi.fn();
    const createElement = vi.fn().mockReturnValue({
      click,
    });

    Object.defineProperty(globalThis, "document", {
      value: {
        createElement,
      },
      writable: true,
    });

    exportMarkdown(
      {
        assessment_meta: { created_at: "2026-01-01", updated_at: "2026-01-01" },
        responses: {},
      },
      bank,
      0,
      "High Exposure",
      [],
      [],
    );

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:identity-posture");
    vi.useRealTimers();
  });
});
