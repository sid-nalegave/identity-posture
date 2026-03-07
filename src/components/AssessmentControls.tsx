interface AssessmentControlsProps {
  showUnansweredOnly: boolean;
  onToggleFilter: () => void;
  onReset: () => void;
  className?: string;
}

export function AssessmentControls({
  showUnansweredOnly,
  onToggleFilter,
  onReset,
  className,
}: AssessmentControlsProps) {
  return (
    <div className={className}>
      <div className="border-t border-border pt-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={showUnansweredOnly}
            onChange={onToggleFilter}
            className="h-4 w-4 rounded-[4px] border-border bg-surface text-accent focus:ring-0"
          />
          Show unanswered only
        </label>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-[6px] border border-risk-border bg-risk-bg px-4 py-2 text-sm font-medium text-risk transition-colors hover:border-risk hover:text-risk"
      >
        Reset Assessment
      </button>
    </div>
  );
}
