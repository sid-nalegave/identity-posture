import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Assessment } from "../Assessment.tsx";
import { AssessmentControls } from "../AssessmentControls.tsx";
import { SectionNav } from "../SectionNav.tsx";
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
    expect(planNavigation({ kind: "control", id: "AUTH-01" }, false, "results", true)).toEqual({
      mobileTab: "questions",
      showUnansweredOnly: false,
      pendingTarget: { kind: "control", id: "AUTH-01" },
    });
  });

  it("preserves the current mobile tab during desktop navigation while clearing the unanswered filter", () => {
    expect(planNavigation({ kind: "section", id: "auth" }, true, "results", true)).toEqual({
      mobileTab: "results",
      showUnansweredOnly: false,
      pendingTarget: { kind: "section", id: "auth" },
    });
  });

  it("keeps the questions tab selected after desktop navigation when mobile was last on questions", () => {
    expect(planNavigation({ kind: "control", id: "AUTH-01" }, true, "questions", false)).toEqual({
      mobileTab: "questions",
      showUnansweredOnly: false,
      pendingTarget: { kind: "control", id: "AUTH-01" },
    });
  });
});

function findElement(
  node: unknown,
  predicate: (candidate: { type: unknown; props: Record<string, unknown> }) => boolean,
): { type: unknown; props: Record<string, unknown> } | null {
  if (!node || typeof node !== "object") {
    return null;
  }

  const candidate = node as { type?: unknown; props?: Record<string, unknown> };
  if (candidate.type !== undefined && candidate.props && predicate(candidate as never)) {
    return candidate as never;
  }

  const children = candidate.props?.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      const match = findElement(child, predicate);
      if (match) {
        return match;
      }
    }
  } else if (children) {
    return findElement(children, predicate);
  }

  return null;
}

describe("SectionNav", () => {
  it("renders section progress and omits Scope block", () => {
    const html = renderToStaticMarkup(
      <SectionNav
        sectionScores={[{ section_id: "auth", label: "Authentication", answered: 1, total: 3 }]}
        showUnansweredOnly={false}
        onToggleFilter={() => {}}
        onSectionClick={() => {}}
        onReset={() => {}}
      />,
    );
    expect(html).toContain("Authentication");
    expect(html.toLowerCase()).not.toContain("scope");
  });
});

describe("AssessmentControls", () => {
  it("invokes the filter and reset handlers", () => {
    const onToggleFilter = vi.fn();
    const onReset = vi.fn();
    const tree = AssessmentControls({
      showUnansweredOnly: false,
      onToggleFilter,
      onReset,
    });

    const checkbox = findElement(
      tree,
      (candidate) => candidate.type === "input" && candidate.props.type === "checkbox",
    );
    const resetButton = findElement(
      tree,
      (candidate) =>
        candidate.type === "button" && candidate.props.children === "Reset Assessment",
    );

    expect(checkbox).not.toBeNull();
    expect(resetButton).not.toBeNull();

    (checkbox!.props.onChange as ((event: unknown) => void) | undefined)?.({} as never);
    (resetButton!.props.onClick as ((event: unknown) => void) | undefined)?.({} as never);

    expect(onToggleFilter).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

describe("Assessment", () => {
  it("renders mobile assessment controls on small screens", () => {
    Object.defineProperty(globalThis, "window", {
      value: {
        innerWidth: 375,
        location: { hash: "" },
        matchMedia: () => ({
          matches: false,
          addEventListener: () => {},
          removeEventListener: () => {},
        }),
      },
      writable: true,
    });

    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
      writable: true,
    });

    const html = renderToStaticMarkup(
      <Assessment isDark={false} onBack={() => {}} onToggleTheme={() => {}} />,
    );

    expect(html).toContain("Show unanswered only");
    expect(html).toContain("Reset Assessment");
  });

  it("renders the persistence note when the results panel is visible", () => {
    Object.defineProperty(globalThis, "window", {
      value: {
        innerWidth: 1280,
        location: { hash: "" },
        matchMedia: () => ({
          matches: true,
          addEventListener: () => {},
          removeEventListener: () => {},
        }),
      },
      writable: true,
    });

    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
      writable: true,
    });

    const html = renderToStaticMarkup(
      <Assessment isDark={false} onBack={() => {}} onToggleTheme={() => {}} />,
    );

    expect(html).toContain(
      "Generated locally. Responses and notes remain in this browser until cleared.",
    );
  });
});
