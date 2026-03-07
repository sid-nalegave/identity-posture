import { describe, expect, it } from "vitest";
import { getVisibleControls, planNavigation } from "../assessmentNavigation.ts";
import type { AssessmentState, Control } from "../../lib/types.ts";

const controls: Control[] = [
  {
    id: "AUTH-01",
    section_id: "auth",
    title: "Control 1",
    tier: "foundational",
    weight: 5,
    order: 1,
    prompt: "Prompt 1",
    rationale: "Rationale 1",
    next_step: "Next 1",
  },
  {
    id: "AUTH-02",
    section_id: "auth",
    title: "Control 2",
    tier: "advanced",
    weight: 3,
    order: 2,
    prompt: "Prompt 2",
    rationale: "Rationale 2",
    next_step: "Next 2",
  },
];

describe("getVisibleControls", () => {
  it("shows only controls without saved responses when unanswered filter is enabled", () => {
    const responses: AssessmentState["responses"] = {
      "AUTH-01": {
        status: "gap",
        notes: "",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    };

    expect(getVisibleControls(controls, responses, true).map((control) => control.id)).toEqual([
      "AUTH-02",
    ]);
  });

  it("keeps note-only draft controls visible when unanswered filter is enabled", () => {
    const responses: AssessmentState["responses"] = {
      "AUTH-01": {
        notes: "draft note",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    };

    expect(getVisibleControls(controls, responses, true).map((control) => control.id)).toEqual([
      "AUTH-01",
      "AUTH-02",
    ]);
  });
});

describe("planNavigation", () => {
  it("switches mobile results navigation back to questions and clears the unanswered filter", () => {
    expect(planNavigation({ kind: "control", id: "AUTH-01" }, false, true)).toEqual({
      mobileTab: "questions",
      showUnansweredOnly: false,
      pendingTarget: { kind: "control", id: "AUTH-01" },
    });
  });

  it("keeps desktop navigation renderable while still clearing the unanswered filter", () => {
    expect(planNavigation({ kind: "section", id: "auth" }, true, true)).toEqual({
      mobileTab: "results",
      showUnansweredOnly: false,
      pendingTarget: { kind: "section", id: "auth" },
    });
  });
});
