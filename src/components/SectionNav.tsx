import type { SectionScore } from "../lib/types.ts";

interface SectionNavProps {
  sectionScores: SectionScore[];
  showUnansweredOnly: boolean;
  totalControls: number;
  onToggleFilter: () => void;
  onSectionClick: (sectionId: string) => void;
  onReset: () => void;
}

export function SectionNav({
  sectionScores,
  showUnansweredOnly,
  totalControls,
  onToggleFilter,
  onSectionClick,
  onReset,
}: SectionNavProps) {
  return (
    <nav className="space-y-5">
      <div>
        <span className="section-kicker">Sections</span>
        <div className="space-y-3">
          {sectionScores.map((section) => (
            <button
              key={section.section_id}
              type="button"
              onClick={() => onSectionClick(section.section_id)}
              className="block w-full rounded-[6px] border border-transparent px-2 py-2 text-left transition-colors hover:border-border hover:bg-page"
            >
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <span className="text-sm leading-snug text-text-secondary">{section.label}</span>
                <span className="font-mono text-[11px] font-semibold text-text-muted">
                  {section.answered}/{section.total}
                </span>
              </div>
              <div className="h-1 rounded-[6px] bg-border-subtle">
                <div
                  className="h-full rounded-[6px] bg-accent transition-[width] duration-300"
                  style={{
                    width: `${section.total > 0 ? (section.answered / section.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

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

      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint">
          Scope
        </p>
        <p className="font-mono text-[22px] font-bold text-text-primary">
          {totalControls}
          <span className="ml-2 text-xs font-normal text-text-muted">controls</span>
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-[6px] border border-risk-border bg-risk-bg px-4 py-2 text-sm font-medium text-risk transition-colors hover:border-risk hover:text-risk"
      >
        Reset Assessment
      </button>
    </nav>
  );
}
