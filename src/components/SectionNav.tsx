import type { SectionScore } from "../lib/types.ts";

interface SectionNavProps {
  sectionScores: SectionScore[];
  showUnansweredOnly: boolean;
  onToggleFilter: () => void;
  onSectionClick: (sectionId: string) => void;
  onReset: () => void;
}

export function SectionNav({
  sectionScores,
  showUnansweredOnly,
  onToggleFilter,
  onSectionClick,
  onReset,
}: SectionNavProps) {
  return (
    <nav>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="px-5 pt-5 pb-3">
          <span className="section-kicker">Sections</span>
          <h2 className="mt-2 mb-5 text-sm font-semibold text-text-primary">
            Assessment progress
          </h2>
          <div>
            {sectionScores.map((section, index) => (
              <button
                key={section.section_id}
                type="button"
                onClick={() => onSectionClick(section.section_id)}
                className="block w-full text-left"
              >
                {index > 0 && <div className="my-4 h-px bg-border-subtle" />}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-text-secondary">{section.label}</span>
                  <span className="shrink-0 font-mono text-[11px] text-text-muted">
                    {section.answered}/{section.total}
                    {section.gapCount > 0 ? (
                      <span className="ml-1.5 text-risk">● {section.gapCount}</span>
                    ) : null}
                    {section.partialCount > 0 ? (
                      <span className="ml-1 text-warning">◐ {section.partialCount}</span>
                    ) : null}
                  </span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-300"
                    style={{
                      width: `${section.total > 0 ? (section.answered / section.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-5 py-4">
          <label className="flex cursor-pointer items-center gap-3 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={showUnansweredOnly}
              onChange={onToggleFilter}
              className="h-4 w-4 rounded-[4px] border-border bg-surface text-accent focus:ring-0"
            />
            Show unanswered only
          </label>
        </div>

        <div className="border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-[6px] border border-risk-border bg-risk-bg px-4 py-2 text-xs font-medium text-risk transition-colors hover:border-risk hover:text-risk"
          >
            Reset Assessment
          </button>
        </div>
      </div>
    </nav>
  );
}
