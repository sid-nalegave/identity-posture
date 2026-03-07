import { useEffect, useState } from "react";
import { Assessment } from "./components/Assessment.tsx";
import { Landing } from "./components/Landing.tsx";
import { getInitialTheme, setTheme, type ThemeMode } from "./lib/theme.ts";

type Screen = "landing" | "assessment";

function getInitialScreen(): Screen {
  return window.location.hash === "#assessment" ? "assessment" : "landing";
}

function App() {
  const [screen, setScreen] = useState<Screen>(getInitialScreen);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const handler = () => setScreen(getInitialScreen());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    setTheme(themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  };

  const isDark = themeMode === "dark";

  const goToLanding = () => {
    window.location.hash = "";
    setScreen("landing");
  };

  const goToAssessment = () => {
    window.location.hash = "#assessment";
    setScreen("assessment");
  };

  return screen === "assessment" ? (
    <Assessment isDark={isDark} onBack={goToLanding} onToggleTheme={toggleTheme} />
  ) : (
    <Landing isDark={isDark} onStart={goToAssessment} onToggleTheme={toggleTheme} />
  );
}

export default App;
