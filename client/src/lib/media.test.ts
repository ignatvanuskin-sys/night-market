import { describe, expect, it } from "vitest";
import { mediaSrcSet } from "./media";

describe("responsive media", () => {
  it("returns uploaded AVIF and WebP variants for catalog assets", () => {
    const source = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663894363217/XgTNBfpPRvrnTFPr.jpg";
    expect(mediaSrcSet(source, "avif")).toContain("/manus-storage/hero-480_09c94d8d.avif 480w");
    expect(mediaSrcSet(source, "webp")).toContain("/manus-storage/hero-1200_d77a1625.webp 1200w");
  });

  it("returns no generated variants for unknown sources", () => {
    expect(mediaSrcSet("https://example.com/image.jpg", "webp")).toBeUndefined();
  });
});
