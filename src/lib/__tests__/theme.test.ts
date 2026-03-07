import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getInitialTheme,
  initializeTheme,
  persistTheme,
  readStoredTheme,
} from "../theme.ts";

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
};

const classSet = new Set<string>();
const classListMock = {
  toggle: (token: string, force?: boolean) => {
    if (force === undefined) {
      if (classSet.has(token)) {
        classSet.delete(token);
        return false;
      }
      classSet.add(token);
      return true;
    }

    if (force) {
      classSet.add(token);
      return true;
    }

    classSet.delete(token);
    return false;
  },
  contains: (token: string) => classSet.has(token),
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(globalThis, "document", {
  value: {
    documentElement: {
      classList: classListMock,
    },
  },
  writable: true,
});

beforeEach(() => {
  classSet.clear();
});

afterEach(() => {
  for (const key of Object.keys(store)) {
    delete store[key];
  }
  classSet.clear();
});

describe("theme persistence", () => {
  it("reads a valid stored theme", () => {
    store[THEME_STORAGE_KEY] = "dark";
    expect(readStoredTheme()).toBe("dark");
  });

  it("defaults to light when storage is empty", () => {
    expect(getInitialTheme()).toBe("light");
  });

  it("applies the dark class to the document root", () => {
    applyTheme("dark");
    expect(globalThis.document.documentElement.classList.contains("dark")).toBe(true);
    applyTheme("light");
    expect(globalThis.document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists theme mode", () => {
    persistTheme("dark");
    expect(store[THEME_STORAGE_KEY]).toBe("dark");
  });

  it("initializes from storage and applies the class", () => {
    store[THEME_STORAGE_KEY] = "dark";
    expect(initializeTheme()).toBe("dark");
    expect(globalThis.document.documentElement.classList.contains("dark")).toBe(true);
  });
});
