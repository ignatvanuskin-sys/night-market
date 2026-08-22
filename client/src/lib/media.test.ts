import { describe, expect, it } from "vitest";
import { mediaSrcSet } from "./media";

describe("responsive media", () => {
  it("returns public CDN fallback sources for catalog assets", () => {
    const source = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/XgTNBfpPRvrnTFPr.jpg";
    const avif = mediaSrcSet(source, "avif");
    const webp = mediaSrcSet(source, "webp");
    expect(avif).toContain("https://files.manuscdn.com/");
    expect(webp).toContain("https://files.manuscdn.com/");
    expect(avif).not.toContain("/manus-storage/");
    expect(webp).not.toContain("/manus-storage/");
  });

  it("returns no generated variants for unknown sources", () => {
    expect(mediaSrcSet("https://example.com/image.jpg", "webp")).toBeUndefined();
  });
});
