import { afterEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "../clipboard.ts";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("copyToClipboard", () => {
  it("uses navigator.clipboard when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(globalThis, "navigator", {
      value: {
        clipboard: {
          writeText,
        },
      },
      writable: true,
    });

    await expect(copyToClipboard("summary")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("summary");
  });

  it("falls back to execCommand when navigator.clipboard is unavailable", async () => {
    const appendChild = vi.fn();
    const focus = vi.fn();
    const select = vi.fn();
    const remove = vi.fn();
    const execCommand = vi.fn().mockReturnValue(true);

    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
    });

    Object.defineProperty(globalThis, "document", {
      value: {
        activeElement: {
          focus,
        },
        body: {
          appendChild,
        },
        createElement: vi.fn().mockReturnValue({
          value: "",
          style: {},
          setAttribute: vi.fn(),
          focus,
          select,
          remove,
        }),
        execCommand,
      },
      writable: true,
    });

    await expect(copyToClipboard("summary")).resolves.toBe(true);
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledTimes(1);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(remove).toHaveBeenCalledTimes(1);
    expect(focus).toHaveBeenCalled();
  });

  it("falls back to execCommand when navigator.clipboard rejects", async () => {
    const execCommand = vi.fn().mockReturnValue(true);

    Object.defineProperty(globalThis, "navigator", {
      value: {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("insecure context")),
        },
      },
      writable: true,
    });

    Object.defineProperty(globalThis, "document", {
      value: {
        activeElement: null,
        body: {
          appendChild: vi.fn(),
        },
        createElement: vi.fn().mockReturnValue({
          value: "",
          style: {},
          setAttribute: vi.fn(),
          focus: vi.fn(),
          select: vi.fn(),
          remove: vi.fn(),
        }),
        execCommand,
      },
      writable: true,
    });

    await expect(copyToClipboard("summary")).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it("returns false when async clipboard and fallback both fail", async () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error("insecure context")),
        },
      },
      writable: true,
    });

    Object.defineProperty(globalThis, "document", {
      value: {
        activeElement: null,
        body: {
          appendChild: vi.fn(),
        },
        createElement: vi.fn().mockReturnValue({
          value: "",
          style: {},
          setAttribute: vi.fn(),
          focus: vi.fn(),
          select: vi.fn(),
          remove: vi.fn(),
        }),
        execCommand: vi.fn().mockReturnValue(false),
      },
      writable: true,
    });

    await expect(copyToClipboard("summary")).resolves.toBe(false);
  });

  it("returns false when document is unavailable", async () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
      writable: true,
    });

    Object.defineProperty(globalThis, "document", {
      value: undefined,
      writable: true,
    });

    await expect(copyToClipboard("summary")).resolves.toBe(false);
  });
});
