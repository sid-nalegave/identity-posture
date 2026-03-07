interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="btn-secondary min-w-24 justify-center px-3 py-1.5 font-sans text-[11px] font-semibold tracking-[0.08em] uppercase"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
