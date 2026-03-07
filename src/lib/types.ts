export interface Control {
  id: string;
  section_id: string;
  title: string;
  tier: "foundational" | "advanced";
  weight: number;
  order: number;
  prompt: string;
  rationale: string;
  examples?: string[];
  next_step: string;
}

export interface Section {
  section_id: string;
  label: string;
}

export interface ControlBank {
  bank_id: string;
  version: string;
  last_updated: string;
  scope: string;
  control_count: number;
  sections: Section[];
  controls: Control[];
}

export type AnswerStatus = "implemented" | "partial" | "gap" | "na";

export interface ControlResponse {
  status?: AnswerStatus;
  notes: string;
  updated_at: string;
}

export interface AssessmentMeta {
  created_at: string;
  updated_at: string;
}

export interface AssessmentState {
  assessment_meta: AssessmentMeta;
  responses: Record<string, ControlResponse>;
}

export interface PersistedControlResponse {
  status?: AnswerStatus;
  notes: string;
  updated_at: string;
}

export interface PersistedAssessmentState {
  assessment_meta: AssessmentMeta;
  responses: Record<string, PersistedControlResponse>;
}

export interface SectionScore {
  section_id: string;
  label: string;
  score: number | null;
  answered: number;
  total: number;
}

export interface TopRisk {
  control: Control;
  status: AnswerStatus;
}
