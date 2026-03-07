import { afterEach, describe, expect, it } from "vitest";
import {
  createEmptyAssessment,
  loadAssessment,
  resetAssessment,
  saveAssessment,
  updateResponse,
} from "../storage.ts";

// Simple localStorage mock for Node environment
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
};
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

afterEach(() => {
  for (const key of Object.keys(store)) {
    delete store[key];
  }
});

describe("createEmptyAssessment", () => {
  it("creates state with timestamps and empty responses", () => {
    const state = createEmptyAssessment();
    expect(state.assessment_meta.created_at).toBeTruthy();
    expect(state.assessment_meta.updated_at).toBeTruthy();
    expect(Object.keys(state.responses)).toHaveLength(0);
  });
});

describe("saveAssessment / loadAssessment", () => {
  it("round-trips persisted answers with notes", () => {
    const state = createEmptyAssessment();
    state.responses["C1"] = {
      status: "implemented",
      notes: "test",
      updated_at: "",
    };
    saveAssessment(state);
    const loaded = loadAssessment();
    expect(loaded).not.toBeNull();
    expect(loaded!.responses["C1"].status).toBe("implemented");
    expect(loaded!.responses["C1"].notes).toBe("test");
  });

  it("round-trips note-only draft responses without coercing a gap status", () => {
    const state = createEmptyAssessment();
    state.responses["C1"] = {
      notes: "draft only",
      updated_at: "",
    };

    saveAssessment(state);

    const loaded = loadAssessment();
    expect(loaded).not.toBeNull();
    expect(loaded!.responses["C1"].status).toBeUndefined();
    expect(loaded!.responses["C1"].notes).toBe("draft only");
  });

  it("hydrates legacy persisted answers without notes", () => {
    localStorage.setItem(
      "identity_posture_assessment_v1",
      JSON.stringify({
        assessment_meta: { created_at: "2026-01-01", updated_at: "2026-01-01" },
        responses: {
          C1: {
            status: "implemented",
            updated_at: "2026-01-01",
          },
        },
      }),
    );

    const loaded = loadAssessment();
    expect(loaded).not.toBeNull();
    expect(loaded!.responses["C1"].status).toBe("implemented");
    expect(loaded!.responses["C1"].notes).toBe("");
  });

  it("swallows storage write failures", () => {
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error("storage unavailable");
    };

    expect(() => saveAssessment(createEmptyAssessment())).not.toThrow();

    localStorageMock.setItem = originalSetItem;
  });
});

describe("resetAssessment", () => {
  it("clears stored data", () => {
    saveAssessment(createEmptyAssessment());
    expect(loadAssessment()).not.toBeNull();
    resetAssessment();
    expect(loadAssessment()).toBeNull();
  });

  it("swallows storage remove failures", () => {
    const originalRemoveItem = localStorageMock.removeItem;
    localStorageMock.removeItem = () => {
      throw new Error("storage unavailable");
    };

    expect(() => resetAssessment()).not.toThrow();

    localStorageMock.removeItem = originalRemoveItem;
  });
});

describe("updateResponse", () => {
  it("adds a new response", () => {
    const state = createEmptyAssessment();
    const updated = updateResponse(state, "C1", { status: "gap" });
    expect(updated.responses["C1"].status).toBe("gap");
    expect(updated.responses["C1"].notes).toBe("");
  });

  it("patches existing response", () => {
    let state = createEmptyAssessment();
    state = updateResponse(state, "C1", {
      status: "gap",
      notes: "initial",
    });
    state = updateResponse(state, "C1", { notes: "updated" });
    expect(state.responses["C1"].notes).toBe("updated");
    expect(state.responses["C1"].status).toBe("gap");
  });

  it("keeps a new note-only response unanswered", () => {
    const state = createEmptyAssessment();
    const updated = updateResponse(state, "C1", { notes: "draft note" });

    expect(updated.responses["C1"].status).toBeUndefined();
    expect(updated.responses["C1"].notes).toBe("draft note");
  });

  it("updates assessment metadata timestamp while preserving created_at", () => {
    const state = {
      assessment_meta: {
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      responses: {},
    };

    const updated = updateResponse(state, "C1", { status: "implemented" });

    expect(updated.assessment_meta.created_at).toBe("2026-01-01T00:00:00.000Z");
    expect(updated.assessment_meta.updated_at).not.toBe("2026-01-01T00:00:00.000Z");
  });
});
