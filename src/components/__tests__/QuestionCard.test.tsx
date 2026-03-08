import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QuestionCard } from "../QuestionCard.tsx";
import type { Control, ControlResponse } from "../../lib/types.ts";

const control: Control = {
  id: "AUTH-01",
  section_id: "auth",
  title: "Test Control",
  tier: "foundational",
  weight: 5,
  order: 1,
  prompt: "Prompt",
  rationale: "Why",
  next_step: "Next",
};

function renderCard(response?: ControlResponse) {
  return renderToStaticMarkup(
    <QuestionCard
      control={control}
      response={response}
      onAnswer={() => {}}
      onNotesChange={() => {}}
    />,
  );
}

describe("QuestionCard", () => {
  it("shows saved notes on initial render when a response already has notes", () => {
    const html = renderCard({
      status: "gap",
      notes: "Existing evidence",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(html).toContain("Hide notes");
    expect(html).toContain("Optional notes");
    expect(html).toContain("Existing evidence");
  });

  it("keeps notes collapsed initially when there are no notes", () => {
    const html = renderCard({
      status: "gap",
      notes: "",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(html).toContain("Add notes");
    expect(html).not.toContain("Optional notes");
  });

  it("renders the rationale toggle button with '?' label", () => {
    const html = renderCard();
    expect(html).toContain("?");
  });

  it("shows note-only draft responses on initial render", () => {
    const html = renderCard({
      notes: "Draft evidence",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(html).toContain("Hide notes");
    expect(html).toContain("Draft evidence");
  });
});
