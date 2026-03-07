import type {
  AssessmentState,
  ControlResponse,
  PersistedAssessmentState,
} from "./types.ts";

const STORAGE_KEY = "identity_posture_assessment_v1";

export function loadAssessment(): AssessmentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const persisted = JSON.parse(raw) as PersistedAssessmentState;
    return hydrateAssessment(persisted);
  } catch {
    return null;
  }
}

export function saveAssessment(state: AssessmentState): void {
  const persisted = toPersistedAssessment(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore persistence failures and keep the in-memory assessment usable.
  }
}

export function createEmptyAssessment(): AssessmentState {
  const now = new Date().toISOString();
  return {
    assessment_meta: { created_at: now, updated_at: now },
    responses: {},
  };
}

export function updateResponse(
  state: AssessmentState,
  controlId: string,
  patch: Partial<ControlResponse>,
): AssessmentState {
  const existing = state.responses[controlId];
  const now = new Date().toISOString();
  const nextStatus = patch.status ?? existing?.status;
  const nextResponse: ControlResponse = {
    notes: patch.notes ?? existing?.notes ?? "",
    updated_at: now,
    ...(nextStatus ? { status: nextStatus } : {}),
  };

  return {
    ...state,
    assessment_meta: {
      ...state.assessment_meta,
      updated_at: now,
    },
    responses: {
      ...state.responses,
      [controlId]: nextResponse,
    },
  };
}

export function resetAssessment(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures and keep the in-memory reset behavior.
  }
}

function hydrateAssessment(state: PersistedAssessmentState): AssessmentState {
  return {
    assessment_meta: state.assessment_meta,
    responses: Object.fromEntries(
      Object.entries(state.responses).map(([controlId, response]) => [
        controlId,
        {
          notes: response.notes ?? "",
          updated_at: response.updated_at,
          ...(response.status ? { status: response.status } : {}),
        },
      ]),
    ),
  };
}

function toPersistedAssessment(state: AssessmentState): PersistedAssessmentState {
  const updatedAt = new Date().toISOString();

  return {
    assessment_meta: {
      created_at: state.assessment_meta.created_at,
      updated_at: state.assessment_meta.updated_at,
    },
    responses: Object.fromEntries(
      Object.entries(state.responses).map(([controlId, response]) => [
        controlId,
        {
          notes: response.notes,
          updated_at: response.updated_at || updatedAt,
          ...(response.status ? { status: response.status } : {}),
        },
      ]),
    ),
  };
}
