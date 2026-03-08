import { useEffect, useRef, useState } from "react";
import {
  calcOverallScore,
  getAnsweredCount,
  getCompletedCount,
  getGapCount,
  getPostureInterpretation,
  getScoreBand,
  getSectionScores,
  getTopRisks,
} from "../lib/scoring.ts";
import {
  createEmptyAssessment,
  loadAssessment,
  resetAssessment,
  saveAssessment,
  updateResponse,
} from "../lib/storage.ts";
import type { AnswerStatus, AssessmentState, ControlBank } from "../lib/types.ts";
import controlData from "../identity-controls-v2.1.json";
import { AssessmentControls } from "./AssessmentControls.tsx";
import { QuestionCard } from "./QuestionCard.tsx";
import { ResultsPanel } from "./ResultsPanel.tsx";
import { SectionNav } from "./SectionNav.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import {
  getVisibleControls,
  planNavigation,
  type MobileTab,
  type NavigationTarget,
} from "./assessmentNavigation.ts";

const bank = controlData as ControlBank;
const NAV_H = 56;

interface AssessmentProps {
  isDark: boolean;
  onBack: () => void;
  onToggleTheme: () => void;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}

export function Assessment({ isDark, onBack, onToggleTheme }: AssessmentProps) {
  const isDesktop = useIsDesktop();
  const [state, setState] = useState<AssessmentState>(() => loadAssessment() ?? createEmptyAssessment());
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("questions");
  const [navigationRequest, setNavigationRequest] = useState(0);
  const pendingTargetRef = useRef<NavigationTarget | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    saveAssessment(state);
  }, [state]);

  const handleAnswer = (controlId: string, status: AnswerStatus | undefined) => {
    setState((previous) => updateResponse(previous, controlId, { status }));
  };

  const handleNotesChange = (controlId: string, notes: string) => {
    setState((previous) => updateResponse(previous, controlId, { notes }));
  };

  const handleReset = () => {
    if (window.confirm("Reset all assessment data? This cannot be undone.")) {
      resetAssessment();
      setState(createEmptyAssessment());
    }
  };

  useEffect(() => {
    const pendingTarget = pendingTargetRef.current;

    if (!pendingTarget) {
      return;
    }

    if (!isDesktop && mobileTab !== "questions") {
      return;
    }

    const element =
      pendingTarget.kind === "section"
        ? sectionRefs.current[pendingTarget.id]
        : (document.querySelector(`[data-control-id="${pendingTarget.id}"]`) as HTMLElement | null);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: pendingTarget.kind === "section" ? "start" : "center",
    });
    pendingTargetRef.current = null;
  }, [isDesktop, mobileTab, navigationRequest, showUnansweredOnly, state.responses]);

  const scrollToSection = (sectionId: string) => {
    const navigationPlan = planNavigation(
      { kind: "section", id: sectionId },
      isDesktop,
      mobileTab,
      showUnansweredOnly,
    );
    setShowUnansweredOnly(navigationPlan.showUnansweredOnly);
    setMobileTab(navigationPlan.mobileTab);
    pendingTargetRef.current = navigationPlan.pendingTarget;
    setNavigationRequest((value) => value + 1);
  };

  const scrollToControl = (controlId: string) => {
    const navigationPlan = planNavigation(
      { kind: "control", id: controlId },
      isDesktop,
      mobileTab,
      showUnansweredOnly,
    );
    setShowUnansweredOnly(navigationPlan.showUnansweredOnly);
    setMobileTab(navigationPlan.mobileTab);
    pendingTargetRef.current = navigationPlan.pendingTarget;
    setNavigationRequest((value) => value + 1);
  };

  const { controls, sections } = bank;
  const totalControls = controls.length;
  const overallScore = calcOverallScore(controls, state.responses);
  const scoreBand = getScoreBand(overallScore);
  const sectionScores = getSectionScores(sections, controls, state.responses);
  const topRisks = getTopRisks(controls, state.responses);
  const answeredCount = getAnsweredCount(controls, state.responses);
  const completedCount = getCompletedCount(controls, state.responses);
  const totalAnswered = answeredCount;
  const gapCount = getGapCount(controls, state.responses);
  const interpretation = getPostureInterpretation(sectionScores, answeredCount);

  const visibleControls = getVisibleControls(controls, state.responses, showUnansweredOnly);

  const showQuestions = isDesktop || mobileTab === "questions";
  const showResults = isDesktop || mobileTab === "results";

  return (
    <div className="min-h-screen bg-page text-text-primary">
      <header className="sticky top-0 z-50 border-b border-border bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center justify-between gap-4 px-4 md:px-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-text-muted transition-colors hover:text-accent"
            >
              Back
            </button>
            {isDesktop ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">
                Identity Posture
              </span>
            ) : (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
                  Posture score
                </p>
                <p className="font-mono text-sm font-bold text-text-primary">
                  {totalAnswered > 0 ? Math.round(overallScore) : "—"}{" "}
                  <span className="font-sans text-xs font-medium text-text-muted">
                    {totalAnswered > 0 ? scoreBand : "Awaiting answers"}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isDesktop && gapCount > 0 ? (
              <span className="font-mono text-xs text-risk">{gapCount} gaps</span>
            ) : null}

            {isDesktop ? (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-text-muted">
                  {totalAnswered}/{totalControls}
                </span>
                <div className="h-1 w-20 rounded-[6px] bg-border-subtle">
                  <div
                    className="h-full rounded-[6px] bg-accent transition-[width] duration-300"
                    style={{ width: `${(totalAnswered / totalControls) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}

            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      {!isDesktop ? (
        <div className="border-b border-border bg-surface px-4 py-2">
          <div className="flex gap-2">
            {(["questions", "results"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMobileTab(tab)}
                className={`flex-1 rounded-[6px] border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  mobileTab === tab
                    ? "border-btn-border bg-btn-bg text-btn-text"
                    : "border-btn-inactive-border bg-btn-inactive text-text-secondary hover:border-accent hover:text-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <AssessmentControls
            showUnansweredOnly={showUnansweredOnly}
            onToggleFilter={() => setShowUnansweredOnly((value) => !value)}
            onReset={handleReset}
            className="mt-4 space-y-4"
          />
        </div>
      ) : null}

      <div
        className="mx-auto w-full max-w-[1360px] flex-1 lg:grid"
        style={{ gridTemplateColumns: isDesktop ? "260px minmax(0,1fr) 320px" : undefined }}
      >
        {isDesktop ? (
          <aside
            className="py-5"
            style={{ position: "sticky", top: NAV_H, height: `calc(100vh - ${NAV_H}px)`, overflowY: "auto" }}
          >
            <SectionNav
              sectionScores={sectionScores}
              showUnansweredOnly={showUnansweredOnly}
              onToggleFilter={() => setShowUnansweredOnly((value) => !value)}
              onSectionClick={scrollToSection}
              onReset={handleReset}
            />
          </aside>
        ) : null}

        {showQuestions ? (
          <main
            className="px-4 py-6 md:px-6"
            style={{
              overflowY: isDesktop ? "auto" : undefined,
              maxHeight: isDesktop ? `calc(100vh - ${NAV_H}px)` : undefined,
            }}
          >
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint">
              Workforce IAM · {totalControls} controls · 4 domains
            </p>

            <div className="space-y-8">
              {sections.map((section) => {
                const sectionControls = visibleControls.filter(
                  (control) => control.section_id === section.section_id,
                );
                if (sectionControls.length === 0) {
                  return null;
                }

                const sectionScore = sectionScores.find((item) => item.section_id === section.section_id);

                const sectionIndex = sections.indexOf(section);

                return (
                  <section
                    key={section.section_id}
                    ref={(element) => {
                      sectionRefs.current[section.section_id] = element;
                    }}
                  >
                    <div className="mb-4 border-b border-border pb-3">
                      <p className="mb-0.5 font-mono text-[10px] text-text-faint">
                        {String(sectionIndex + 1).padStart(2, "0")}
                      </p>
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-text-primary">
                          {section.label}
                        </h3>
                        <span className="font-mono text-[11px] text-text-faint">
                          {sectionScore?.answered ?? 0} / {sectionScore?.total ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sectionControls.map((control) => (
                        <QuestionCard
                          key={control.id}
                          control={control}
                          response={state.responses[control.id]}
                          onAnswer={handleAnswer}
                          onNotesChange={handleNotesChange}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>
        ) : null}

        {showResults ? (
          <aside
            className={`${isDesktop ? "border-l border-border bg-surface" : "bg-page"} px-4 py-6`}
            style={{
              position: isDesktop ? "sticky" : undefined,
              top: isDesktop ? NAV_H : undefined,
              height: isDesktop ? `calc(100vh - ${NAV_H}px)` : undefined,
              overflowY: isDesktop ? "auto" : undefined,
            }}
          >
            <ResultsPanel
              overallScore={overallScore}
              scoreBand={scoreBand}
              interpretation={interpretation}
              sectionScores={sectionScores}
              topRisks={topRisks}
              state={state}
              bank={bank}
              totalAnswered={totalAnswered}
              isAssessmentComplete={completedCount === totalControls}
              totalControls={totalControls}
              gapCount={gapCount}
              onSectionClick={scrollToSection}
              onControlClick={scrollToControl}
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
