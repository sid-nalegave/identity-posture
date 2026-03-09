export type ThemeMode = "light" | "dark";
export type ScoreBandTone = "risk" | "warning" | "caution" | "healthy";

export const THEME_STORAGE_KEY = "identity_posture_theme";

export const SCORE_BANDS = [
  {
    max: 39,
    label: "High Exposure",
    desc: "Critical identity security gaps are present. Scores below 40 indicate high likelihood of credential-based compromise.",
    tone: "risk",
  },
  {
    max: 59,
    label: "Partial Coverage",
    desc: "Significant identity security gaps remain. Scores below 60 indicate meaningful credential-based exposure.",
    tone: "warning",
  },
  {
    max: 79,
    label: "Baseline Controls",
    desc: "Foundational control gaps should be closed next. Scores below 80 leave advanced attack paths open.",
    tone: "caution",
  },
  {
    max: 100,
    label: "Strong Posture",
    desc: "Core identity risks are broadly controlled. Continue monitoring and hardening advanced controls.",
    tone: "healthy",
  },
] as const;

export function getScoreBandInfo(score: number) {
  return SCORE_BANDS.find((band) => score <= band.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function readStoredTheme(): ThemeMode | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  try {
    const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export function getInitialTheme(): ThemeMode {
  return readStoredTheme() ?? "light";
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof globalThis.document === "undefined") {
    return;
  }

  globalThis.document.documentElement.classList.toggle("dark", mode === "dark");
}

export function persistTheme(mode: ThemeMode): void {
  if (typeof globalThis.localStorage === "undefined") {
    return;
  }

  try {
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore persistence failures and keep the in-memory selection.
  }
}

export function initializeTheme(): ThemeMode {
  const mode = getInitialTheme();
  applyTheme(mode);
  return mode;
}

export function setTheme(mode: ThemeMode): void {
  applyTheme(mode);
  persistTheme(mode);
}
