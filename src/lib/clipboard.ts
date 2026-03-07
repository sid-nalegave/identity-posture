function fallbackCopyToClipboard(text: string): boolean {
  if (typeof document === "undefined" || typeof document.createElement !== "function") {
    return false;
  }

  const activeElement =
    typeof document.activeElement === "object" && document.activeElement !== null
      ? document.activeElement
      : null;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";

  try {
    document.body?.appendChild(textarea);
    textarea.focus();
    textarea.select();

    if (typeof document.execCommand !== "function") {
      return false;
    }

    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();

    if (activeElement && "focus" in activeElement && typeof activeElement.focus === "function") {
      activeElement.focus();
    }
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to document-based copy if async clipboard is unavailable or rejected.
  }

  return fallbackCopyToClipboard(text);
}
