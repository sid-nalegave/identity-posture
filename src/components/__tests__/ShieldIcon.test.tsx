import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ShieldIcon } from "../ShieldIcon.tsx";

describe("ShieldIcon", () => {
  it("renders an svg element with aria-hidden", () => {
    const html = renderToStaticMarkup(<ShieldIcon />);
    expect(html).toContain("<svg");
    expect(html).toContain('aria-hidden="true"');
  });

  it("renders with the correct dimensions", () => {
    const html = renderToStaticMarkup(<ShieldIcon />);
    expect(html).toContain('width="18"');
    expect(html).toContain('height="18"');
  });

  it("renders the shield path", () => {
    const html = renderToStaticMarkup(<ShieldIcon />);
    expect(html).toContain("M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z");
  });

  it("applies the correct classes", () => {
    const html = renderToStaticMarkup(<ShieldIcon />);
    expect(html).toContain("shrink-0");
    expect(html).toContain("text-accent");
  });
});
