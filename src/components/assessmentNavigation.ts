import type { AssessmentState, Control } from "../lib/types.ts";

export type MobileTab = "questions" | "results";
export type NavigationTarget =
  | { kind: "section"; id: string }
  | { kind: "control"; id: string };

export interface NavigationPlan {
  mobileTab: MobileTab;
  showUnansweredOnly: boolean;
  pendingTarget: NavigationTarget;
}

export function getVisibleControls(
  controls: Control[],
  responses: AssessmentState["responses"],
  showUnansweredOnly: boolean,
) {
  if (!showUnansweredOnly) {
    return controls;
  }

  return controls.filter((control) => responses[control.id]?.status === undefined);
}

export function planNavigation(
  target: NavigationTarget,
  isDesktop: boolean,
  mobileTab: MobileTab,
  showUnansweredOnly: boolean,
): NavigationPlan {
  return {
    mobileTab: isDesktop ? mobileTab : "questions",
    showUnansweredOnly: showUnansweredOnly ? false : showUnansweredOnly,
    pendingTarget: target,
  };
}
