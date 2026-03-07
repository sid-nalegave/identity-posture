import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { AnswerStatus, Control, ControlResponse } from "../lib/types.ts";

interface QuestionCardProps {
  control: Control;
  response: ControlResponse | undefined;
  onAnswer: (controlId: string, status: AnswerStatus) => void;
  onNotesChange: (controlId: string, notes: string) => void;
}

const STATUS_OPTIONS: Array<{
  value: AnswerStatus;
  label: string;
  key: string;
  icon: string;
  classes: string;
}> = [
  {
    value: "implemented",
    label: "Implemented",
    key: "1",
    icon: "✓",
    classes: "border-healthy-border bg-healthy-bg text-healthy",
  },
  {
    value: "partial",
    label: "Partial",
    key: "2",
    icon: "◐",
    classes: "border-warning-border bg-warning-bg text-warning",
  },
  {
    value: "gap",
    label: "Gap",
    key: "3",
    icon: "×",
    classes: "border-risk-border bg-risk-bg text-risk",
  },
  {
    value: "na",
    label: "N/A",
    key: "4",
    icon: "—",
    classes: "border-border bg-page text-text-muted",
  },
] as const;

const STATUS_CARD_CLASSES: Record<AnswerStatus, string> = {
  implemented: "border-l-healthy bg-healthy-bg",
  partial: "border-l-warning bg-warning-bg",
  gap: "border-l-risk bg-risk-bg",
  na: "border-l-border bg-surface",
};

export function QuestionCard({
  control,
  response,
  onAnswer,
  onNotesChange,
}: QuestionCardProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showNotes, setShowNotes] = useState(() => (response?.notes?.trim().length ?? 0) > 0);
  const [saved, setSaved] = useState(false);
  const savedRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const currentStatus = response?.status;
  const notes = response?.notes ?? "";

  useEffect(() => {
    return () => {
      if (savedRef.current) {
        window.clearTimeout(savedRef.current);
      }
    };
  }, []);

  const handleAnswer = useCallback(
    (status: AnswerStatus) => {
      onAnswer(control.id, status);
      setSaved(true);
      if (savedRef.current) {
        window.clearTimeout(savedRef.current);
      }
      savedRef.current = window.setTimeout(() => setSaved(false), 1500);
    },
    [control.id, onAnswer],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const option = STATUS_OPTIONS.find((item) => item.key === event.key);
      if (option) {
        event.preventDefault();
        handleAnswer(option.value);
      }
    },
    [handleAnswer],
  );

  const cardStateClass = currentStatus ? STATUS_CARD_CLASSES[currentStatus] : "border-l-border bg-surface";

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-control-id={control.id}
      className={`rounded-[6px] border border-border border-l-[3px] p-5 outline-none transition-colors ${cardStateClass}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">
              {control.id}
            </span>
            <span className="rounded-[6px] border border-accent-border bg-accent-subtle px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">
              {control.tier}
            </span>
          </div>
          <h3 className="text-sm font-semibold leading-snug text-text-primary">{control.title}</h3>
        </div>

        <button
          type="button"
          onClick={() => setShowHelp((value) => !value)}
          className={`rounded-[6px] border px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
            showHelp
              ? "border-accent bg-accent-subtle text-accent"
              : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
          }`}
          aria-expanded={showHelp}
          aria-label="Toggle rationale and examples"
        >
          Why
        </button>
      </div>

      <p className="mb-4 text-sm leading-loose text-text-body">{control.prompt}</p>

      {showHelp ? (
        <div className="mb-4 rounded-[6px] border border-accent-border bg-accent-subtle p-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            <span className="font-semibold text-accent">Why this matters: </span>
            {control.rationale}
          </p>
          {control.examples?.length ? (
            <div className="mt-3">
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                Examples
              </p>
              <div className="flex flex-wrap gap-2">
                {control.examples.map((example) => (
                  <span
                    key={example}
                    className="rounded-[6px] border border-border bg-surface px-2.5 py-1 text-[11px] text-text-secondary"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => {
          const isActive = currentStatus === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAnswer(option.value)}
              title={`Press ${option.key} to select`}
              className={`rounded-[6px] border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? `${option.classes} font-semibold`
                  : "border-btn-inactive-border bg-btn-inactive font-medium text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              <span className="mr-1.5 font-mono">{option.icon}</span>
              {option.label}
            </button>
          );
        })}
        {saved ? (
          <span
            className="flex items-center text-xs text-healthy"
            aria-live="polite"
          >
            Saved
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setShowNotes((value) => !value)}
        className="text-sm text-text-muted transition-colors hover:text-accent"
      >
        {showNotes ? "Hide notes" : "Add notes"}
      </button>

      {showNotes ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={notes}
            onChange={(event) => onNotesChange(control.id, event.target.value)}
            placeholder="Optional notes"
            className="min-h-[88px] w-full rounded-[6px] border border-accent-border bg-surface px-3 py-2 text-sm leading-relaxed text-text-body outline-none placeholder:text-text-faint"
          />
        </div>
      ) : null}
    </div>
  );
}
